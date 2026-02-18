import type { Ref } from 'vue';
import type { GameState, StrikeData } from '@/code/data/types.ts';

/**
 * Calculate strike line drawn when someone wins the game. Called on win or when browser window is resized.
 * Note coordinates of start and end of line are calculated based on position of cells.
 * Each cell is div element with unique id.
 * @param gameState
 * @returns Style of line.
 * @see TicTacToeCell.vue
 */
export function calcStrikeLineStyle(gameState: Ref<GameState>) {
  const strike = gameState.value.board.strike;
  if (!strike.present) return { display: 'none' }; // no one won yet
  //console.log(`Strike line. x1: ${strike.start.x}, y1: ${strike.start.y}, x2: ${strike.end.x}, y2: ${strike.end.y}.`);

  const startCoords = resolveCoords(true, strike);
  const endCoords = resolveCoords(false, strike);
  if (startCoords === null || endCoords === null) return { display: 'none' }; // invalid

  // Calculate using actual positions of cells on browser screen.
  const startX = startCoords.centerX + strike.diffStart.x;
  const startY = startCoords.centerY + strike.diffStart.y;
  const endX = endCoords.centerX + strike.diffEnd.x;
  const endY = endCoords.centerY + strike.diffEnd.y;
  //console.log(`startCoords: x=${startX},  y=${startY}. endCoords: x=${endX}, y=${endY}.`);

  // Calculate length and angle
  const length = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
  const angle = Math.atan2(endY - startY, endX - startX) * (180 / Math.PI);

  return {
    width: `${length}px`,
    left: `${startX}px`,
    top: `${startY}px`,
    transform: `rotate(${angle}deg)`,
    transformOrigin: '0 0',
  };
}

/**
 * Resolves coordinates of start or end of line.
 * @param startStrike If true, we find out coordinates for start of line, otherwise end of line.
 * @param strike Strike data.
 * @returns Coordinates or null if failed to find cell.
 */
function resolveCoords(startStrike: boolean, strike: StrikeData): { centerX: number; centerY: number } | null {
  const x = startStrike ? strike.start.x : strike.end.x;
  const y = startStrike ? strike.start.y : strike.end.y;
  const otherX = startStrike ? strike.end.x : strike.start.x;
  const otherY = startStrike ? strike.end.y : strike.start.y;

  // All cells are <div> that have id that contains x,y indexes of cell.
  // Example: cell with x=1 and y=2 will have id = '1x2'.
  const elementId: string = `${x}x${y}`;
  const element = document.getElementById(elementId);
  if (element == null) {
    // can happen during Vue's hot reload
    console.warn(`Failed to resolve cell ${elementId}!`);
    return null;
  }
  const rect = element.getBoundingClientRect();
  let widthOffset = rect.width / 2;
  let heightOffset = rect.height / 2;

  if (x === otherX) {
    // horizontal line
    if (y === 0) heightOffset = rect.height / 4;
    else if (y === 2) heightOffset = rect.height / 1.25;
  }
  if (y === otherY) {
    // vertical line
    if (x === 0) widthOffset = rect.width / 4;
    else if (x === 2) widthOffset = rect.width / 1.25;
  }

  if (x !== otherX && y !== otherY) {
    // cross
    if (x === 0) widthOffset = rect.width / 4;
    else if (x === 2) widthOffset = rect.width / 1.25;
    if (y === 0) heightOffset = rect.height / 4;
    else if (y === 2) heightOffset = rect.height / 1.25;
  }

  return {
    centerX: rect.left + widthOffset + window.scrollX,
    centerY: rect.top + heightOffset + window.scrollY,
  };
}
