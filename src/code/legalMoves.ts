import type { Ref } from 'vue';
import type { GameState, LegalMove } from './types.ts';
import { EnCellState, EnDifficulty, createLegalMove } from './types.ts';

/**
 * Tries to find legal moves.
 * @param gameState Reference to game state.
 * @param who Who is making move? Crosses or naughts?
 * @param calcScore If true, calculate score, otherwise score is always 0
 * @returns Array of legal moves. If array is empty, no move is possible, making it tie.
 */
export function resolveLegalMoves(gameState : Ref<GameState>, who: EnCellState, calcScore : boolean) : LegalMove[] {
  console.log("resolveLegalMoves() called.");

  // Game is simple enough that we can just brute-force it.
  // Find all legal moves and assign score to each one.
  const legalMoves : LegalMove[] = []; // empty array
  for (let x=0; x<3; x++) {
    for (let y=0; y<3; y++) {
      if (gameState.value.board.cells[x]![y] != EnCellState.Empty) continue;
      const legalMove = fillLegalMove(gameState, who, x, y, calcScore);
      legalMoves.push(legalMove);
    }
  }
  return legalMoves;
}

/**
 * Create legal move and fill it properly with data so AI can use it later.
 * @param gameState Reference to game state.
 * @param who Who is making move? Crosses or naughts?
 * @param x X coordinate of cell.
 * @param y Y coordinate of cell.
 * @param calcScore If true, calculate score and other data.
 * @returns Created and filled legal move.
 */
export function fillLegalMove(gameState : Ref<GameState>, who: EnCellState, x: number, y: number, calcScore : boolean) : LegalMove {
  const legalMove = createLegalMove(who, x, y);
  if (calcScore) {
    legalMove.win = calcWin(gameState, who, x, y);
    legalMove.preventLoss = calcPreventLoss(gameState, who, x, y);
    legalMove.lineUp = calcLineUp(gameState, who, x, y);
    legalMove.score = calcMoveScore(legalMove);
    legalMove.weight = calcMoveWeight(gameState, legalMove);
  }
  return legalMove;
}

//

/**
 * Check if given move is winning move.
 * @param gameState Reference to game state.
 * @param who Who is making move? Crosses or naughts?
 * @param x X coordinate of cell.
 * @param y Y coordinate of cell.
 * @returns True if move is win, otherwise false.
 */
function calcWin(gameState : Ref<GameState>, who: EnCellState, x: number, y: number) : boolean {
  // check horizontal line
  const otherX1 = x === 1 ? 0 : 1;
  const otherX2 = x === 2 ? 0 : 2;
  if (gameState.value.board.cells[otherX1]![y] === who && gameState.value.board.cells[otherX2]![y] === who) return true;

  // check vertical line
  const otherY1 = y === 1 ? 0 : 1;
  const otherY2 = y === 2 ? 0 : 2;
  if (gameState.value.board.cells[x]![otherY1] === who && gameState.value.board.cells[x]![otherY2] === who) return true;

  // check cross /: coords 0,2 and 1,1 and 2,0
  if ((x === 0 && y === 2) || (x === 1 && y === 1) || (x === 2 && y === 0)) {
    const crossX1 = x===0 ? 1 : 0;
    const crossY1 = y===2 ? 1 : 2;
    const crossX2 = x===2 ? 1 : 2;
    const crossY2 = y===0 ? 1 : 0;
    if (gameState.value.board.cells[crossX1]![crossY1] === who && gameState.value.board.cells[crossX2]![crossY2] === who) return true;
  }

  // check cross \: coords 0,0 and 1,1 and 2,2
  if (x === y) {
    const cross1 = x === 1 ? 0 : 1;
    const cross2 = x === 2 ? 0 : 2;
    if (gameState.value.board.cells[cross1]![cross1] === who && gameState.value.board.cells[cross2]![cross2] === who) return true;
  }

  return false;
}

/**
 * Check if given move prevents win of opponent.
 * @param gameState Reference to game state.
 * @param who Who is making move? Crosses or naughts?
 * @param x X coordinate of cell.
 * @param y Y coordinate of cell.
 * @returns True if move is win, otherwise false.
 */
function calcPreventLoss(gameState : Ref<GameState>, who: EnCellState, x: number, y: number) : boolean {
  // We simply check for win of opponent.
  const otherWho : EnCellState = who === EnCellState.X ? EnCellState.O : EnCellState.X;
  return calcWin(gameState, otherWho, x, y);
}

