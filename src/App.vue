<script setup lang="ts">
import { ref } from 'vue';
import { createGameState, type GameState } from '@/code/data/types';
import { projectProp } from '@/code/data/data';

import ViewMainMenu from '@/components/ViewMainMenu.vue';
import ViewTicTacToe from '@/components/ViewTicTacToe.vue';

// Default game state.
const gameState = ref<GameState>(createGameState());

</script>

<template>
  <header>
    <h1>{{ projectProp.title }}</h1>
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
    <p>Repository: <a href="https://github.com/pawel-papierkowski/tic-tac-toe" target="_blank">https://github.com/pawel-papierkowski/tic-tac-toe</a></p>
    <p>&copy; {{ projectProp.dateRange }} {{ projectProp.author }} | v. {{ projectProp.version }} {{ projectProp.build }}</p>
  </footer>
</template>

<style scoped>
h1 {
  color: #484848;
  font-size: 54px;
  text-align: center;
  text-shadow: 0 0 5px currentColor;
}

footer {
  font-size: 11px;
  text-align: center;
  margin: 4px;
}

/* Smaller on mobile */
@media (max-width: 768px) {
  h1 {
    color: #484848;
    font-size: 36px;
    text-align: center;
    text-shadow: 0 0 4px currentColor;
  }
}
</style>
