import type { Ref } from 'vue';

import type { GameState } from '../../code/data/types.ts';
import { createGameState, createLegalMove } from '../../code/data/types.ts';
import { EnDifficulty, EnWhoFirst, EnPlayerType, EnCellState } from '../../code/data/enums.ts';

import { executeMove } from '../../code/ai.ts';

/** Create game state on impossible difficulty where AI starts first. */
export function createGameStateForAI(): GameState {
  const gameState = createGameState();
  gameState.settings.whoFirst = EnWhoFirst.AI;
  gameState.settings.difficulty = EnDifficulty.Impossible;
  gameState.board.firstPlayer = EnPlayerType.AI;
  gameState.board.currentPlayer = EnPlayerType.AI;
  return gameState;
}

/** Create game state on impossible difficulty where human starts first. */
export function createGameStateForHuman(): GameState {
  const gameState = createGameState();
  gameState.settings.whoFirst = EnWhoFirst.Human;
  gameState.settings.difficulty = EnDifficulty.Impossible;
  gameState.board.firstPlayer = EnPlayerType.Human;
  gameState.board.currentPlayer = EnPlayerType.Human;
  return gameState;
}

export function makeTestMove(gameState: Ref<GameState>, x: number, y: number) {
  const who = gameState.value.board.firstPlayer === gameState.value.board.currentPlayer ?
    EnCellState.X : EnCellState.O;
  const nextMove = createLegalMove(who, x, y);
  executeMove(gameState, nextMove);
}
