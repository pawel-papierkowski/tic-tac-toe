<script setup lang="ts">
import { nextTick } from 'vue';

import type { GameState } from '@/code/data/types.ts';
import { EnPlayerType } from '@/code/data/enums.ts';
import { gameConfig } from '@/code/data/data.ts';

import { changeScreen, delay } from '@/code/common.ts';
import { prepareNewGame } from '@/code/ticTacToe.ts';
import { moveAi } from '@/code/ai.ts';
import { fillDebugData } from '@/code/debug.ts';

import MainMenuOptions from '@/components/MainMenuOptions.vue';

const gameState = defineModel<GameState>({ required: true });

async function startGame() {
  prepareNewGame(gameState);
  changeScreen(gameState, 'game');
  fillDebugData(gameState);

  await nextTick(); // Wait for Vue to update the DOM.

  if (gameState.value.board.firstPlayer === EnPlayerType.AI) {
    await delay(gameConfig.aiWait); // Delay for visual effect...
    moveAi(gameState); // THEN execute AI move.
    await nextTick(); // Wait for Vue to update the DOM.
  }
}
</script>

<template>
  <MainMenuOptions v-model="gameState" />
  <div class="menu">
    <button data-testid="button-start" @click="startGame">Start Game</button>
  </div>
</template>

<style scoped>
.difficulty-label-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.difficulty-select-disabled {
  cursor: not-allowed;
}
</style>
