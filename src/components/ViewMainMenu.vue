<script setup lang="ts">
import { EnPlayerType, EnWhoFirst, type GameState } from '@/code/types.ts';
import { changeScreen } from '@/code/common.ts';
import { prepareNewGame } from '@/code/ticTacToe.ts';
import { moveAi } from '@/code/ai.ts';
import { fillDebugData } from '@/code/debug.ts';
import { difficultyDescr, whoFirstDescr } from '@/code/data.ts';

const gameState = defineModel<GameState>({ required: true });

async function startGame() {
  prepareNewGame(gameState);
  changeScreen(gameState, 'game');
  fillDebugData(gameState);
  if (gameState.value.board.firstPlayer === EnPlayerType.AI) {
    await new Promise(resolve => setTimeout(resolve, 700)); // Delay for visual effect...
    moveAi(gameState); // THEN execute AI move.
  }
}

function resolveDiffLabelClass() {
  if (gameState.value.settings.whoFirst === EnWhoFirst.HumanVsHuman) return "difficulty-label-disabled";
  return "";
}

function resolveDiffSelectClass() {
  if (gameState.value.settings.whoFirst === EnWhoFirst.HumanVsHuman) return "difficulty-select-disabled";
  return "";
}
</script>

<template>
  <div class="menu">
    <label for="whoFirst">
      Who starts first:
    </label>
    <select id="whoFirst" data-testid="select-whoFirst" v-model.number="gameState.settings.whoFirst">
      <option v-for="(desc, value) in whoFirstDescr" :key="value" :value="Number(value)">
        {{ desc }}
      </option>
    </select>
    <label :class="resolveDiffLabelClass()" for="difficulty">
      AI Difficulty:
    </label>
    <select :class="resolveDiffSelectClass()" :disabled="gameState.settings.whoFirst === EnWhoFirst.HumanVsHuman"
      id="difficulty" data-testid="select-difficulty" v-model.number="gameState.settings.difficulty">
      <option v-for="(desc, value) in difficultyDescr" :key="value" :value="Number(value)">
        {{ desc }}
      </option>
    </select>
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
