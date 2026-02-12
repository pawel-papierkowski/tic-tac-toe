import type { Ref } from 'vue';
import { EnCellState, EnDifficulty, EnGameStatus, EnPlayerType, EnWhoFirst, createGameStatistics, createGameBoard } from './types';
import type { GameState, LegalMove } from './types';

/**
 * Prepare new game. Resets statistics and prepares first round.
 * @param gameState Reference to game state.
 */
export function prepareNewGame(gameState : Ref<GameState>) {
  gameState.value.statistics = createGameStatistics(); // reset statistics
  prepareNextRound(gameState);
}

/**
 * Prepare next round.
 * @param gameState Reference to game state.
 */
export function prepareNextRound(gameState : Ref<GameState>) {
  gameState.value.board = createGameBoard(); // reset board
  switch (gameState.value.settings.whoFirst) {
    case EnWhoFirst.Random : gameState.value.board.firstPlayer = Math.random() >= 0.5 ? EnPlayerType.AI : EnPlayerType.Human; break;
    case EnWhoFirst.Human : gameState.value.board.firstPlayer = EnPlayerType.Human; break;
    case EnWhoFirst.AI : gameState.value.board.firstPlayer = EnPlayerType.AI;
  }
  gameState.value.board.currentPlayer = gameState.value.board.firstPlayer;

  gameState.value.statistics.round++;
}

//

/**
 * Check state of board and see if there are any three cells with same X or O state in row, column or across.
 * @param gameState Reference to game state.
 */
function checkWinState(gameState : Ref<GameState>) : boolean {
  // Game is simple enough that we can just check all possibilities manually.
  gameState.value.board.strike.present = true; // how optimistic

  // first all cases from upper left corner (horizontal line, vertical line and cross)
  if (checkUpLeftCorner(gameState)) return true;
  // now middle horizontal and vertical
  if (checkMiddleLines(gameState)) return true;
  // now horizontal and vertical at end
  if (checkEndLines(gameState)) return true;
  // last is upper right corner cross
  if (checkUpRightCorner(gameState)) return true;

  gameState.value.board.strike.present = false;
  return false; // no win state exist
}

function checkUpLeftCorner(gameState : Ref<GameState>) : boolean {
  const cellState = gameState.value.board.cells[0]![0]; // upper left corner
  if (cellState !== EnCellState.O && cellState != EnCellState.X) return false;
  gameState.value.board.strike.x1 = 0;
  gameState.value.board.strike.y1 = 0;
  if (gameState.value.board.cells[1]![0] === cellState && gameState.value.board.cells[2]![0] === cellState) { // horizontal line
    gameState.value.board.strike.x2 = 2; // XXX
    gameState.value.board.strike.y2 = 0; // ???
    return true;                         // ???
  }
  if (gameState.value.board.cells[0]![1] === cellState && gameState.value.board.cells[0]![2] === cellState) { // vertical line
    gameState.value.board.strike.x2 = 0; // X??
    gameState.value.board.strike.y2 = 2; // X??
    return true;                         // X??
  }
  if (gameState.value.board.cells[1]![1] === cellState && gameState.value.board.cells[2]![2] === cellState) { // cross
    gameState.value.board.strike.x2 = 2; // X??
    gameState.value.board.strike.y2 = 2; // ?X?
    return true;                         // ??X
  }
  return false;
}

