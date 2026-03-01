/**
 * Implementation of Tic-Tac-Toe AI and moves.
 * Has two parts: resolving best move via miniMax algo and resolving basic facts about move
 * (is this win, is this immediate fork, how many marks are lined up). All of these contribute to score
 * in way that allows implementation of difficulty levels.
 * Note miniMax algorithm itself is implemented in separate file.
 */
import type { Ref } from 'vue';
import type { GameState, LegalMove, PointsData, MoveProps, MiniMaxResult } from '@/code/data/types.ts';
import { createLegalMove } from '@/code/data/types.ts';
import { EnCellState, EnDifficulty } from '@/code/data/enums.ts';
import { defScoringData, weightData, gameConfig, gameProp, miniMaxScoring } from '@/code/data/data.ts'; // cellStateDescr
import { resolveMiniMax } from '@/code/miniMax.ts';

const CELL_FIRST = 0; // for X and Y
const CELL_CENTER = 1; // for X and Y
const CELL_LAST = 2; // for X and Y

/**
 * Tries to find all legal moves and score them.
 * @param gameState Reference to game state.
 * @param who Who is making move? Crosses or naughts?
 * @returns Array of legal moves. If array is empty, no move is possible, making it tie.
 */
export function resolveAllLegalMoves(gameState: Ref<GameState>, who: EnCellState): LegalMove[] {
  let miniMaxResult : MiniMaxResult | null = null;
  if (gameState.value.settings.difficulty !== EnDifficulty.Easy || gameState.value.debugSettings.debugMode) {
    // Find out best move according to MiniMax algorithm. It will contribute to score/weight for
    // lower difficulties and it will be the score on impossible difficulty.
    // Easy is excluded because on this difficulty moves are chosen completely randomly.
    miniMaxResult = resolveMiniMax(who, gameConfig.maxDepth, gameState.value.board.cells);
  }

  // Game is simple enough that we can just brute-force it.
  // Find all legal moves and assign scoring data to each one.
  const legalMoves: LegalMove[] = []; // empty array
  for (let x = 0; x < gameProp.boardSize; x++) {
    for (let y = 0; y < gameProp.boardSize; y++) {
      if (gameState.value.board.cells[x]![y] !== EnCellState.Empty) continue; // Any empty cell is legal move.
      const legalMove = resolveLegalMove(gameState, who, x, y, miniMaxResult);
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
 * @param miniMaxResult MiniMax algo result for certain cell. Null means no result was generated at all.
 * @returns Created and filled legal move.
 */
export function resolveLegalMove(gameState: Ref<GameState>, who: EnCellState, x: number, y: number, miniMaxResult : MiniMaxResult | null): LegalMove {
  const legalMove = createLegalMove(who, x, y);

  // calculations for you
  fillMoveProps(gameState, legalMove.props, who, x, y);
  // calculations for opponent
  const otherWho: EnCellState = who === EnCellState.X ? EnCellState.O : EnCellState.X;
  fillMoveProps(gameState, legalMove.oppProps, otherWho, x, y);

  // final scoring/weighting based on props, miniMax and other data
  legalMove.miniMax = resolveMiniMaxScore(miniMaxResult, x, y);
  legalMove.score = calcMovePoints(gameState, legalMove, defScoringData);
  legalMove.weight = calcMovePoints(gameState, legalMove, weightData[gameState.value.settings.difficulty]);
  return legalMove;
}

/**
 * Finds out miniMax score.
 * @param miniMaxResult MiniMax result.
 * @param x X coordinate of cell.
 * @param y Y coordinate of cell.
 * @returns MiniMax score, if any, or null if no miniMax score for any reason.
 */
function resolveMiniMaxScore(miniMaxResult : MiniMaxResult | null, x: number, y: number) : number | null {
  // No miniMax result present or no moves available.
  if (miniMaxResult === null || miniMaxResult.moves.length === 0) return null;

  const bestMove = miniMaxResult.moves[0]; // get first move
  if (bestMove && x === bestMove.x && y === bestMove.y) return miniMaxResult.score;
  return null; // MiniMax result exists, but it is not for this cell.
}

/**
 * Fill move properties.
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
  const [otherX1, otherX2] = getOtherPositions(x);
  if (board[otherX1]![y] === who && board[otherX2]![y] === who) return true;

  // check vertical line
  const [otherY1, otherY2] = getOtherPositions(y);
  if (board[x]![otherY1] === who && board[x]![otherY2] === who) return true;

  // check diagonal \ line: coords 0,0 and 1,1 and 2,2
  if (isOnForwardDiagonal(x, y)) {
    const [diagonal1, diagonal2] = getForwardDiagonalPositions(x);
    if (board[diagonal1]![diagonal1] === who && board[diagonal2]![diagonal2] === who) return true;
  }

  // check backward diagonal / line: coords 0,2 and 1,1 and 2,0
  if (isOnBackwardDiagonal(x, y)) {
    const [diagonalX1, diagonalY1, diagonalX2, diagonalY2] = getBackwardDiagonalPositions(x, y);
    if (board[diagonalX1]![diagonalY1] === who && board[diagonalX2]![diagonalY2] === who) return true;
  }
  return false;
}

/**
 * Count X/O that are lined up with this move.
 * Example: For board below, playing as cross (? represents empty cell):
 * ??X
 * ???
 * X?X
 * For move 0,0 you will get value of lineUp 3 (three X's are lined up).
 * For 0,1 or 1,0 move you will get lineUp = 1.
 * Note lineup counts only if all cells on line are either empty or your marks.
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
  const [otherX1, otherX2] = getOtherPositions(x);
  lineUpCount += checkLineUp(who, board[otherX1]![y]!, board[otherX2]![y]!);

  // check vertical line
  const [otherY1, otherY2] = getOtherPositions(y);
  lineUpCount += checkLineUp(who, board[x]![otherY1]!, board[x]![otherY2]!);

  // check diagonal \: coords 0,0 and 1,1 and 2,2
  if (isOnForwardDiagonal(x, y)) {
    const [diagonal1, diagonal2] = getForwardDiagonalPositions(x);
    lineUpCount += checkLineUp(who, board[diagonal1]![diagonal1]!, board[diagonal2]![diagonal2]!);
  }

  // check backward diagonal /: coords 0,2 and 1,1 and 2,0
  if (isOnBackwardDiagonal(x, y)) {
    const [diagonalX1, diagonalY1, diagonalX2, diagonalY2] = getBackwardDiagonalPositions(x, y);
    lineUpCount += checkLineUp(who, board[diagonalX1]![diagonalY1]!, board[diagonalX2]![diagonalY2]!);
  }
  return lineUpCount;
}

/**
 * Resolves other positions given some position so all positions will always have 0, 1 and 2.
 * Cases:
 * - pos === 0 will return 1 and 2. Together 0, 1, 2.
 * - pos === 1 will return 0 and 2. Together 0, 1, 2.
 * - pos === 2 will return 0 and 1. Together 0, 1, 2.
 * @param pos Position on line. Allowed 0, 1 or 2.
 * @returns Two other positions that compliment given position.
 */
function getOtherPositions(pos: number): [number, number] {
  if (pos == CELL_FIRST) return [CELL_CENTER, CELL_LAST];
  if (pos == CELL_CENTER) return [CELL_FIRST, CELL_LAST];
  return [CELL_FIRST, CELL_CENTER];
}

/**
 * Resolves other positions for forward diagonal given some position.
 * @param pos Position on line. Allowed 0, 1 or 2.
 * @returns Two other coordinates that with given coordinate make forward diagonal.
 */
function getForwardDiagonalPositions(pos: number): [number, number] {
  const diagonal1 = pos === CELL_CENTER ? CELL_FIRST : CELL_CENTER;
  const diagonal2 = pos === CELL_LAST   ? CELL_FIRST : CELL_LAST;
  return [diagonal1, diagonal2];
}

/**
 * Resolves other positions for backward diagonal given some position.
 * @param x X coordinate.
 * @param y Y coordinate.
 * @returns Four other coordinates that with given coordinates make backward diagonal.
 */
function getBackwardDiagonalPositions(x: number, y: number): [number, number, number, number] {
  const diagonalX1 = x === CELL_FIRST ? CELL_CENTER : CELL_FIRST;
  const diagonalX2 = x === CELL_LAST ? CELL_CENTER : CELL_LAST;
  const diagonalY1 = y === CELL_LAST ? CELL_CENTER : CELL_LAST;
  const diagonalY2 = y === CELL_FIRST ? CELL_CENTER : CELL_FIRST;
  return [diagonalX1, diagonalY1, diagonalX2, diagonalY2];
}

/**
 * Check if given coordinates are on forward diagonal.
 * @param x X coordinate.
 * @param y Y coordinate.
 * @returns True if coordinates are on forward diagonal, otherwise false.
 */
function isOnForwardDiagonal(x: number, y: number): boolean {
  return x === y;
}

/**
 * Check if given coordinates are on backward diagonal.
 * @param x X coordinate.
 * @param y Y coordinate.
 * @returns True if coordinates are on backward diagonal, otherwise false.
 */
function isOnBackwardDiagonal(x: number, y: number): boolean {
  return (x === 0 && y === 2) || (x === 1 && y === 1) || (x === 2 && y === 0);
}

//

/**
 * Checks if two cells in a potential line (horizontal, vertical or diagonal) contain the player's
 * marks or are empty.
 * @param who Who is making move? Crosses or naughts?
 * @param cell1 First cell of lineup.
 * @param cell2 Second cell of lineup.
 * @returns Returns the count of player marks found (0, 1, or 2) that are lined up.
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
 * Detect if this move will produce immediate fork.
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
  if (gameState.value.settings.difficulty === EnDifficulty.Impossible) {
    // Impossible difficulty always uses MiniMax algorithm.
    // One move was selected (miniMax is not null). Rest cannot be chosen, so put large negative score.
    return move.miniMax ?? -miniMaxScoring.max;
  }

  // First, points for position.
  let points = calcPositionPoints(move, pointsData);
  // Line up bonus.
  points += move.props.lineUp * pointsData.bonusLineUp;
  // Fork bonus.
  if (move.props.fork) points += pointsData.bonusFork; // faciliate your fork
  if (move.oppProps.fork) points += pointsData.bonusPreventFork; // prevent opponent's fork
  // Minimax bonus. On difficulties other than impossible, miniMax merely makes this move more likely.
  if (move.miniMax !== null) points += move.miniMax*pointsData.mulMiniMax;

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
  if ((move.x === CELL_FIRST || move.x === CELL_LAST) && (move.y === CELL_FIRST || move.y === CELL_LAST))
    points = pointsData.posCorner; // corner position has higher reward
  if (move.x === CELL_CENTER && move.y === CELL_CENTER)
    points = pointsData.posCenter; // center position has significantly higher reward
  return points;
}
