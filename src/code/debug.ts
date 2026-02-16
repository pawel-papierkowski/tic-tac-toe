import type { Ref } from 'vue';
import type { GameState, LegalMove, DebugData } from './types.ts';
import { EnCellState } from './types.ts';
import { resolveLegalMoves } from './legalMoves.ts';

/**
 * Fills all debug data that are for empty cells.
 * Point of view depends on gameState.value.settings.debugPlayer.
 * @param gameState Reference to game state.
 */
export function fillDebugData(gameState : Ref<GameState>) {
  if (!gameState.value.settings.debugMode) return;

  const who : EnCellState = whoAmI(gameState);
  const legalMoves = resolveLegalMoves(gameState, who, true);
  if (legalMoves.length === 0) return;

  for (const legalMove of legalMoves) {
    saveDebugData(gameState, legalMove);
  }
}

function whoAmI(gameState : Ref<GameState>) : EnCellState {
  const debugPlayer = gameState.value.settings.debugPlayer;
  return gameState.value.board.firstPlayer === debugPlayer ? EnCellState.X : EnCellState.O;
}

/**
 * Write debug data for given cell.
 * @param gameState Reference to game state.
 * @param move Legal move.
 * @param x X coordinate of cell.
 * @param y Y coordinate of cell.
 */
function saveDebugData(gameState : Ref<GameState>, move: LegalMove) {
  const debugCell : DebugData = gameState.value.board.debug[move.x]![move.y]!;
  debugCell.score = move.score;
  debugCell.win = move.win;
  debugCell.preventLoss = move.preventLoss;
  debugCell.lineUp = move.lineUp;
}
