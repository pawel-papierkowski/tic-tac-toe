import type { Ref } from 'vue';
import { EnCellState } from '@/code/data/enums.ts';
import { type GameState } from '@/code/data/types.ts';

/**
 * Change active screen.
 * @param gameState Reference to game state.
 * @param activeScreen New active screen.
 */
export function changeScreen(gameState: Ref<GameState>, activeScreen: 'mainMenu' | 'game') {
  gameState.value.view.activeScreen = activeScreen;
}

/**
 * First player always uses crosses, second player always uses naughts.
 * @param gameState Reference to game state.
 * @returns Player symbol: crosses or naughts.
 */
export function resolvePlayerSymbol(gameState: Ref<GameState>): EnCellState {
  return gameState.value.board.firstPlayer === gameState.value.board.currentPlayer
    ? EnCellState.X : EnCellState.O;
}

/**
 * Wait some time before continuing.
 * Usage: await delay(gameConfig.aiWait);
 * @param ms How long delay is supposed to be in milliseconds.
 * @returns Promise.
 */
export async function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
