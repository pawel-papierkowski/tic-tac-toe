import type { Ref } from 'vue';
import type { GameState, LegalMove, PointsData, MoveProps } from '@/code/data/types.ts';
import { createLegalMove } from '@/code/data/types.ts';
import { EnCellState } from '@/code/data/enums.ts';
import { defScoringData, weightData } from '@/code/data/data.ts'; // cellStateDescr

/**
 * Tries to find all legal moves.
 * @param gameState Reference to game state.
 * @param who Who is making move? Crosses or naughts?
 * @param calcScoring If true, calculate scoring data, otherwise scoring has default values.
 * @returns Array of legal moves. If array is empty, no move is possible, making it tie.
 */
export function resolveLegalMoves(gameState: Ref<GameState>, who: EnCellState, calcScoring: boolean): LegalMove[] {
  // Game is simple enough that we can just brute-force it.
  // Find all legal moves and assign scoring data to each one.
  const legalMoves: LegalMove[] = []; // empty array
  for (let x = 0; x < 3; x++) {
    for (let y = 0; y < 3; y++) {
      if (gameState.value.board.cells[x]![y] != EnCellState.Empty) continue;
      // Any empty cell is legal move.
      const legalMove = fillLegalMove(gameState, who, x, y, calcScoring);
      legalMoves.push(legalMove);
    }
  }
  //console.log(`resolveLegalMoves() called by ${cellStateDescr[who]}. ${legalMoves.length} move(s) found.`);
  return legalMoves;
}

/**
 * Create legal move and fill it properly with data so AI can use it later.
 * @param gameState Reference to game state.
 * @param who Who is making move? Crosses or naughts?
 * @param x X coordinate of cell.
 * @param y Y coordinate of cell.
 * @param calcScoring If true, calculate score and other data.
 * @returns Created and filled legal move.
 */
export function fillLegalMove(
  gameState: Ref<GameState>,
  who: EnCellState,
  x: number,
  y: number,
  calcScoring: boolean,
): LegalMove {
  const legalMove = createLegalMove(who, x, y);
  if (calcScoring) {
    // calculations for you
    fillMoveProps(gameState, legalMove.props, who, x, y);
    // calculations for opponent
    const otherWho: EnCellState = who === EnCellState.X ? EnCellState.O : EnCellState.X;
    fillMoveProps(gameState, legalMove.oppProps, otherWho, x, y);
    // final scoring/weighting
    legalMove.score = calcMovePoints(legalMove, defScoringData);
    legalMove.weight = calcMovePoints(legalMove, weightData[gameState.value.settings.difficulty]); // note in many cases score === weight
  }
  return legalMove;
}

/**
 * Fill move properties.
 * @param gameState Reference to game state.
 * @param moveProps Move properties to fill.
 * @param who Who is making move? Crosses or naughts?
 * @param x X coordinate of cell.
 * @param y Y coordinate of cell.
 */
