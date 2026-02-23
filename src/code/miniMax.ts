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
import type { Position } from '@vueuse/core';

import type { Line3, MiniMaxResult } from '@/code/data/types.ts';
import { createMiniMaxResult } from '@/code/data/types.ts';
import { EnCellState } from '@/code/data/enums.ts';
import { cellStateDescr, miniMaxScoring, line3array } from '@/code/data/data.ts'; //cellStateDescr

/**
 * Resolve minimax score based of given state of board.
 * @param who Who is making move? Crosses or naughts?
 * @param maxDepth Maximum depth to go.
 * @param board Board state for this move.
 * @returns MiniMax result.
 */
export function resolveMiniMax(who: EnCellState, maxDepth: number, board: EnCellState[][]): MiniMaxResult {
  // Starting data for beginning of recursive chain.
  const miniMaxResult = recursiveMiniMax(who, true, 0, maxDepth, board, []);
  console.log("Found move: ", miniMaxResult);
  return miniMaxResult;
}

/**
 * Calculates miniMax score recursively of current state of board.
 * @param who Who is making move? Crosses or naughts?
 * @param isYou If true, this is you (so maximizing). Otherwise it is opponent (so minimizing).
 * @param currDepth Current depth. Starts at 0 and increments for every recursive call.
 * @param maxDepth Maximum depth to go.
 * @param board Board state for this move.
 * @param moves Moves made so far.
 * @returns MiniMax result.
 */
function recursiveMiniMax(who: EnCellState, isYou : boolean, currDepth: number, maxDepth: number, board: EnCellState[][], moves: Position[]) : MiniMaxResult {
  //_printRecursiveMiniMax(who, isYou, currDepth, maxDepth, board, moves);
  const otherWho = who === EnCellState.X ? EnCellState.O : EnCellState.X;

  // first check states that stops recursive call
  let terminalResult : MiniMaxResult | null = null;
  if (checkWin(who, board)) terminalResult = {score: isYou ? miniMaxScoring.win : -miniMaxScoring.win, depth: currDepth, moves: [...moves]};
  else if (checkWin(otherWho, board)) terminalResult = {score: isYou ? -miniMaxScoring.win : miniMaxScoring.win, depth: currDepth, moves: [...moves]};
  else if (checkDraw(board)) terminalResult = {score: miniMaxScoring.draw, depth: currDepth, moves: [...moves]};
  else if (currDepth === maxDepth) { // hit max depth
    const whoAi = isYou ? who : otherWho; // we need to know who is who
    const whoHuman = isYou ? otherWho : who;
    const score = evaluate(whoAi, whoHuman, board);
    terminalResult = {score: score, depth: currDepth, moves: [...moves]};
  }

  if (terminalResult !== null) {
    //console.log("Terminal result: ", terminalResult);
    return terminalResult;
  }

  const results : MiniMaxResult[] = [];
  for (let nextX=0; nextX<3; nextX++) { // columns
    for (let nextY=0; nextY<3; nextY++) { // rows
      if (board[nextX]![nextY] !== EnCellState.Empty) continue; // cannot make move here

      board[nextX]![nextY] = who; // Make move as CURRENT player.
      moves.push({x: nextX, y: nextY}); // Remember that move.

      // Swap to other player and find deeper moves.
      const result = recursiveMiniMax(otherWho, !isYou, currDepth+1, maxDepth, board, moves);
      results.push(result);

      moves.pop(); // Unmake that move.
      board[nextX]![nextY] = EnCellState.Empty;
    }
  }
  const bestResult = evaluateAllResults(results, isYou, currDepth);
  //console.log("Best (non-terminal) result: ", bestResult);
  return bestResult;
}

/**
 * Find best result from array of results.
 * @param results All results from current depth resolved for given state of board.
 * @param isYou If true, this is you (so maximizing). Otherwise it is opponent (so minimizing).
 * @param currDepth Current depth. Starts at 0 and increments for every recursive call.
 * @returns Best result found.
 */
