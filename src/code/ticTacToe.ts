import { type Ref, nextTick } from 'vue';
import type { GameState } from '@/code/data/types.ts';
import { createGameStatistics, createGameBoard, createLegalMove } from '@/code/data/types.ts';
import { EnWhoFirst, EnGameStatus, EnCellState, EnPlayerType } from '@/code/data/enums.ts';
import { executeMove, moveAi } from '@/code/ai.ts';
import { fillDebugData } from '@/code/debug.ts';

/**
 * Prepare new game. Resets statistics and prepares first round.
 * @param gameState Reference to game state.
 */
export function prepareNewGame(gameState: Ref<GameState>) {
  gameState.value.statistics = createGameStatistics(); // reset statistics
  prepareNextRound(gameState);
  prepareDebug(gameState);
}

/**
 * Prepare debug data.
 * @param gameState Reference to game state.
 */
function prepareDebug(gameState: Ref<GameState>) {
  if (gameState.value.settings.whoFirst === EnWhoFirst.HumanVsHuman) {
    gameState.value.debugSettings.debugPlayer1 = EnPlayerType.Human1;
    gameState.value.debugSettings.debugPlayer2 = EnPlayerType.Human2;
    return;
  }

  if (gameState.value.board.firstPlayer === EnPlayerType.Human) {
    gameState.value.debugSettings.debugPlayer1 = EnPlayerType.Human;
    gameState.value.debugSettings.debugPlayer2 = EnPlayerType.AI;
  } else {
    gameState.value.debugSettings.debugPlayer1 = EnPlayerType.AI;
    gameState.value.debugSettings.debugPlayer2 = EnPlayerType.Human;
  }
}

/**
 * Prepare next round.
 * @param gameState Reference to game state.
 */
export function prepareNextRound(gameState: Ref<GameState>) {
  gameState.value.board = createGameBoard(); // reset board
  switch (gameState.value.settings.whoFirst) {
    case EnWhoFirst.Random:
      gameState.value.board.firstPlayer = Math.random() >= 0.5 ? EnPlayerType.AI : EnPlayerType.Human;
      break;
    case EnWhoFirst.Human:
      gameState.value.board.firstPlayer = EnPlayerType.Human;
      break;
    case EnWhoFirst.AI:
      gameState.value.board.firstPlayer = EnPlayerType.AI;
      break;
    case EnWhoFirst.HumanVsHuman:
      gameState.value.board.firstPlayer = EnPlayerType.Human1;
      break;
  }
  gameState.value.board.currentPlayer = gameState.value.board.firstPlayer;

  gameState.value.statistics.round++;
  gameState.value.statistics.moveCount = 0;
}

/**
 * Human player tries to make a move. Verify if player is allowed to do it and if so, execute move.
 * @param gameState Reference to game state.
 */
export async function humanMove(gameState: Ref<GameState>, cellValue: EnCellState, x: number, y: number) {
  if (gameState.value.board.status !== EnGameStatus.InProgress) return; // only if game is in progress
  if (
    gameState.value.settings.whoFirst !== EnWhoFirst.HumanVsHuman &&
    gameState.value.board.currentPlayer !== EnPlayerType.Human
  )
    return; // only if it is human's turn
  if (cellValue !== EnCellState.Empty) return; // empty cell only

  const who: EnCellState = // first player always uses crosses, second player uses naughts
    gameState.value.board.firstPlayer === gameState.value.board.currentPlayer ? EnCellState.X : EnCellState.O;

  const humanMove = createLegalMove(who, x, y);
  executeMove(gameState, humanMove); // here we change currentPlayer (unless win/tie happened)
  fillDebugData(gameState);

  await nextTick(); // Wait for Vue to update the DOM.

  if (gameState.value.board.currentPlayer === EnPlayerType.AI) {
    await new Promise((resolve) => setTimeout(resolve, 700)); // Delay for visual effect...
    moveAi(gameState); // THEN execute AI move.
    await nextTick(); // Wait for Vue to update the DOM.
  }
}
