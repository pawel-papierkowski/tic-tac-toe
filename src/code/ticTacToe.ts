import type { Ref } from 'vue';
import { Difficulty, type GameState, PlayerType, WhoFirst, defaultGameBoard } from './types';

/**
 * Reset game board.
 * @param gameState Reference to game state.
 */
export function resetGameBoard(gameState : Ref<GameState>) {
  gameState.value.board = defaultGameBoard;
}

/**
 * Prepare game.
 * @param gameState Reference to game state.
 */
export function prepareGame(gameState : Ref<GameState>) {
  resetGameBoard(gameState);
  switch (gameState.value.settings.whoFirst) {
    case WhoFirst.Random : gameState.value.board.first = Math.random() >= 0.5 ? PlayerType.AI : PlayerType.Human; break;
    case WhoFirst.Human : gameState.value.board.first = PlayerType.Human; break;
    case WhoFirst.AI : gameState.value.board.first = PlayerType.AI;
  }
}

/**
 * AI makes move.
 * Note: if AI is first, it will use X, otherwise it will use O.
 * @param gameState Reference to game state.
 */
export function moveAI(gameState : Ref<GameState>) {
  switch (gameState.value.settings.difficulty) {
    case Difficulty.Easy: moveEasy(gameState); break;
    case Difficulty.Medium: moveMedium(gameState); break;
    case Difficulty.Hard: moveHard(gameState); break;
    case Difficulty.Impossible: moveImpossible(gameState); break;
  }
}

/**
 * AI on easy difficulty will always pick completely random move out of all legal moves.
 * @param gameState Reference to game state.
 */
function moveEasy(gameState : Ref<GameState>) {
  console.log("moveEasy() called.");
  // TODO
}

/**
 * AI on medium difficulty will sometimes actually try to win.
 * @param gameState Reference to game state.
 */
function moveMedium(gameState : Ref<GameState>) {
  console.log("moveMedium() called.");
  // TODO
}

/**
 * AI on hard difficulty plays like in impossible, but with chance of making different move than best one.
 * @param gameState Reference to game state.
 */
function moveHard(gameState : Ref<GameState>) {
  console.log("moveHard() called.");
  // TODO
}

/**
 * AI on impossible difficulty will play perfectly.
 * @param gameState Reference to game state.
 */
function moveImpossible(gameState : Ref<GameState>) {
  console.log("moveImpossible() called.");
  // TODO
}
