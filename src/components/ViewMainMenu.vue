<script setup lang="ts">
import { type GameState } from '@/code/types.ts';
import { changeScreen } from '@/code/common.ts';
import { prepareNewGame } from '@/code/ticTacToe.ts';
import { difficultyDescr, whoFirstDescr } from '@/code/data.ts';

const gameState = defineModel<GameState>({ required: true });

function startGame() {
  prepareNewGame(gameState);
  changeScreen(gameState, 'game');
}
</script>

<template>
  <div class="menu">
    <label for="difficulty">
      Difficulty:
    </label>
    <select id="difficulty" data-testid="select-difficulty" v-model.number="gameState.settings.difficulty">
      <option v-for="(desc, value) in difficultyDescr" :key="value" :value="Number(value)">
        {{ desc }}
      </option>
    </select>
    <label for="whoFirst">
      Who starts first:
    </label>
    <select id="whoFirst" data-testid="select-whoFirst" v-model.number="gameState.settings.whoFirst">
      <option v-for="(desc, value) in whoFirstDescr" :key="value" :value="Number(value)">
        {{ desc }}
      </option>
    </select>
    <button data-testid="button-start" @click="startGame">Start Game</button>
  </div>
</template>

<style scoped>
</style>
