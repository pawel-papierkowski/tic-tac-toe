<script setup lang="ts">
import { computed } from 'vue';
import { CellState, type GameState } from '../code/types.ts';

const gameState = defineModel<GameState>({ required: true })
const props = defineProps<{
  col: number;
  row: number
}>();

const cellValue = computed<CellState>(() => {
  const fallback = CellState.Unknown;
  const rowData = gameState.value.board.cells[props.row];
  if (rowData) return rowData[props.col] ?? fallback;
  return fallback;
});

const imageLink = computed<string>(() => {
  return "/cell_"+cellValue.value+".svg";
});

function clickOnCell() {
  if (cellValue.value !== CellState.Empty) return; // can change state of empty cell only
  console.log(`Clicked cell. Row: ${props.row}, col: ${props.col}.`);
}
</script>

<template>
  <div v-if="cellValue !== 1">
    <img :src="imageLink" width="200" height="200" />
  </div>
  <div @click="clickOnCell()" v-else></div>
</template>

<style scoped>
</style>
