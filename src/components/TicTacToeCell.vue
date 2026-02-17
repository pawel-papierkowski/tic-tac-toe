<script setup lang="ts">
import { computed, nextTick } from 'vue';
import type { GameState,  } from '@/code/types.ts';
import { EnPlayerType, EnCellState, EnGameStatus, createLegalMove, EnWhoFirst } from '@/code/types.ts';
import { executeMove, moveAi } from '@/code/ai.ts';
import { fillDebugData } from '@/code/debug.ts';

const gameState = defineModel<GameState>({ required: true })
const props = defineProps<{
  x: number;
  y: number;
}>();

const cellId = computed<string>(() => {
  return `${props.x}x${props.y}`;
});

const cellValue = computed<EnCellState>(() => {
  const fallback = EnCellState.Unknown;
  const rowData = gameState.value.board.cells[props.x];
  return rowData ? rowData[props.y] ?? fallback : fallback;
});

const imageLink = computed<string>(() => {
  return "/cell_"+cellValue.value+".svg";
});

/**
 * Human player clicked on cell. Verify if player is allowed to do it and if so, make a move.
 */
async function clickOnCell() {
  if (gameState.value.board.status !== EnGameStatus.InProgress) return; // only if game is in progress
  if (gameState.value.settings.whoFirst !== EnWhoFirst.HumanVsHuman &&
      gameState.value.board.currentPlayer !== EnPlayerType.Human) return; // only if it is human's turn
  if (cellValue.value !== EnCellState.Empty) return; // empty cell only
  //console.log(`Clicked cell. X = ${props.x}, Y = ${props.y}.`);

  const who : EnCellState = // first player always uses crosses, second player uses naughts
    gameState.value.board.firstPlayer === gameState.value.board.currentPlayer ? EnCellState.X : EnCellState.O;

  const humanMove = createLegalMove(who, props.x, props.y);
  executeMove(gameState, humanMove); // here we change currentPlayer (unless win/tie happened)
  fillDebugData(gameState);

  await nextTick(); // Wait for Vue to update the DOM.

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
      X: {{ x }}, Y: {{ y }}<br/>
      Score: {{ gameState.board.debug[x]![y]?.score }}<br/>
      Weight: {{ gameState.board.debug[x]![y]?.weight }}<br/>
      Win: {{ gameState.board.debug[x]![y]?.win }}<br/>
      PreventLoss: {{ gameState.board.debug[x]![y]?.preventLoss }}<br/>
      LineUp: {{ gameState.board.debug[x]![y]?.lineUp }}<br/>
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
    font-size: 0.65rem;
  }
}
</style>
