/**
 * Implementation of Tic-Tac-Toe AI using recursive Minimax algorithm.
 * Idea: minimize the maximum possible loss.
 * Evaulation function:
 * - +100 for EACH 3-in-a-line for AI
 * - +10 for EACH 2-in-a-line (and one empty cell) for AI
 * - +1 for EACH 1-in-a-line (and two empty cells) for AI
 * - -100 for EACH 3-in-a-line for human
 * - -10 for EACH 2-in-a-line (and one empty cell) for human
 * - -1 for EACH 1-in-a-line (and two empty cells) for human
 * - all other get 0 (completely empty lines or lines with both AI and human marks)
 *
 * For medium and hard difficulty, this minimax score will be added to general score, making this move
 * more or less likely.
 * For impossible difficulty, minimax score is THE score.
 */
import type { Line3, MiniMaxResult } from '@/code/data/types.ts';
import { createMiniMaxResult } from '@/code/data/types.ts';
import { EnCellState } from '@/code/data/enums.ts';
import { miniMaxScoring, line3array } from '@/code/data/data.ts';

/**
 * Resolve minimax score. Should be called only when current player is AI.
 * Note move must be valid.
 * @param board Board state for this move.
 * @param who Who is making move? Crosses or naughts?
 * @param maxDepth Maximum depth to go.
 * @returns MiniMax result.
 */
export function resolveMiniMax(board: EnCellState[][], who: EnCellState, maxDepth: number): MiniMaxResult {
  // Starting data for beginning of recursive chain.
  const miniMaxResult = recursiveMiniMax(who, true, 0, maxDepth, board, -1, -1);
  console.log("Move: ", miniMaxResult);
  return miniMaxResult;
}

/**
 * Calculates miniMax score recursively.
 * @param who Who is making move? Crosses or naughts?
 * @param isAi If true, this is AI (so maximizing). Otherwise it is human player (so minimizing).
 * @param currDepth Current depth. Starts at 0 and increments for every recursive call.
 * @param maxDepth Maximum depth to go.
 * @param board Board state for this move.
 * @param x X coordinate of cell.
 * @param y Y coordinate of cell.
 * @returns MiniMax result.
 */
function recursiveMiniMax(who: EnCellState, isAi : boolean, currDepth: number, maxDepth: number, board: EnCellState[][], currX: number, currY: number) : MiniMaxResult {
  const otherWho = who === EnCellState.X ? EnCellState.O : EnCellState.X;
  if (checkWin(who, board)) return {score: isAi ? miniMaxScoring.win : -miniMaxScoring.win, depth: currDepth, x: currX, y: currY};
  if (checkWin(otherWho, board)) return {score: isAi ? -miniMaxScoring.win : miniMaxScoring.win, depth: currDepth, x: currX, y: currY};
  if (checkDraw(board)) return {score: miniMaxScoring.draw, depth: currDepth, x: currX, y: currY};

  if (currDepth === maxDepth) { // hit max depth
    const whoAi = isAi ? who : otherWho; // we need to know who is max and who is min
    const whoHuman = isAi ? otherWho : who;
    const score = evaluate(whoAi, whoHuman, board);
    return {score: score, depth: currDepth, x: currX, y: currY};
  }

  let bestResult = createMiniMaxResult();
  bestResult.depth = currDepth;
  bestResult.score = isAi ? -miniMaxScoring.max : miniMaxScoring.max;
  for (let nextX=0; nextX<3; nextX++) { // columns
    for (let nextY=0; nextY<3; nextY++) { // rows
      if (board[nextX]![nextY] !== EnCellState.Empty) continue; // cannot make move here
      board[nextX]![nextY] = who; // Make move as CURRENT player.

      // Make sure to pick best score.
      if (isAi) {
        // Evaluate next move from point of view of human player.
        const result = recursiveMiniMax(otherWho, false, currDepth+1, maxDepth, board, nextX, nextY);
        if (result.score > bestResult.score) bestResult = result;
        else if (result.score === bestResult.score) {
          if (result.depth <= bestResult.depth) bestResult = result;
        }
      } else {
        // Evaluate next move from point of view of AI player.
        const result = recursiveMiniMax(who, true, currDepth+1, maxDepth, board, nextX, nextY);
        if (result.score < bestResult.score) bestResult = result;
        else if (result.score === bestResult.score) {
          if (result.depth <= bestResult.depth) bestResult = result;
        }
      }
      board[nextX]![nextY] = EnCellState.Empty; // Unmake move.
    }
  }
  return bestResult;
}

