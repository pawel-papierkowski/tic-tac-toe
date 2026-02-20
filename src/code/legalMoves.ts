/**
 * Naive implementation of Tic-Tac-Toe AI.
 */
import type { Ref } from 'vue';
import type { GameState, LegalMove, PointsData, MoveProps, MiniMaxResult } from '@/code/data/types.ts';
import { createLegalMove } from '@/code/data/types.ts';
import { EnCellState, EnDifficulty } from '@/code/data/enums.ts';
import { defScoringData, weightData, gameConfig } from '@/code/data/data.ts'; // cellStateDescr
import { resolveMiniMax } from '@/code/miniMax.ts';

/**
 * Tries to find all legal moves and score them.
 * @param gameState Reference to game state.
 * @param who Who is making move? Crosses or naughts?
 * @returns Array of legal moves. If array is empty, no move is possible, making it tie.
 */
export function resolveAllLegalMoves(gameState: Ref<GameState>, who: EnCellState): LegalMove[] {
  let miniMaxResult : MiniMaxResult | null = null;
  if (gameState.value.settings.difficulty === EnDifficulty.Impossible || gameState.value.debugSettings.debugMode) {
    // Find out best move according to MiniMax algorithm.
    miniMaxResult = resolveMiniMax(gameState.value.board.cells, who, gameConfig.maxDepth);
  }

  // Game is simple enough that we can just brute-force it.
  // Find all legal moves and assign scoring data to each one. Used mostly on lower difficulties.
  const legalMoves: LegalMove[] = []; // empty array
  for (let x = 0; x < 3; x++) {
    for (let y = 0; y < 3; y++) {
      if (gameState.value.board.cells[x]![y] != EnCellState.Empty) continue; // Any empty cell is legal move.

      // We use MiniMaxResult only if it exists and is for this cell.
      const locMiniMaxResult = (miniMaxResult !== null && x === miniMaxResult.x && y === miniMaxResult.y) ? miniMaxResult : null;
      const legalMove = resolveLegalMove(gameState, who, x, y, locMiniMaxResult);
      legalMoves.push(legalMove);
    }
  }

  //console.log(`resolveAllLegalMoves() called by ${cellStateDescr[who]}. ${legalMoves.length} move(s) found.`);
  return legalMoves;
}

/**
 * Create legal move and fill it properly with data so AI can use it later.
 * @param gameState Reference to game state.
 * @param who Who is making move? Crosses or naughts?
 * @param x X coordinate of cell.
 * @param y Y coordinate of cell.
 * @param miniMaxResult MiniMax algo result, if any.
 * @returns Created and filled legal move.
 */
export function resolveLegalMove(gameState: Ref<GameState>, who: EnCellState, x: number, y: number, miniMaxResult : MiniMaxResult | null): LegalMove {
  const legalMove = createLegalMove(who, x, y);

  // calculations for you
  fillMoveProps(gameState, legalMove.props, who, x, y);
  // calculations for opponent
  const otherWho: EnCellState = who === EnCellState.X ? EnCellState.O : EnCellState.X;
  fillMoveProps(gameState, legalMove.oppProps, otherWho, x, y);

  // final scoring/weighting
  legalMove.miniMax = miniMaxResult !== null ? miniMaxResult.score : 0;
  legalMove.score = calcMovePoints(gameState, legalMove, defScoringData);
  legalMove.weight = calcMovePoints(gameState, legalMove, weightData[gameState.value.settings.difficulty]); // note in many cases score === weight
  return legalMove;
}

/**
 * Fill move properties.
 * @param you If true, move properties are calculated for you, otherwise for opponent.
 * @param gameState Reference to game state.
 * @param moveProps Move properties to fill.
 * @param who Who is making move? Crosses or naughts?
 * @param x X coordinate of cell.
 * @param y Y coordinate of cell.
 */
function fillMoveProps(gameState: Ref<GameState>, moveProps: MoveProps, who: EnCellState, x: number, y: number) {
  moveProps.win = calcWin(gameState.value.board.cells, who, x, y);
  moveProps.lineUp = calcLineUp(gameState.value.board.cells, who, x, y);
  moveProps.fork = calcFork(moveProps);
}

//

/**
 * Check if given move is winning move.
 * @param board Game board.
 * @param who Who is making move? Crosses or naughts?
 * @param x X coordinate of cell.
 * @param y Y coordinate of cell.
 * @returns True if move is win, otherwise false.
 */
function calcWin(board: EnCellState[][], who: EnCellState, x: number, y: number): boolean {
  // check horizontal line
  const otherX1 = x === 1 ? 0 : 1;
  const otherX2 = x === 2 ? 0 : 2;
  if (board[otherX1]![y] === who && board[otherX2]![y] === who) return true;

  // check vertical line
  const otherY1 = y === 1 ? 0 : 1;
  const otherY2 = y === 2 ? 0 : 2;
  if (board[x]![otherY1] === who && board[x]![otherY2] === who) return true;

  // check diagonal / line: coords 0,2 and 1,1 and 2,0
  if ((x === 0 && y === 2) || (x === 1 && y === 1) || (x === 2 && y === 0)) {
    const crossX1 = x === 0 ? 1 : 0;
    const crossY1 = y === 2 ? 1 : 2;
    const crossX2 = x === 2 ? 1 : 2;
    const crossY2 = y === 0 ? 1 : 0;
    if (board[crossX1]![crossY1] === who && board[crossX2]![crossY2] === who) return true;
  }

  // check diagonal \ line: coords 0,0 and 1,1 and 2,2
  if (x === y) {
    const cross1 = x === 1 ? 0 : 1;
    const cross2 = x === 2 ? 0 : 2;
    if (board[cross1]![cross1] === who && board[cross2]![cross2] === who) return true;
  }

  return false;
}

