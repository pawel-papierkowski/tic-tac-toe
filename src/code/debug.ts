import type { Ref } from 'vue';
import type { GameState, LegalMove, DebugCell } from '@/code/data/types.ts';
import { EnCellState } from '@/code/data/enums.ts';
import { resolveAllLegalMoves } from '@/code/legalMoves.ts';

/**
 * Fills all debug data that are for empty cells.
 * Point of view depends on gameState.value.settings.debugPlayer.
 * @param gameState Reference to game state.
 */
export function fillDebugData(gameState: Ref<GameState>) {
  if (!gameState.value.debugSettings.debugMode) return;

  // show debug data for current player
  gameState.value.board.debug.debugPlayer1 = gameState.value.debugSettings.debugPlayer1;
  gameState.value.board.debug.debugPlayer2 = gameState.value.debugSettings.debugPlayer2;
  if (gameState.value.board.currentPlayer === gameState.value.debugSettings.debugPlayer2) {
    gameState.value.board.debug.debugPlayer1 = gameState.value.debugSettings.debugPlayer2;
    gameState.value.board.debug.debugPlayer2 = gameState.value.debugSettings.debugPlayer1;
  }

  const who: EnCellState = whoAmI(gameState);
  const legalMoves = resolveAllLegalMoves(gameState, who);
  if (legalMoves.length === 0) return;

  for (const legalMove of legalMoves) {
    saveDebugData(gameState, legalMove);
  }
}

function whoAmI(gameState: Ref<GameState>): EnCellState {
  const debugPlayer = gameState.value.board.debug.debugPlayer1;
  return gameState.value.board.firstPlayer === debugPlayer ? EnCellState.X : EnCellState.O;
}

/**
 * Write debug data for given cell.
 * @param gameState Reference to game state.
 * @param move Legal move.
 * @param x X coordinate of cell.
 * @param y Y coordinate of cell.
 */
function saveDebugData(gameState: Ref<GameState>, move: LegalMove) {
  const debugCell: DebugCell = gameState.value.board.debug.cells[move.x]![move.y]!;
  debugCell.score = move.score;
  debugCell.weight = move.weight;
  debugCell.miniMax = move.miniMax;
  debugCell.props = move.props;
  debugCell.oppProps = move.oppProps;
}