function evaluateAllResults(results: MiniMaxResult[], isYou: boolean, currDepth: number) : MiniMaxResult {
  let bestResult = createMiniMaxResult();
  bestResult.depth = currDepth;
  bestResult.score = isYou ? -miniMaxScoring.max : miniMaxScoring.max;

  // Make sure to pick the best score.
  for (const result of results) {
    if (isYou) { // find best result for you
      if (result.score > bestResult.score) bestResult = result;
      else if (result.score === bestResult.score) {
        if (result.depth <= bestResult.depth) bestResult = result;
      }
    } else { // find best result for opponent
      if (result.score < bestResult.score) bestResult = result;
      else if (result.score === bestResult.score) {
        if (result.depth <= bestResult.depth) bestResult = result;
      }
    }
  }
  return bestResult;
}

//

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
 * @param whoYou Who is you.
 * @param whoOpponent Who is opponent.
 * @param board State of board.
 * @returns Score for this board.
 */
export function evaluate(whoYou: EnCellState, whoOpponent: EnCellState, board: EnCellState[][]) : number {
  let score = 0;
  // go over all lines on grid: horizontal, vertical and diagonal
  for (const line3entry of line3array) {
    score += evaluateLine(whoYou, whoOpponent, board, line3entry);
  }
  return score;
}

/**
 * Evaluate given line.
 * @param whoYou Who is you.
 * @param whoOpponent Who is opponent.
 * @param board State of board.
 * @param line Line data: coordinates of three lined up cells that you need to check.
 * @returns Score for this line.
 */
function evaluateLine(whoYou: EnCellState, whoOpponent: EnCellState, board: EnCellState[][], line : Line3) : number {
  let score = 0;
  // check first cell
  if (board[line.x1]![line.y1] === whoYou) score = miniMaxScoring.inLine1;
  else if (board[line.x1]![line.y1] === whoOpponent) score = -miniMaxScoring.inLine1;

  // check second cell
  if (board[line.x2]![line.y2] === whoYou) {
    if (score === miniMaxScoring.inLine1) score = miniMaxScoring.inLine2; // this cell is you
    else if (score === -miniMaxScoring.inLine1) return miniMaxScoring.other; // this cell is opponent
    else score = miniMaxScoring.inLine1; // this cell is empty
  } else if (board[line.x2]![line.y2] === whoOpponent) {
    if (score === -miniMaxScoring.inLine1) score = -miniMaxScoring.inLine2; // this cell is opponent
    else if (score === miniMaxScoring.inLine1) return miniMaxScoring.other; // this cell is you
    else score = -miniMaxScoring.inLine1; // this cell is empty
  }

  // check third cell
  if (board[line.x3]![line.y3] === whoYou) {
    if (score < 0) return miniMaxScoring.other; // first and/or second cell is opponent
    else if (score > miniMaxScoring.inLine1) return miniMaxScoring.inLine3;  // both cells is you
    else if (score > 0) return miniMaxScoring.inLine2;  // first and/or second cell is you
    else return miniMaxScoring.inLine1;
  } else if (board[line.x3]![line.y3] === whoOpponent) {
    if (score > 0) return miniMaxScoring.other; // first and/or second cell is ayoui
    else if (score < -miniMaxScoring.inLine1) return -miniMaxScoring.inLine3; // both cells is opponent
    else if (score < 0) return -miniMaxScoring.inLine2; // first and/or second cell is opponent
    else return -miniMaxScoring.inLine1;
  }
  return score;
}

////////
// DEBUG
////////

function _printRecursiveMiniMax(who: EnCellState, isYou : boolean, currDepth: number, maxDepth: number, board: EnCellState[][], moves: Position[]) {
  const lastX = moves[moves.length-1]?.x;
  const lastY = moves[moves.length-1]?.y;
  console.log(`recursiveMiniMax(who=${cellStateDescr[who]}, isYou=${isYou}, currDepth=${currDepth}, maxDepth=${maxDepth}) called. LastX=${lastX}, lastY=${lastY}).`);
}
