<script setup lang="ts">
import { EnGameStatus, EnPlayerType, type GameState } from '@/code/types.ts';
import { changeScreen } from '@/code/common.ts';
import { prepareNextRound } from '@/code/ticTacToe.ts';
import { moveAi } from '@/code/ai.ts';
import { fillDebugData } from '@/code/debug.ts';
import SidePanel from '@/components/SidePanel.vue';
import GameStatus from '@/components/GameStatus.vue';
import TicTacToeCell from '@/components/TicTacToeCell.vue';

const gameState = defineModel<GameState>({ required: true })

/**
 * Return back to main menu.
 */
function toMainMenu() {
  changeScreen(gameState, 'mainMenu');
}

/**
 * Check if can start next round.
 * @returns True if can start next round, otherwise false.
 */
function canStartNextRound() : boolean {
  if (gameState.value.board.status == EnGameStatus.PlayerWon || gameState.value.board.status == EnGameStatus.Tie)
   return true;
  return false;
}

/**
 * Start next round.
 */
async function nextRound() {
  prepareNextRound(gameState);
  if (gameState.value.board.firstPlayer == EnPlayerType.AI) {
    await new Promise(resolve => setTimeout(resolve, 700)); // Delay for visual effect...
    moveAi(gameState); // THEN execute AI move.
  } else {
    fillDebugData(gameState);
  }
}
</script>

<template>
  <SidePanel :gameState="gameState" />
  <GameStatus :gameState="gameState" />

  <div class="menu" v-if="canStartNextRound()">
    <button @click="nextRound">Next Round</button>
  </div>

  <div class="gameboard">
    <div class="lineskip"></div>
    <!-- 1st row -->
    <div></div>
    <TicTacToeCell v-model="gameState" :col="0" :row="0" />
    <div class="boardline-vt"></div>
    <TicTacToeCell v-model="gameState" :col="1" :row="0" />
    <div class="boardline-vt"></div>
    <TicTacToeCell v-model="gameState" :col="2" :row="0" />
    <div></div>

    <div></div>
    <div class="boardline-h"></div>
    <div></div>

    <!-- 2nd row -->
    <div></div>
    <TicTacToeCell v-model="gameState" :col="0" :row="1" />
    <div class="boardline-vm"></div>
    <TicTacToeCell v-model="gameState" :col="1" :row="1" />
    <div class="boardline-vm"></div>
    <TicTacToeCell v-model="gameState" :col="2" :row="1" />
    <div></div>

    <div></div>
    <div class="boardline-h"></div>
    <div></div>

    <!-- 3rd row -->
    <div></div>
    <TicTacToeCell v-model="gameState" :col="0" :row="2" />
    <div class="boardline-vb"></div>
    <TicTacToeCell v-model="gameState" :col="1" :row="2" />
    <div class="boardline-vb"></div>
    <TicTacToeCell v-model="gameState" :col="2" :row="2" />
    <div></div>

    <div class="lineskip"></div>
  </div>

  <div class="menu">
    <button @click="toMainMenu">Quit</button>
  </div>
</template>

<style scoped>
</style>