function checkMiddleLines(gameState : Ref<GameState>) : boolean {
  let cellState = gameState.value.board.cells[1]![0];
  if (cellState !== EnCellState.O && cellState != EnCellState.X) return false;
  gameState.value.board.strike.x1 = 1;
  gameState.value.board.strike.y1 = 0;
  if (gameState.value.board.cells[1]![1] === cellState && gameState.value.board.cells[1]![2] === cellState) { // horizontal middle line
    gameState.value.board.strike.x2 = 1; // ???
    gameState.value.board.strike.y2 = 2; // XXX
    return true;                         // ???
  }
  cellState = gameState.value.board.cells[0]![1];
  if (cellState !== EnCellState.O && cellState != EnCellState.X) return false;
  gameState.value.board.strike.x1 = 0;
  gameState.value.board.strike.y1 = 1;
  if (gameState.value.board.cells[1]![1] === cellState && gameState.value.board.cells[2]![1] === cellState) { // vertical middle line
    gameState.value.board.strike.x2 = 2; // ?X?
    gameState.value.board.strike.y2 = 1; // ?X?
    return true;                         // ?X?
  }
  return false;
}

function checkEndLines(gameState : Ref<GameState>) : boolean {
  const cellState = gameState.value.board.cells[2]![2]; // bottom right corner
  if (cellState !== EnCellState.O && cellState != EnCellState.X) return false;
  gameState.value.board.strike.x1 = 2;
  gameState.value.board.strike.y1 = 2;
  if (gameState.value.board.cells[1]![2] === cellState && gameState.value.board.cells[0]![2] === cellState) { // horizontal line
    gameState.value.board.strike.x2 = 0; // ???
    gameState.value.board.strike.y2 = 2; // ???
    return true;                         // XXX
  }
  if (gameState.value.board.cells[2]![1] === cellState && gameState.value.board.cells[2]![0] === cellState) { // vertical line
    gameState.value.board.strike.x2 = 2; // ??X
    gameState.value.board.strike.y2 = 0; // ??X
    return true;                         // ??X
  }
  return false;
}

function checkUpRightCorner(gameState : Ref<GameState>) : boolean {
  const cellState = gameState.value.board.cells[2]![0]; // upper right corner
  if (cellState !== EnCellState.O && cellState != EnCellState.X) return false;
  gameState.value.board.strike.x1 = 2;
  gameState.value.board.strike.y1 = 0;
  if (gameState.value.board.cells[1]![1] === cellState && gameState.value.board.cells[0]![2] === cellState) { // cross
    gameState.value.board.strike.x2 = 0; // ??X
    gameState.value.board.strike.y2 = 2; // ?X?
    return true;                         // X??
  }
  return false;
}

//

/**
 * Set up game state for win.
 * @param gameState Reference to game state.
 */
function reactOnWin(gameState : Ref<GameState>) {
  gameState.value.board.status = EnGameStatus.PlayerWon; // we know who won from currentPlayer
  gameState.value.statistics.tiesInRow = 0;

  if (gameState.value.board.currentPlayer === EnPlayerType.Human) {
    gameState.value.statistics.humanScore++;
    gameState.value.statistics.humanWinInRow++;
    gameState.value.statistics.aiWinInRow = 0;
  } else {
    gameState.value.statistics.aiScore++;
    gameState.value.statistics.aiWinInRow++;
    gameState.value.statistics.humanWinInRow = 0;
  }
}

/**
 * Set up game state for tie.
 * @param gameState Reference to game state.
 */
function reactOnTie(gameState : Ref<GameState>) {
  gameState.value.board.status = EnGameStatus.Tie;
  gameState.value.statistics.ties++;
  gameState.value.statistics.tiesInRow++;
  gameState.value.statistics.aiWinInRow = 0;
  gameState.value.statistics.humanWinInRow = 0;
}

// ////////

/**
 * Place X or O, check if current player won the game, check tie, switch current player.
 * Note this function is used both by AI and human.
 * @param move Legal move to execute.
 */
