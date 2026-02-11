<script setup lang="ts">
import { computed } from 'vue';
import { EnPlayerType, EnCellState, EnGameStatus, type GameState, type LegalMove } from '../code/types.ts';
import { executeMove } from '../code/ticTacToe.ts'

const gameState = defineModel<GameState>({ required: true })
const props = defineProps<{
  col: number;
  row: number
}>();

const cellValue = computed<EnCellState>(() => {
  const fallback = EnCellState.Unknown;
  const rowData = gameState.value.board.cells[props.col];
  if (rowData) return rowData[props.row] ?? fallback;
  return fallback;
});

const imageLink = computed<string>(() => {
  return "/cell_"+cellValue.value+".svg";
});

/**
 * Human player clicked on cell. Verify if player is allowed to do it and if so, make a move.
 */
function clickOnCell() {
  if (gameState.value.board.status !== EnGameStatus.InProgress) return; // only if game is in progress
  if (gameState.value.board.currentPlayer !== EnPlayerType.Human) return; // only if it is human's turn
  if (cellValue.value !== EnCellState.Empty) return; // empty cell only
  console.log(`Clicked cell. Col: ${props.col}. Row: ${props.row}.`);

  const move : LegalMove = {
    x: props.col,
    y: props.row,
    score: 0
  };
  executeMove(gameState, move);
}
</script>

<template>
  <div class="cell-filled" v-if="cellValue !== EnCellState.Empty">
    <img :src="imageLink" width="200" height="200" />
  </div>
  <div class="cell-empty" @click="clickOnCell()" v-else></div>
</template>

<style scoped>
.cell-filled {
  cursor: not-allowed;
}

.cell-empty {
  cursor: pointer;
}
</style>
