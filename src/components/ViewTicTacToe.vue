<script setup lang="ts">
import { type GameState } from '../code/types.ts'
import { changeScreen } from '../code/common.ts'
import { difficultyDescr, playerTypeDescr } from '../code/data.ts';
import TicTacToeCell from './TicTacToeCell.vue'

const gameState = defineModel<GameState>({ required: true })

function toMainMenu() {
  changeScreen(gameState, 'mainMenu');
}
</script>

<template>
  <div class="info">
    <div>Difficulty:</div>
    <div>{{ difficultyDescr[gameState.settings.difficulty] }}</div>
    <div>First:</div>
    <div>{{ playerTypeDescr[gameState.board.first] }}</div>
  </div>

  <div class="scoreboard">
    <h2>SCOREBOARD</h2>
    <div>Ties:</div>
    <div>{{ gameState.board.ties }}</div>
    <div>Ties in row:</div>
    <div>{{ gameState.board.tiesInRow }}</div>
    <div>Human wins:</div>
    <div>{{ gameState.board.humanScore }}</div>
    <div>Human wins in row:</div>
    <div>{{ gameState.board.humanWinInRow }}</div>
    <div>AI wins:</div>
    <div>{{ gameState.board.aiScore }}</div>
    <div>AI wins in row:</div>
    <div>{{ gameState.board.aiWinInRow }}</div>
  </div>

  <div class="gameboard">
    <div class="lineskip"></div>
    <!-- 1st row -->
    <div></div>
    <TicTacToeCell v-model="gameState" :col="0" :row="0" />
    <div class="boardlinev"></div>
    <TicTacToeCell v-model="gameState" :col="1" :row="0" />
    <div class="boardlinev"></div>
    <TicTacToeCell v-model="gameState" :col="2" :row="0" />
    <div></div>

    <div></div>
    <div class="boardlineh"></div>
    <div></div>

    <!-- 2nd row -->
    <div></div>
    <TicTacToeCell v-model="gameState" :col="0" :row="1" />
    <div class="boardlinev"></div>
    <TicTacToeCell v-model="gameState" :col="1" :row="1" />
    <div class="boardlinev"></div>
    <TicTacToeCell v-model="gameState" :col="2" :row="1" />
    <div></div>

    <div></div>
    <div class="boardlineh"></div>
    <div></div>

    <!-- 3rd row -->
    <div></div>
    <TicTacToeCell v-model="gameState" :col="0" :row="2" />
    <div class="boardlinev"></div>
    <TicTacToeCell v-model="gameState" :col="1" :row="2" />
    <div class="boardlinev"></div>
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
