<script setup lang="ts">
import type { GameState } from '@/code/data/types.ts';
import { playerTypeDescr } from '@/code/data/data.ts';

const isDev = import.meta.env.DEV;
const gameState = defineModel<GameState>({ required: true });

const _props = defineProps<{
  x: number;
  y: number;
}>();

</script>

<template>
  <div class="debug-data" v-if="isDev && gameState.debugSettings.debugMode === true">
      <div><b>X</b>: {{ x }}, <b>Y</b>: {{ y }}</div>
      <div></div>
      <div>Score: {{ gameState.board.debug.cells[x]![y]?.score }}</div>
      <div>Weight: {{ gameState.board.debug.cells[x]![y]?.weight }}</div>

      <div><b>{{ playerTypeDescr[gameState.board.debug.debugPlayer1] }}</b></div>
      <div><b>{{ playerTypeDescr[gameState.board.debug.debugPlayer2] }}</b></div>
      <div>Win: {{ gameState.board.debug.cells[x]![y]?.props.win }}</div>
      <div>Win: {{ gameState.board.debug.cells[x]![y]?.oppProps.win }}</div>
      <div>FutWin: {{ gameState.board.debug.cells[x]![y]?.props.futWin }}</div>
      <div>FutWin: {{ gameState.board.debug.cells[x]![y]?.oppProps.futWin }}</div>
      <div>Fork: {{ gameState.board.debug.cells[x]![y]?.props.fork }}</div>
      <div>Fork: {{ gameState.board.debug.cells[x]![y]?.oppProps.fork }}</div>
      <div>LineUp: {{ gameState.board.debug.cells[x]![y]?.props.lineUp }}</div>
      <div>LineUp: {{ gameState.board.debug.cells[x]![y]?.oppProps.lineUp }}</div>
  </div>
</template>

<style scoped>
.debug-data {
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding: 5px;
  font-size: 1rem;
}

/* Smaller on mobile */
@media (max-width: 768px) {
  .debug-data {
    padding: 2px;
    font-size: 0.6rem;
  }
}
</style>
