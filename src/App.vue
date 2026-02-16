<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { createGameState, type GameState } from '@/code/types.ts'
import ViewMainMenu from '@/components/ViewMainMenu.vue'
import ViewTicTacToe from '@/components/ViewTicTacToe.vue'

onMounted(() => {
  preloadImages();
});

// Default game state.
const gameState = ref<GameState>(createGameState());

// Preload images - should solve Firefox issue with delayed image showing.
function preloadImages() {
  const images = [
    '/cell_0.svg',
    '/cell_1.svg',
    '/cell_2.svg',
    '/cell_3.svg',
  ];

  images.forEach(src => {
    const img = new Image();
    img.src = src;
  });
}
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
h1 {
  color: #484848;
  font-size: 54px;
  text-align: center;
  text-shadow: 0 0 5px currentColor;
}

footer {
  font-size: 10px;
  text-align: center;
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
