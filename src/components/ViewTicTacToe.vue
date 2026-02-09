<script setup lang="ts">
import { type GameState } from '../code/types.ts'
import { changeScreen } from '../code/common.ts'

const gameState = defineModel<GameState>({ required: true })

function toMainMenu() {
  changeScreen(gameState, 'mainMenu');
}
</script>

<template>
  <div class="board">TODO: actual tic-tac-toe board.</div>
  <div class="menu">
    <p>
      <button @click="toMainMenu">Quit</button>
    </p>
  </div>
</template>

<style scoped>
</style>
