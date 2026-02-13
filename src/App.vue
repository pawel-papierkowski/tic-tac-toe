<script setup lang="ts">
import { ref } from 'vue'
import { createGameState, type GameState } from '@/code/types.ts'
import ViewMainMenu from '@/components/ViewMainMenu.vue'
import ViewTicTacToe from '@/components/ViewTicTacToe.vue'

// Default game state.
const gameState = ref<GameState>(createGameState());
</script>

<template>
  <header>
    <h1>TIC TAC TOE</h1>
  </header>

  <main>
    <template v-if="gameState.view.activeScreen === 'mainMenu'">
      <ViewMainMenu v-model="gameState" />
    </template>

    <template v-else>
      <ViewTicTacToe v-model="gameState" />
    </template>
  </main>

  <footer>
    Paweł Papierkowski
  </footer>
</template>

<style scoped>
</style>