export function executeMove(gameState : Ref<GameState>, move : LegalMove) {
  if (gameState.value.board.cells[move.x]![move.y] !== EnCellState.Empty) {
    gameState.value.board.status = EnGameStatus.Stop;
    console.error(`Tried to execute illegal move! X: ${move.x}, Y: ${move.y}`);
    return;
  }

  const newCellState : EnCellState = // first player uses crosses, second player uses naughts
    gameState.value.board.firstPlayer === gameState.value.board.currentPlayer ? EnCellState.X : EnCellState.O;
  gameState.value.board.cells[move.x]![move.y] = newCellState;

  // Check if win state was achieved.
  if (checkWinState(gameState)) {
    reactOnWin(gameState);
    return;
  }

  // Check if tie state was achieved.
  const legalMoves = resolveLegalMoves(gameState, false);
  if (legalMoves.length === 0) { // no legal moves, we have tie
    reactOnTie(gameState);
    return;
  }

  // If we are here, we know game continues. Switch current player.
  gameState.value.board.currentPlayer = gameState.value.board.currentPlayer === EnPlayerType.AI ? EnPlayerType.Human : EnPlayerType.AI;
  return;
}

//

/**
 * AI makes move.
 * Note: if AI is first, it will use X, otherwise it will use O.
 * @param gameState Reference to game state.
 */
export function moveAI(gameState : Ref<GameState>) {
  const legalMoves = resolveLegalMoves(gameState, true);
  if (legalMoves.length === 0) { // no legal moves, we have tie
    reactOnTie(gameState);
    return;
  }

  switch (gameState.value.settings.difficulty) {
    case EnDifficulty.Easy: moveEasy(gameState, legalMoves); break;
    case EnDifficulty.Medium: moveMedium(gameState, legalMoves); break;
    case EnDifficulty.Hard: moveHard(gameState, legalMoves); break;
    case EnDifficulty.Impossible: moveImpossible(gameState, legalMoves); break;
  }
}

//

/**
 * AI on easy difficulty will always pick completely random move out of all legal moves.
 * @param gameState Reference to game state.
 */
function moveEasy(gameState : Ref<GameState>, legalMoves : LegalMove[]) {
  console.log("moveEasy() called.");
  // Pick randomly legal move.
  const rngIndex = Math.floor(Math.random() * legalMoves.length);
  const pickedMove = legalMoves[rngIndex]!;
  executeMove(gameState, pickedMove);
}

/**
 * AI on medium difficulty will sometimes actually try to win.
 * @param gameState Reference to game state.
 */
function moveMedium(gameState : Ref<GameState>, legalMoves : LegalMove[]) {
  console.log("moveMedium() called.");
  // TODO
}

/**
 * AI on hard difficulty plays like in impossible, but with chance of making different move than best one.
 * @param gameState Reference to game state.
 */
function moveHard(gameState : Ref<GameState>, legalMoves : LegalMove[]) {
  console.log("moveHard() called.");
  // TODO
}

/**
 * AI on impossible difficulty will play perfectly.
 * @param gameState Reference to game state.
 */
function moveImpossible(gameState : Ref<GameState>, legalMoves : LegalMove[]) {
  console.log("moveImpossible() called.");
  // TODO
}

//

/**
 * Tries to find legal moves.
 * @param gameState Reference to game state.
 * @param calcScore If true, calculate score, otherwise score is always 0
 * @returns Array of legal moves. If array is empty, no move is possible, making it tie.
 */
function resolveLegalMoves(gameState : Ref<GameState>, calcScore : boolean) : LegalMove[] {
  console.log("resolveLegalMoves() called.");
  // Find all legal moves and assign score to each one.
  const legalMoves : LegalMove[] = []; // empty array
  for (let x=0; x<3; x++) {
    for (let y=0; y<3; y++) {
      if (gameState.value.board.cells[x]![y] != EnCellState.Empty) continue;
      const legalMove : LegalMove = {
        x: x,
        y: y,
        score: calcMoveScore(x, y, calcScore)
      };
      legalMoves.push(legalMove);
    }
  }
  return legalMoves;
}

/**
 * Calculate score for given move.
 * @returns Calculated score.
 */
function calcMoveScore(x: number, y: number, calcScore : boolean) : number {
  if (!calcScore) return 0;
  // TODO actually do it, for now always return 0
  return 0;
}
