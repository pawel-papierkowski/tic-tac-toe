import type { Ref } from 'vue';
import { type GameState } from '@/code/data/types';

/**
 * Change active screen.
 * @param gameState Reference to game state.
 * @param activeScreen New active screen.
 */
export function changeScreen(gameState: Ref<GameState>, activeScreen: 'mainMenu' | 'game') {
  gameState.value.view.activeScreen = activeScreen;
}
