<script setup lang="ts">
import { computed } from 'vue';
import { useWindowSize } from '@vueuse/core'; // refDebounced
import { EnGameStatus, EnPlayerType, type GameState } from '@/code/types.ts';
import { changeScreen } from '@/code/common.ts';
import { prepareNextRound } from '@/code/ticTacToe.ts';
import { calcStrikeLineStyle } from '@/code/lineStrike.ts';
import { moveAi } from '@/code/ai.ts';
import { fillDebugData } from '@/code/debug.ts';
import SidePanel from '@/components/SidePanel.vue';
import GameStatus from '@/components/GameStatus.vue';
import TicTacToeCell from '@/components/TicTacToeCell.vue';

const gameState = defineModel<GameState>({ required: true });

const { width, height } = useWindowSize();
// we do not use debouncing since drawing delay looks crappy
//const debouncedWidth = refDebounced(width, 50);
//const debouncedHeight = refDebounced(height, 50);

// calcStrikeLineStyle() is called when data change or window is resized
const lineStyle = computed(() => {
  // Automatically recalculates when window size changes.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const w = width.value;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const h = height.value;
  return calcStrikeLineStyle(gameState);
});

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

  <div class="winning-line" :style="lineStyle"></div>

  <div class="menu">
    <button @click="toMainMenu">Quit</button>
  </div>
</template>

<style scoped>

.gameboard {
  display: grid;
  grid-template-columns: repeat(3, 10px 200px) 10px;
  grid-template-rows: repeat(3, 10px 200px) 10px;

  width: 100%;
  margin: auto;

  background-color: #f8f8f8;
  border-radius: 10px;
}

.lineskip {
  grid-column: 1 / -1
}

/* Lines on board. */
.boardline-vt {
  background-color: #444444;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}
.boardline-vm {
  background-color: #444444;
}
.boardline-vb {
  background-color: #444444;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
}
.boardline-h {
  background-color: #444444;
  border-radius: 10px;
  grid-column: span 5
}

.winning-line {
  position: absolute;
  background: red;
  z-index: 10;

  height: 15px;
  border-radius: 15px;
}

/* Smaller on mobile */
@media (max-width: 768px) {
  .gameboard {
    grid-template-columns: repeat(3, 5px 100px) 5px;
    grid-template-rows: repeat(3, 5px 100px) 5px;

    border-radius: 5px;
  }

  .boardline-vt {
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }
  .boardline-vb {
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
  }
  .boardline-h {
    border-radius: 5px;
  }

  .winning-line {
    height: 10px;
    border-radius: 10px;
  }
}

/* Smaller on mobile */
@media (min-width: 768px) and (max-height: 1100px) {
  .gameboard {
    grid-template-columns: repeat(3, 6px 170px) 6px;
    grid-template-rows: repeat(3, 6px 170px) 6px;

    border-radius: 5px;
  }
}

/* Smaller on mobile */
@media (max-width: 600px) and (max-height: 700px) {
  .gameboard {
    grid-template-columns: repeat(3, 4px 80px) 4px;
    grid-template-rows: repeat(3, 4px 80px) 4px;

    border-radius: 5px;
  }
}

</style>