//

/**
 * Count X/O that are lined up with this move.
 * Example: For board below, playing as cross (? represents empty cell):
 * ??X
 * ???
 * X?X
 * For move 0,0 you will get value of lineUp 3 (three X's). For 0,1 or 1,0 move you will get lineUp = 1.
 * Note lineup counts only if cells on line are either empty or your marks.
 * @param board Game board.
 * @param who Who is making move? Crosses or naughts?
 * @param x X coordinate of cell.
 * @param y Y coordinate of cell.
 * @returns Amount of your marks that are lined up with this move.
 */
function calcLineUp(board: EnCellState[][], who: EnCellState, x: number, y: number): number {
  let lineUpCount = 0;
  // Note code is similar to calcWin().
  // check horizontal line
  const otherX1 = x === 1 ? 0 : 1;
  const otherX2 = x === 2 ? 0 : 2;
  lineUpCount += checkLineUp(who, board[otherX1]![y]!, board[otherX2]![y]!);

  // check vertical line
  const otherY1 = y === 1 ? 0 : 1;
  const otherY2 = y === 2 ? 0 : 2;
  lineUpCount += checkLineUp(who, board[x]![otherY1]!, board[x]![otherY2]!);

  // check cross /: coords 0,2 and 1,1 and 2,0
  if ((x === 0 && y === 2) || (x === 1 && y === 1) || (x === 2 && y === 0)) {
    const crossX1 = x === 0 ? 1 : 0;
    const crossY1 = y === 2 ? 1 : 2;
    const crossX2 = x === 2 ? 1 : 2;
    const crossY2 = y === 0 ? 1 : 0;
    lineUpCount += checkLineUp(who, board[crossX1]![crossY1]!, board[crossX2]![crossY2]!);
  }

  // check cross \: coords 0,0 and 1,1 and 2,2
  if (x === y) {
    const cross1 = x === 1 ? 0 : 1;
    const cross2 = x === 2 ? 0 : 2;
    lineUpCount += checkLineUp(who, board[cross1]![cross1]!, board[cross2]![cross2]!);
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
function checkLineUp(who: EnCellState, cell1: EnCellState, cell2: EnCellState): number {
  let lineUpCount = 0;
  if (cell1 === who) lineUpCount++;
  else if (cell1 !== EnCellState.Empty) return 0;
  if (cell2 === who) lineUpCount++;
  else if (cell2 !== EnCellState.Empty) return 0;
  return lineUpCount;
}

/**
 * Detect if this move will produce immediate fork for you.
 * @param moveProps Move properties.
 * @returns True if fork is created with this move, otherwise false.
 */
function calcFork(moveProps: MoveProps): boolean {
  // It is impossible to have 2 or more lineup that is not winning move AND is not fork.
  if (moveProps.lineUp >= 2 && !moveProps.win) return true;
  return false;
}

//

/**
 * Calculate points (score/weight) for given move.
 * Criteria:
 * - if impossible difficulty, only miniMax score is taken in account
 * - basic point value
 * - more points for center position or corners
 * - more points if you have other X/O lined up already
 * - more points if this move allows fork
 * - add miniMax score to make move more or less likely
 * - bigger bonus if move prevents opponent win
 * - very large bonus if winning move detected
 * @param gameState Reference to game state.
 * @param move Move that needs point calculation.
 * @param pointsData Data about point rewards.
 * @returns Calculated point value.
 */
function calcMovePoints(gameState: Ref<GameState>, move: LegalMove, pointsData: PointsData): number {
  if (gameState.value.settings.difficulty === EnDifficulty.Impossible) return move.miniMax;

  // First, points for position.
  let points = calcPositionPoints(move, pointsData);
  // Line up bonus.
  points += move.props.lineUp * pointsData.bonusLineUp;
  // Fork bonus.
  if (move.props.fork) points += pointsData.bonusFork; // faciliate your fork
  if (move.oppProps.fork) points += pointsData.bonusPreventFork; // prevent opponent's fork
  // Minimax bonus.
  points += move.miniMax*pointsData.mulMiniMax;

  // Win checks for you and opponent.
  if (move.props.win) points += pointsData.bonusWin;
  if (move.oppProps.win) points += pointsData.bonusPreventLoss;
  return points;
}

/**
 * Calculates basic score for positioning.
 * @param move Move that needs point calculation.
 * @param pointsData Data about point rewards.
 * @returns Points for positioning.
 */
function calcPositionPoints(move: LegalMove, pointsData: PointsData): number {
  let points = pointsData.posBasic; // basic points for move
  if ((move.x === 0 || move.x === 2) && (move.y === 0 || move.y === 2)) points = pointsData.posCorner; // corner position has higher points
  if (move.x === 1 && move.y === 1) points = pointsData.posCenter; // center position has significantly higher points
  return points;
}