function fillMoveProps(
  gameState: Ref<GameState>,
  moveProps: MoveProps,
  who: EnCellState,
  x: number,
  y: number,
) {
  moveProps.win = calcWin(gameState, who, x, y);
  moveProps.futWin = calcFutWin(gameState, who, x, y);
  moveProps.lineUp = calcLineUp(gameState, who, x, y);
  moveProps.fork = calcFork(gameState, who, x, y, moveProps);
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
function calcWin(gameState: Ref<GameState>, who: EnCellState, x: number, y: number): boolean {
  // check horizontal line
  const otherX1 = x === 1 ? 0 : 1;
  const otherX2 = x === 2 ? 0 : 2;
  if (gameState.value.board.cells[otherX1]![y] === who && gameState.value.board.cells[otherX2]![y] === who) return true;

  // check vertical line
  const otherY1 = y === 1 ? 0 : 1;
  const otherY2 = y === 2 ? 0 : 2;
  if (gameState.value.board.cells[x]![otherY1] === who && gameState.value.board.cells[x]![otherY2] === who) return true;

  // check diagonal / line: coords 0,2 and 1,1 and 2,0
  if ((x === 0 && y === 2) || (x === 1 && y === 1) || (x === 2 && y === 0)) {
    const crossX1 = x === 0 ? 1 : 0;
    const crossY1 = y === 2 ? 1 : 2;
    const crossX2 = x === 2 ? 1 : 2;
    const crossY2 = y === 0 ? 1 : 0;
    if (
      gameState.value.board.cells[crossX1]![crossY1] === who &&
      gameState.value.board.cells[crossX2]![crossY2] === who
    )
      return true;
  }

  // check diagonal \ line: coords 0,0 and 1,1 and 2,2
  if (x === y) {
    const cross1 = x === 1 ? 0 : 1;
    const cross2 = x === 2 ? 0 : 2;
    if (gameState.value.board.cells[cross1]![cross1] === who && gameState.value.board.cells[cross2]![cross2] === who)
      return true;
  }

  return false;
}

/**
 * Check if given move leads directly to winning move. Note it does not count if opponent can counter it with move that will win him game.
 * @param gameState Reference to game state.
 * @param who Who is making move? Crosses or naughts?
 * @param x X coordinate of cell.
 * @param y Y coordinate of cell.
 * @returns True if move is future win, otherwise false.
 */
function calcFutWin(gameState: Ref<GameState>, who: EnCellState, x: number, y: number): boolean {
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
 * @param gameState Reference to game state.
 * @param who Who is making move? Crosses or naughts?
 * @param x X coordinate of cell.
 * @param y Y coordinate of cell.
 * @returns Amount of your marks that are lined up with this move.
 */
function calcLineUp(gameState: Ref<GameState>, who: EnCellState, x: number, y: number): number {
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
    const crossX1 = x === 0 ? 1 : 0;
    const crossY1 = y === 2 ? 1 : 2;
    const crossX2 = x === 2 ? 1 : 2;
    const crossY2 = y === 0 ? 1 : 0;
    lineUpCount += checkLineUp(
      who,
      gameState.value.board.cells[crossX1]![crossY1]!,
      gameState.value.board.cells[crossX2]![crossY2]!,
    );
  }

  // check cross \: coords 0,0 and 1,1 and 2,2
  if (x === y) {
    const cross1 = x === 1 ? 0 : 1;
    const cross2 = x === 2 ? 0 : 2;
    lineUpCount += checkLineUp(
      who,
      gameState.value.board.cells[cross1]![cross1]!,
      gameState.value.board.cells[cross2]![cross2]!,
    );
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
 * @param gameState Reference to game state.
 * @param who Who is making move? Crosses or naughts?
 * @param x X coordinate of cell.
 * @param y Y coordinate of cell.
 * @param moveProps Move properties.
 * @returns True if fork is created with this move, otherwise false.
 */
function calcFork(gameState: Ref<GameState>, who: EnCellState, x: number, y: number, moveProps: MoveProps): boolean {
  if (calcImmediateFork(moveProps)) return true;
  return false;
  //return calcFutureFork(gameState, who, x, y);
}

/**
 * Detect if this move will produce immediate fork for you.
 * @param moveProps Move properties.
 * @returns True if fork is created with this move, otherwise false.
 */
function calcImmediateFork(moveProps: MoveProps): boolean {
  // It is impossible to have 2 or more lineup that is not winning move AND is not fork.
  if (moveProps.lineUp >= 2 && !moveProps.win) return true;
  return false;
}

/**
 * Detect if this move will produce fork in future for you.
 * Detect forks by checking overlapping rows/lines.
 * @param gameState Reference to game state.
 * @param who Who is making move? Crosses or naughts?
 * @param x X coordinate of cell.
 * @param y Y coordinate of cell.
 * @returns True if fork is created in future with this move, otherwise false.
 */
function calcFutureFork(gameState: Ref<GameState>, who: EnCellState, x: number, y: number): boolean {
  // THIS CODE SUCKS
  // Temporarily place the mark.
  gameState.value.board.cells[x]![y] = who;

  let potentialWins = 0;

  // Check row
  if (countInLine(gameState, who, x, 0, 0, 1) === 2) potentialWins++;
  // Check column
  if (countInLine(gameState, who, 0, y, 1, 0) === 2) potentialWins++;
  // Check diagonals if on diagonal
  if (x === y) { // Top-left to bottom-right
    if (countInLine(gameState, who, 0, 0, 1, 1) === 2) potentialWins++;
  }
  if (x + y === 2) { // Second diagonal: Top-right to bottom-left
    if (countInLine(gameState, who, 0, 2, 1, -1) === 2) potentialWins++;
  }

  // Restore state of board.
  gameState.value.board.cells[x]![y] = EnCellState.Empty;
  return potentialWins >= 2;
}

function countInLine(gameState: Ref<GameState>, who: EnCellState, startX: number, startY: number, dx: number, dy: number): number {
  // THIS CODE SUCKS
  let count = 0;
  let hasEmpty = false;

  for (let i = 0; i < 3; i++) {
    const cell = gameState.value.board.cells[startX + i * dx]![startY + i * dy];
    if (cell === who) count++;
    else if (cell === EnCellState.Empty) hasEmpty = true;
    else return 0; // Opponent mark blocks this line
  }

  return (count === 2 && hasEmpty) ? count : 0;
}

//

/**
 * Calculate points (score/weight) for given move.
 * Criteria:
 * - basic point value
 * - more points for center position or corners
 * - more points if you have other X/O lined up already
 * - even more points if this move prevents opponent's fork in future
 * - bigger bonus if move prevents opponent win
 * - very large bonus if winning move detected
 * @param move Move that needs point calculation.
 * @param pointsData Data about point rewards.
 * @returns Calculated point value.
 */
function calcMovePoints(move: LegalMove, pointsData: PointsData): number {
  // First, points for position.
  let points = calcPositionPoints(move, pointsData);
  // Line up bonus.
  points += move.props.lineUp * pointsData.bonusLineUp;
  // Fork bonus.
  if (move.props.fork) points += pointsData.bonusFork; // faciliate your fork
  //if (move.oppProps.fork) points += pointsData.bonusPreventFork; // prevent opponent's fork

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
