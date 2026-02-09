import type { Ref } from 'vue';
import { type GameState, defaultGameBoard } from './types';

/**
 * Reset game board.
 * @param gameState Reference to game state.
 */
export function resetGameBoard(gameState : Ref<GameState>) {
  gameState.value.board = defaultGameBoard;
  console.log("Game board reset.");
}
