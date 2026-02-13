<script setup lang="ts">
import { EnGameStatus, EnPlayerType, type GameState } from '@/code/types.ts'
import { playerTypeDescr } from '@/code/data.ts';

// It is used only in template, so we need to disable this warning.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps<{gameState: GameState}>(); // read-only
</script>

<template>
  <div class="status">
    <div v-if="gameState.board.status == EnGameStatus.InProgress">
      <div v-if="gameState.board.currentPlayer === EnPlayerType.Human">Your turn!</div>
      <div v-else>AI is thinking...
        <!-- CSS cannot access .svg files in <img>, so we use inline SVG code. Bah. -->
        <svg class="spinner" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 155 155" fill="none">
          <g stroke="currentColor" stroke-width="35" stroke-linecap="round">
            <circle cx="77.5" cy="77.5" r="60" stroke-opacity=".55" />
            <path d="M90.305 18.882A60.003 60.003 0 0 1 137.5 77.5" />
          </g>
        </svg>
      </div>
    </div>
    <div v-else-if="gameState.board.status == EnGameStatus.Tie">
      Game ended in tie!
    </div>
    <div v-else-if="gameState.board.status == EnGameStatus.PlayerWon">
      {{ playerTypeDescr[gameState.board.currentPlayer] }} won!
    </div>
    <div v-else>Error happened. Restart game.</div>
  </div>
</template>

<style scoped>

.status {
  display: flex;
  align-items: center;     /* Vertical centering */
  justify-content: center; /* Horizontal centering */
  margin: 5px;
}

.status div {
  display: flex;
  align-items: center;
  gap: 8px; /* Space between text and spinner */
}

.spinner {
  color: #ff8e3c;
  animation: spin 1500ms linear infinite;
  width: 22px;
  height: 22px;
}

@keyframes spin {
  /* Spin the spinner with CSS. */
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

</style>
