import type { Ref } from 'vue';
import { EnCellState, EnDifficulty, EnGameStatus, EnPlayerType, EnWhoFirst, EnMoveResult, createGameStatistics, createGameBoard } from './types';
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

// ////////

/**
 * Place X or O, check if current player won the game, check tie, switch current player.
 * Note this function is used both by AI and human.
 * @param move Legal move to execute.
 */
export function executeMove(gameState : Ref<GameState>, move : LegalMove) : EnMoveResult {
  if (gameState.value.board.cells[move.x]![move.y] !== EnCellState.Empty) {
    gameState.value.board.status = EnGameStatus.Stop;
    console.error(`Tried to execute illegal move! X: ${move.x}, Y: ${move.y}`);
    return EnMoveResult.Error;
  }

  const newCellState : EnCellState = // first player uses crosses, second player uses naughts
    gameState.value.board.firstPlayer === gameState.value.board.currentPlayer ? EnCellState.X : EnCellState.O;

  gameState.value.board.cells[move.x]![move.y] = newCellState;
  // TODO finish it:
  // - check if win state was achieved (in this case return EnMoveResult.Win)
  // - check if tie state was achieved (in this case return EnMoveResult.Tie)
  // - if neither happened, switch current player
  return EnMoveResult.Success;
}

//

/**
 * AI makes move.
 * Note: if AI is first, it will use X, otherwise it will use O.
 * @param gameState Reference to game state.
 */
export function moveAI(gameState : Ref<GameState>) {
  const legalMoves = resolveLegalMoves(gameState);
  if (legalMoves.length === 0) return; // no legal moves

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
 * @returns Array of legal moves. If array is empty, no move is possible, making it tie.
 */
function resolveLegalMoves(gameState : Ref<GameState>) : LegalMove[] {
  console.log("resolveLegalMoves() called.");
  // TODO find all legal moves and assign score to each one
  return []; // no moves found
}
