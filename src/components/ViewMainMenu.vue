<script setup lang="ts">
import { type GameState } from '../code/types.ts';
import { changeScreen } from '../code/common.ts';
import { resetGameBoard } from '../code/ticTacToe.ts';
import { difficultyDescriptions } from '../code/data.ts';

const gameState = defineModel<GameState>({ required: true });

function startGame() {
  resetGameBoard(gameState);
  changeScreen(gameState, 'game');
}
</script>

<template>
  <div class="menu">
    <p>
      <label>
        Difficulty:
        <select v-model.number="gameState.settings.difficulty">
          <option
            v-for="(desc, value) in difficultyDescriptions"
            :key="value"
            :value="Number(value)"
          >
            {{ desc }}
          </option>
        </select>
      </label>
    </p>
    <p>
      <button @click="startGame">Start</button>
    </p>
  </div>
</template>

<style scoped>
</style>
