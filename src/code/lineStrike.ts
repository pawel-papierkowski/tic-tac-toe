import type { Ref } from 'vue';
import type { GameState } from '@/code/types.ts';

/**
 * Calculate strike line drawn when someone wins the game.
 * @param gameState
 * @returns Style of line.
 */
export function calcStrikeLineStyle(gameState : Ref<GameState>) {
  const strike = gameState.value.board.strike;
  if (!strike.present) return { display: 'none' };
  console.log(`Strike line. x1: ${strike.start.x}, y1: ${strike.start.y}, x2: ${strike.end.x}, y2: ${strike.end.y}.`);

  const startElement = resolveElement(strike.start.x, strike.start.y);
  const endElement = resolveElement(strike.end.x, strike.end.y);
  if (startElement === null || endElement === null) return; // invalid

  // calculate using actual positions of cells on screen.
  const startX = startElement.centerX + strike.diffStart.x;
  const startY = startElement.centerY + strike.diffStart.y;
  const endX = endElement.centerX + strike.diffEnd.x;
  const endY = endElement.centerY + strike.diffEnd.y;
  console.log(`startElement: x=${startX},  y=${startY}. endElement: x=${endX}, y=${endY}.`);

  // Calculate length and angle
  const length = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
  const angle = Math.atan2(endY - startY, endX - startX) * (180 / Math.PI);

  return {
    width: `${length}px`,
    left: `${startX}px`,
    top: `${startY}px`,
    transform: `rotate(${angle}deg)`,
    transformOrigin: '0 0'
  };
}

function resolveElement(x : number, y : number) {
  const elementId : string = `${x}x${y}`;
  const element = document.getElementById(elementId);
  if (element) {
    const rect = element.getBoundingClientRect();

    let widthOffset = rect.width / 2;
    if (x == 0) widthOffset = rect.width / 4;
    else if (x == 2) widthOffset = rect.width / 1.25;
    let heightOffset = rect.height / 2;
    if (y == 0) heightOffset = rect.height / 4;
    else if (y == 2) heightOffset = rect.height / 1.25;

    return {
      centerX: rect.left + widthOffset + window.scrollX,
      centerY: rect.top + heightOffset + window.scrollY,
    }
  }
  console.warn(`Failed to resolve element ${elementId}!`);
  return null;
}
