import type { Ref } from 'vue';
import type { GameState } from './types.ts';
import { EnPlayerType, EnWhoFirst, createGameStatistics, createGameBoard } from './types.ts';

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
