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
import type { Ref } from 'vue';
import type { GameState, Line3 } from '@/code/data/types.ts';
import { EnCellState } from '@/code/data/enums.ts';
import { miniMaxScoring, line3array } from '@/code/data/data.ts';

/**
 * Resolve minimax score. Should be called only when current player is AI.
 * @param gameState Reference to game state.
 * @param who Who is making move? Crosses or naughts?
 * @returns MiniMax score.
 */
export function resolveMiniMax(gameState: Ref<GameState>, who: EnCellState): number {
  // depth of two is enough to detect fork attempts
  return recursiveMiniMax(who, true, 2, gameState.value.board.cells);
}

/**
 * Calculates miniMax score recursively.
 * @param who Who is making move? Crosses or naughts?
 * @param isAi If true, this is AI (so maximizing). Otherwise it is human player (so minimizing).
 * @param maxDepth Maximum depth to go.
 * @param board Board state for this move. Must be full copy.
 * @returns Score.
 */
function recursiveMiniMax(who: EnCellState, isAi : boolean, maxDepth: number, board: EnCellState[][]) : number {
  if (checkWin(who, board)) return isAi ? miniMaxScoring.win : -miniMaxScoring.win;
  if (checkDraw(board)) return miniMaxScoring.draw;

  const otherWho = who === EnCellState.X ? EnCellState.O : EnCellState.X;
  if (maxDepth === 0) { // hit max depth
    const whoAi = isAi ? who : otherWho; // we need to know who is max and who is min
    const whoHuman = isAi ? otherWho : who;
    return evaluate(whoAi, whoHuman, board);
  }

  let bestScore = isAi ? -miniMaxScoring.max : miniMaxScoring.max;
  for (let x=0; x<3; x++) { // columns
    for (let y=0; y<3; y++) { // rows
      if (board[x]![y] !== EnCellState.Empty) continue; // cannot make move here
      board[x]![y] = who; // Make move as current player.

      // Evaluate next move from point of view of other player.
      const score = recursiveMiniMax(otherWho, !isAi, maxDepth-1, board);

      board[x]![y] = EnCellState.Empty; // Unmake move.
      // Make sure to pick best score.
      if (isAi) bestScore = score > bestScore ? score : bestScore;
      else bestScore = score < bestScore ? score : bestScore;
    }
  }
  return bestScore;
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
  return true;
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