/**
 * Count X/O that are lined up with this move. Example:
 * For this board, playing as cross:
 * ??X
 * ???
 * X?X
 * For move 0,0 you will get value of lineUp 3 (three X's). For 0,1 or 1,0 move you will get lineUp = 1.
 * Note lineup counts only if cells on line are either empty or your marks.
 * @param gameState Reference to game state.
 * @param who Who is making move? Crosses or naughts?
 * @param x X coordinate of cell.
 * @param y Y coordinate of cell.
 * @returns Amount of X/O that are lined up with this move.
 */
function calcLineUp(gameState : Ref<GameState>, who: EnCellState, x: number, y: number) : number {
  let lineUpCount = 0;
  // Note code is similar to calcWin().
  // check horizontal line
  const otherX1 = x === 1 ? 0 : 1;
  const otherX2 = x === 2 ? 0 : 2;
  lineUpCount += checkLineUp(who, gameState.value.board.cells[otherX1]![y]!, gameState.value.board.cells[otherX2]![y]!);

  // check vertical line
  const otherY1 = y === 1 ? 0 : 1;
  const otherY2 = y === 2 ? 0 : 2;
  lineUpCount += checkLineUp(who, gameState.value.board.cells[x]![otherY1]!, gameState.value.board.cells[x]![otherY2]!);

  // check cross /: coords 0,2 and 1,1 and 2,0
  if ((x === 0 && y === 2) || (x === 1 && y === 1) || (x === 2 && y === 0)) {
    const crossX1 = x===0 ? 1 : 0;
    const crossY1 = y===2 ? 1 : 2;
    const crossX2 = x===2 ? 1 : 2;
    const crossY2 = y===0 ? 1 : 0;
    lineUpCount += checkLineUp(who, gameState.value.board.cells[crossX1]![crossY1]!, gameState.value.board.cells[crossX2]![crossY2]!);
  }

  // check cross \: coords 0,0 and 1,1 and 2,2
  if (x === y) {
    const cross1 = x === 1 ? 0 : 1;
    const cross2 = x === 2 ? 0 : 2;
    lineUpCount += checkLineUp(who, gameState.value.board.cells[cross1]![cross1]!, gameState.value.board.cells[cross2]![cross2]!);
  }
  return lineUpCount;
}

/**
 * Counts line up at given line (horizontal, vertical or cross).
 * @param who Who is making move? Crosses or naughts?
 * @param cell1 First cell of lineup.
 * @param cell2 Second cell of lineup.
 * @returns Count of lineups.
 */
function checkLineUp(who: EnCellState, cell1: EnCellState, cell2: EnCellState) : number {
  let lineUpCount = 0;
  if (cell1 === who) lineUpCount++;
  else if (cell1 !== EnCellState.Empty) return 0;
  if (cell2 === who) lineUpCount++;
  else if (cell2 !== EnCellState.Empty) return 0;
  return lineUpCount;
}

/**
 * Calculate score for given move.
 * TODO: need fork prediction to have truly perfect AI
 * Criteria:
 * - basic score
 * - more points for center position
 * - more points if you have other X/O lined up already
 * - even more points if this move prevents fork in future (TODO)
 * - bigger bonus if move prevents opponent win
 * - very large bonus if winning move detected
 * @param move Move that needs score calculation.
 * @returns Calculated score.
 */
function calcMoveScore(move: LegalMove) : number {
  let score = 10; // basic score for move
  if (move.x === 1 && move.y === 1) score = 50; // center position has higher score
  score += move.lineUp*25; // line up bonus
  // todo: fork bonus
  if (move.preventLoss) score += 1000;
  if (move.win) score += 100000;
  return score;
}

/**
 * Calculate weight for given move.
 * @param gameState Reference to game state.
 * @param move Move that needs weight calculation.
 * @returns Calculated weight.
 */
function calcMoveWeight(gameState : Ref<GameState>, move: LegalMove) : number {
   // On other difficulties weight is same as score.
  if (gameState.value.settings.difficulty !== EnDifficulty.Medium) return move.score;
  // Medium difficulty has special weights that make game easier than on hard.
  // AI is less likely to pick winning move etc.
  return 10;
}
