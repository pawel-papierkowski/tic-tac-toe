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

/**
 * Delay execution.
 * Usage: await delay(gameConfig.aiWait);
 * @param ms How long delay is supposed to be in milliseconds.
 * @returns Promise.
 */
export async function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
