<script setup lang="ts">
import { computed } from 'vue';
import type { GameState } from '@/code/data/types.ts';
import { EnCellState } from '@/code/data/enums.ts';
import { humanMove } from '@/code/ticTacToe.ts';

import CellDebug from './CellDebug.vue';

const gameState = defineModel<GameState>({ required: true });
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
  return rowData ? (rowData[props.y] ?? fallback) : fallback;
});

const imageLink = computed<string>(() => {
  return import.meta.env.BASE_URL + `/cell_${cellValue.value}.svg`;
});

/**
 * Human player clicked on cell. Verify if player is allowed to do it and if so, make a move.
 */
async function clickOnCell() {
  await humanMove(gameState, cellValue.value, props.x, props.y);
}
</script>

<template>
  <div :id="cellId" class="cell-filled" v-if="cellValue !== EnCellState.Empty">
    <img :src="imageLink" class="cell-image" />
  </div>
  <div :id="cellId" class="cell-empty" @click="clickOnCell()" v-else>
    <CellDebug v-model="gameState" :x="x" :y="y" />
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
</style>
