import type { GameState } from '../../code/data/types.ts';
import { createGameState } from '../../code/data/types.ts';
import { EnDifficulty, EnWhoFirst, EnPlayerType } from '../../code/data/enums.ts';

export function createGameStateForAI(): GameState {
  const gameState = createGameState();
  gameState.settings.whoFirst = EnWhoFirst.AI;
  gameState.settings.difficulty = EnDifficulty.Impossible;
  gameState.board.firstPlayer = EnPlayerType.AI;
  gameState.board.currentPlayer = EnPlayerType.AI;
  return gameState;
}

export function createGameStateForHuman(): GameState {
  const gameState = createGameState();
  gameState.settings.whoFirst = EnWhoFirst.Human;
  gameState.settings.difficulty = EnDifficulty.Impossible;
  gameState.board.firstPlayer = EnPlayerType.Human;
  gameState.board.currentPlayer = EnPlayerType.Human;
  return gameState;
}
