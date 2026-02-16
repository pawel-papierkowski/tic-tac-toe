<script setup lang="ts">
import { computed, nextTick } from 'vue';
import type { GameState,  } from '@/code/types.ts';
import { EnPlayerType, EnCellState, EnGameStatus, createLegalMove } from '@/code/types.ts';
import { executeMove, moveAi } from '@/code/ai.ts';
import { fillDebugData } from '@/code/debug.ts';

const gameState = defineModel<GameState>({ required: true })
const props = defineProps<{
  col: number;
  row: number;
}>();

const cellId = computed<string>(() => {
  return `${props.col}x${props.row}`;
});

const cellValue = computed<EnCellState>(() => {
  const fallback = EnCellState.Unknown;
  const rowData = gameState.value.board.cells[props.col];
  return rowData ? rowData[props.row] ?? fallback : fallback;
});

const imageLink = computed<string>(() => {
  return "/cell_"+cellValue.value+".svg";
});

/**
 * Human player clicked on cell. Verify if player is allowed to do it and if so, make a move.
 */
async function clickOnCell() {
  if (gameState.value.board.status !== EnGameStatus.InProgress) return; // only if game is in progress
  if (gameState.value.board.currentPlayer !== EnPlayerType.Human) return; // only if it is human's turn
  if (cellValue.value !== EnCellState.Empty) return; // empty cell only
  console.log(`Clicked cell. Col: ${props.col}. Row: ${props.row}.`);

  const who : EnCellState = // first player uses crosses, second player uses naughts
    gameState.value.board.firstPlayer === gameState.value.board.currentPlayer ? EnCellState.X : EnCellState.O;

  const humanMove = createLegalMove(who, props.col, props.row);
  executeMove(gameState, humanMove); // here we change currentPlayer (unless win/tie happened)
  fillDebugData(gameState);

  await nextTick(); // Wait for Vue to update the DOM.

  // TypeScript goes stupid here, we need to tell it off.
  // @ts-expect-error - yes, currentPlayer CAN be either AI or Human here.
  if (gameState.value.board.currentPlayer === EnPlayerType.AI) {
    await new Promise(resolve => setTimeout(resolve, 700)); // Delay for visual effect...
    moveAi(gameState); // THEN execute AI move.
    await nextTick(); // Wait for Vue to update the DOM.
  }
}
</script>

<template>
  <div :id="cellId" class="cell-filled" v-if="cellValue !== EnCellState.Empty">
    <img :src="imageLink" class="cell-image" />
  </div>
  <div :id="cellId" class="cell-empty" @click="clickOnCell()" v-else>
    <div class="debug-data" v-if="gameState.settings.debugMode === true">
      Score: {{ gameState.board.debug[col]![row]?.score }}<br/>
      Win: {{ gameState.board.debug[col]![row]?.win }}<br/>
      PreventLoss: {{ gameState.board.debug[col]![row]?.preventLoss }}<br/>
      LineUp: {{ gameState.board.debug[col]![row]?.lineUp }}<br/>
    </div>
  </div>
</template>

<style scoped>
.cell-filled {
  cursor: not-allowed;
}

.cell-empty {
  cursor: pointer;
}

.cell-image {
  width: 100%;
  height: auto;
  padding: 2px;
  max-width: 200px;
  max-height: 200px;
}

.debug-data {
  padding: 5px;
  font-size: 1rem;
}

/* Smaller on mobile */
@media (max-width: 768px) {
  .debug-data {
    padding: 2px;
    font-size: 0.75rem;
  }
}
</style>
