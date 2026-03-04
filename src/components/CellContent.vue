<script setup lang="ts">
import { EnCellState } from '@/code/data/enums.ts';

import CellUnknown from '@/assets/graphics/CellUnknown.vue';
import CellEmpty from '@/assets/graphics/CellEmpty.vue';
import CellX from '@/assets/graphics/CellX.vue';
import CellO from '@/assets/graphics/CellO.vue';

const _props = defineProps<{
  cellValue: EnCellState;
}>();
</script>

<template>
  <div v-if="cellValue === EnCellState.Unknown"><CellUnknown /></div>
  <div v-if="cellValue === EnCellState.Empty"><CellEmpty /></div>
  <div v-if="cellValue === EnCellState.X"><CellX /></div>
  <div v-if="cellValue === EnCellState.O"><CellO /></div>
</template>

<style scoped>
</style>