/**
 * Check if given mark has winning state for given board.
 * @param who Crosses or naughts?
 * @param board Board state.
 */
function checkWin(who: EnCellState, board: EnCellState[][]) : boolean {
  for (let x=0; x<3; x++) { // columns
    if (board[x]![0] === who && board[x]![1] === who && board[x]![2] === who) return true;
  }
  for (let y=0; y<3; y++) { // rows
    if (board[0]![y] === who && board[1]![y] === who && board[2]![y] === who) return true;
  }
  // diagonals
    if (board[0]![0] === who && board[1]![1] === who && board[2]![2] === who) return true;
    if (board[2]![0] === who && board[1]![1] === who && board[0]![2] === who) return true;
  return false;
}

/**
 * Check if given board has draw state. Draw state is when you canne make any move anymore.
 * @param board Board state.
 * @returns True if board is in draw state, otherwise false.
 */
function checkDraw(board: EnCellState[][]) : boolean {
  for (let x=0; x<3; x++) { // columns
    for (let y=0; y<3; y++) { // rows
      if (board[x]![y] === EnCellState.Empty) return false; // at least one empty cell
    }
  }
  return true; // entire board is filled, no move possible
}

/**
 * Evaluate current state of board.
 * @param whoAi Who is AI.
 * @param whoHuman Who is human.
 * @param board State of board.
 * @returns Score for this board.
 */
export function evaluate(whoAi: EnCellState, whoHuman: EnCellState, board: EnCellState[][]) : number {
  let score = 0;
  // go over all lines on grid: horizontal, vertical and diagonal
  for (const line3entry of line3array) {
    score += evaluateLine(whoAi, whoHuman, board, line3entry);
  }
  return score;
}

/**
 * Evaluate given line.
 * @param whoAi Who is AI.
 * @param whoHuman Who is human.
 * @param board State of board.
 * @param line Line data: coordinates of three lined up cells that you need to check.
 * @returns Score for this line.
 */
function evaluateLine(whoAi: EnCellState, whoHuman: EnCellState, board: EnCellState[][], line : Line3) : number {
  let score = 0;
  // check first cell
  if (board[line.x1]![line.y1] === whoAi) score = miniMaxScoring.inLine1;
  else if (board[line.x1]![line.y1] === whoHuman) score = -miniMaxScoring.inLine1;

  // check second cell
  if (board[line.x2]![line.y2] === whoAi) {
    if (score === miniMaxScoring.inLine1) score = miniMaxScoring.inLine2; // this cell is ai
    else if (score === -miniMaxScoring.inLine1) return miniMaxScoring.other; // this cell is human
    else score = miniMaxScoring.inLine1; // this cell is empty
  } else if (board[line.x2]![line.y2] === whoHuman) {
    if (score === -miniMaxScoring.inLine1) score = -miniMaxScoring.inLine2; // this cell is human
    else if (score === miniMaxScoring.inLine1) return miniMaxScoring.other; // this cell is ai
    else score = -miniMaxScoring.inLine1; // this cell is empty
  }

  // check third cell
  if (board[line.x3]![line.y3] === whoAi) {
    if (score < 0) return miniMaxScoring.other; // first and/or second cell is human
    else if (score > miniMaxScoring.inLine1) return miniMaxScoring.inLine3;  // both cells is ai
    else if (score > 0) return miniMaxScoring.inLine2;  // first and/or second cell is ai
    else return miniMaxScoring.inLine1;
  } else if (board[line.x3]![line.y3] === whoHuman) {
    if (score > 0) return miniMaxScoring.other; // first and/or second cell is ai
    else if (score < -miniMaxScoring.inLine1) return -miniMaxScoring.inLine3; // both cells is human
    else if (score < 0) return -miniMaxScoring.inLine2; // first and/or second cell is human
    else return -miniMaxScoring.inLine1;
  }
  return score;
}
