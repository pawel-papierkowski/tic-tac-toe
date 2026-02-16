<script setup lang="ts">
import { type GameState } from '@/code/types.ts'
import { difficultyDescr, playerTypeDescr } from '@/code/data.ts';

// It is used only in template, so we need to disable this warning.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps<{gameState: GameState}>(); // read-only
</script>

<template>
  <div class="sidepanels">
    <div class="info">
      <h2>BASIC DATA</h2>
      <div>Difficulty:</div>
      <div>{{ difficultyDescr[gameState.settings.difficulty] }}</div>
      <div>First:</div>
      <div>{{ playerTypeDescr[gameState.board.firstPlayer] }}</div>
    </div>

    <div class="scoreboard">
      <h2>SCOREBOARD</h2>
      <div>Round:</div>
      <div>{{ gameState.statistics.round }}</div>
      <div>Ties:</div>
      <div>{{ gameState.statistics.ties }}</div>
      <div>Ties in row:</div>
      <div>{{ gameState.statistics.tiesInRow }}</div>
      <div>Human wins:</div>
      <div>{{ gameState.statistics.humanScore }}</div>
      <div>Human wins in row:</div>
      <div>{{ gameState.statistics.humanWinInRow }}</div>
      <div>AI wins:</div>
      <div>{{ gameState.statistics.aiScore }}</div>
      <div>AI wins in row:</div>
      <div>{{ gameState.statistics.aiWinInRow }}</div>
    </div>
  </div>
</template>

<style scoped>

/* Common. */

h2 {
  grid-column: span 2;
  font-size: 21px;
  color: #484848;
  text-align: center;
  text-shadow: 0 0 3px currentColor;
}

/* Side panels. If window is wide enough, it is on side of screen. */

.sidepanels {
  position: fixed;
  top: 0;
  right: 0;

  overflow-y: auto;  /* Scrollable if content is long */
  z-index: 100;  /* Ensure it's above other content */

  min-width: 250px;
  max-width: 500px;
}

/* Info panel. */

.info {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2px;

  margin: 10px;
  padding: 5px;
  border-radius: 10px;

  background-color: #f0f0f0;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);

  font-size: 14px;
  text-align: center;
}

/* Score board. */

.scoreboard {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2px;

  margin: 10px;
  padding: 5px;
  border-radius: 10px;

  background-color: #f0f0f0;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);

  font-size: 14px;
  text-align: left;
}

/* Non-desktops. */

@media (max-width: 1200px) {
  .sidepanels {
    position: static;
    margin: auto;
  }
}

@media (max-width: 768px) {
  h2 {
    font-size: 17px;
  text-shadow: 0 0 2px currentColor;
  }

  .info {
    margin: 7px 10px;
    padding: 2px 10px;
    font-size: 12px;
    box-shadow: 0 2px 3px rgba(0,0,0,0.1);
  }

  .scoreboard {
    margin: 7px 10px;
    padding: 2px 10px;
    font-size: 12px;
    box-shadow: 0 2px 3px rgba(0,0,0,0.1);
  }
}

</style>
