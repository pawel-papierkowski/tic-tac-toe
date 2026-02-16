import type { Ref } from 'vue';
import type { GameState, LegalMove } from './types.ts';
import { EnCellState, EnDifficulty, EnGameStatus, EnPlayerType } from './types.ts';
import { resolveLegalMoves } from './legalMoves.ts';
import { fillDebugData } from '@/code/debug.ts';

/**
 * AI makes move.
 * Note: if AI is first, it will use X, otherwise it will use O.
 * @param gameState Reference to game state.
 */
export function moveAi(gameState : Ref<GameState>) {
  const who : EnCellState = // first player uses crosses, second player uses naughts
    gameState.value.board.firstPlayer === gameState.value.board.currentPlayer ? EnCellState.X : EnCellState.O;
  const legalMoves = resolveLegalMoves(gameState, who, true);
  if (legalMoves.length === 0) { // no legal moves, we have tie
    reactOnTie(gameState);
    return;
  }
  // We know there is at least one move available.
  const pickedMove : LegalMove = moveAiDifficulty(gameState, legalMoves);
  executeMove(gameState, pickedMove);
  fillDebugData(gameState);
}

/**
 * Picks move from list of possible legal moves depending on difficulty.
 * @param gameState Reference to game state.
 * @param legalMoves List of available legal moves. There is always at least one move.
 * @returns Picked legal move.
 */
function moveAiDifficulty(gameState : Ref<GameState>, legalMoves : LegalMove[]) : LegalMove {
   // No point in picking move if there is only one move available...
  if (legalMoves.length === 1) return legalMoves[0]!;

  switch (gameState.value.settings.difficulty) {
    case EnDifficulty.Easy: return moveEasy(legalMoves);
    case EnDifficulty.Medium: return moveMedium(legalMoves);
    case EnDifficulty.Hard: return moveHard(legalMoves);
    case EnDifficulty.Impossible: return moveImpossible(legalMoves);
  }
}

//

/**
 * AI on easy difficulty will always pick completely random move out of all legal moves.
 * @param legalMoves List of available legal moves. There is always at least two moves.
 * @returns Picked move.
 */
function moveEasy(legalMoves : LegalMove[]) : LegalMove {
  // Pick random legal move.
  const index = Math.floor(Math.random() * legalMoves.length);
  return legalMoves[index]!;
}

/**
 * AI on medium difficulty will sometimes actually try to win.
 * @param legalMoves List of available legal moves. There is always at least two moves.
 * @returns Picked move.
 */
function moveMedium(legalMoves : LegalMove[]) : LegalMove {
  // Pick move randomly, but weighted. Note scoring is different than on hard/impossible.
  const index = pickWeighted(legalMoves);
  return legalMoves[index]!;
}

/**
 * AI on hard difficulty plays like in impossible, but with chance of making different move than best one.
 * @param legalMoves List of available legal moves. There are always at least two moves.
 * @returns Picked move.
 */
function moveHard(legalMoves : LegalMove[]) : LegalMove {
  // Pick move randomly, but weighted. On hard scoring is different than on medium.
  // Among other things, score of winning move is very large and score of move that prevents opponent win is large.
  const index = pickWeighted(legalMoves);
  return legalMoves[index]!;
}

/**
 * AI on impossible difficulty will play perfectly.
 * @param legalMoves List of available legal moves. There are always at least two moves.
 * @returns Picked move.
 */
function moveImpossible(legalMoves : LegalMove[]) : LegalMove {
  // Always pick highest scored move.
  return pickHighestScore(legalMoves);
}

//

/**
 * Pick move randomly, but weighted.
 * @param legalMoves List of available legal moves. There are always at least two moves.
 * @returns Index of picked legal move.
 */
function pickWeighted(legalMoves : LegalMove[]) : number {
  // Calculate cumulative weights.
  const cumulativeWeights = legalMoves.reduce((acc, legalMove, i) => {
    acc.push(legalMove.weight + (acc[i - 1] || 0));
    return acc;
  }, [] as number[]);
  const random = Math.random() * cumulativeWeights[cumulativeWeights.length - 1]!;
  return cumulativeWeights.findIndex(weight => weight > random);
}

/**
 * Pick move with highest score. If there are multiple moves with same score, pick one randomly.
 * @param legalMoves List of available legal moves. There are always at least two moves.
 * @returns Index of picked legal move.
 */
function pickHighestScore(legalMoves : LegalMove[]) : LegalMove {
  let bestMoves : LegalMove[] = []; // there can be multiple moves with exactly same best score
  let bestScore : number = 0;
  for (const legalMove of legalMoves) {
    if (legalMove.score > bestScore) {
      bestMoves = []; // clear array
      bestScore = legalMove.score;
      bestMoves.push(legalMove);
    } else if (legalMove.score === bestScore) {
      bestMoves.push(legalMove);
    }
  }
  console.log(`Found ${bestMoves.length} best move(s) with score ${bestScore}.`);
  if (bestMoves.length === 1) return bestMoves[0]!;
  // pick one of best moves if more than one
  const index = Math.floor(Math.random() * bestMoves.length);
  return bestMoves[index]!;
}

// ////////

/**
 * Place X or O, check if current player won the game, check tie, switch current player.
 * Note this function is used both by AI and human.
 * @param move Legal move to execute.
 */
export function executeMove(gameState : Ref<GameState>, move : LegalMove) {
  if (gameState.value.board.cells[move.x]![move.y] !== EnCellState.Empty) {
    gameState.value.board.status = EnGameStatus.Stop;
    console.error(`Tried to execute illegal move! X: ${move.x}, Y: ${move.y}`);
    return;
  }
  gameState.value.board.cells[move.x]![move.y] = move.who;

  // Check if win state was achieved.
  if (checkWinState(gameState)) {
    reactOnWin(gameState);
    return;
  }

  // Check if tie state was achieved.
  const who : EnCellState = // first player uses crosses, second player uses naughts
    gameState.value.board.firstPlayer === gameState.value.board.currentPlayer ? EnCellState.X : EnCellState.O;
  const legalMoves = resolveLegalMoves(gameState, who, false);
  if (legalMoves.length === 0) { // no legal moves, we have tie
    reactOnTie(gameState);
    return;
  }

  // If we are here, we know game continues. Switch current player.
  gameState.value.board.currentPlayer = gameState.value.board.currentPlayer === EnPlayerType.AI ? EnPlayerType.Human : EnPlayerType.AI;
  return;
}

/**
 * Set up game state for win.
 * @param gameState Reference to game state.
 */
function reactOnWin(gameState : Ref<GameState>) {
  gameState.value.board.status = EnGameStatus.PlayerWon; // we know who won from currentPlayer
  gameState.value.statistics.tiesInRow = 0;

  if (gameState.value.board.currentPlayer === EnPlayerType.Human) {
    gameState.value.statistics.humanScore++;
    gameState.value.statistics.humanWinInRow++;
    gameState.value.statistics.aiWinInRow = 0;
  } else {
    gameState.value.statistics.aiScore++;
    gameState.value.statistics.aiWinInRow++;
    gameState.value.statistics.humanWinInRow = 0;
  }
}

/**
 * Set up game state for tie.
 * @param gameState Reference to game state.
 */
function reactOnTie(gameState : Ref<GameState>) {
  gameState.value.board.status = EnGameStatus.Tie;
  gameState.value.statistics.ties++;
  gameState.value.statistics.tiesInRow++;
  gameState.value.statistics.aiWinInRow = 0;
  gameState.value.statistics.humanWinInRow = 0;
}

//

/**
 * Check state of board and see if there are any three cells with same X or O state in row, column or across.
 * @param gameState Reference to game state.
 */
function checkWinState(gameState : Ref<GameState>) : boolean {
  // Game is simple enough that we can just check all possibilities manually.
  gameState.value.board.strike.present = true; // how optimistic

  // first all cases from upper left corner (horizontal line, vertical line and cross)
  if (checkUpLeftCorner(gameState)) return true;
  // now middle horizontal and vertical
  if (checkMiddleLines(gameState)) return true;
  // now horizontal and vertical at end
  if (checkEndLines(gameState)) return true;
  // last is upper right corner cross
  if (checkUpRightCorner(gameState)) return true;

  gameState.value.board.strike.present = false;
  return false; // no win state exist
}

function checkUpLeftCorner(gameState : Ref<GameState>) : boolean {
  const cellState = gameState.value.board.cells[0]![0]; // upper left corner
  if (cellState !== EnCellState.O && cellState != EnCellState.X) return false;
  gameState.value.board.strike.start.x = 0;
  gameState.value.board.strike.start.y = 0;
  if (gameState.value.board.cells[1]![0] === cellState && gameState.value.board.cells[2]![0] === cellState) { // horizontal line
    gameState.value.board.strike.end.x = 2; // XXX
    gameState.value.board.strike.end.y = 0; // ???
    return true;                            // ???
  }
  if (gameState.value.board.cells[0]![1] === cellState && gameState.value.board.cells[0]![2] === cellState) { // vertical line
    gameState.value.board.strike.end.x = 0; // X??
    gameState.value.board.strike.end.y = 2; // X??
    return true;                            // X??
  }
  if (gameState.value.board.cells[1]![1] === cellState && gameState.value.board.cells[2]![2] === cellState) { // cross
    gameState.value.board.strike.end.x = 2; // X??
    gameState.value.board.strike.end.y = 2; // ?X?
    return true;                            // ??X
  }
  return false;
}

function checkMiddleLines(gameState : Ref<GameState>) : boolean {
  let cellState = gameState.value.board.cells[1]![0];
  if (cellState !== EnCellState.O && cellState != EnCellState.X) return false;
  gameState.value.board.strike.start.x = 1;
  gameState.value.board.strike.start.y = 0;
  if (gameState.value.board.cells[1]![1] === cellState && gameState.value.board.cells[1]![2] === cellState) { // horizontal middle line
    gameState.value.board.strike.end.x = 1; // ???
    gameState.value.board.strike.end.y = 2; // XXX
    return true;                            // ???
  }
  cellState = gameState.value.board.cells[0]![1];
  if (cellState !== EnCellState.O && cellState != EnCellState.X) return false;
  gameState.value.board.strike.start.x = 0;
  gameState.value.board.strike.start.y = 1;
  if (gameState.value.board.cells[1]![1] === cellState && gameState.value.board.cells[2]![1] === cellState) { // vertical middle line
    gameState.value.board.strike.end.x = 2; // ?X?
    gameState.value.board.strike.end.y = 1; // ?X?
    return true;                            // ?X?
  }
  return false;
}

function checkEndLines(gameState : Ref<GameState>) : boolean {
  const cellState = gameState.value.board.cells[2]![2]; // bottom right corner
  if (cellState !== EnCellState.O && cellState != EnCellState.X) return false;
  gameState.value.board.strike.start.x = 2;
  gameState.value.board.strike.start.y = 2;
  if (gameState.value.board.cells[1]![2] === cellState && gameState.value.board.cells[0]![2] === cellState) { // horizontal line
    gameState.value.board.strike.end.x = 0; // ???
    gameState.value.board.strike.end.y = 2; // ???
    return true;                            // XXX
  }
  if (gameState.value.board.cells[2]![1] === cellState && gameState.value.board.cells[2]![0] === cellState) { // vertical line
    gameState.value.board.strike.end.x = 2; // ??X
    gameState.value.board.strike.end.y = 0; // ??X
    return true;                         // ??X
  }
  return false;
}

function checkUpRightCorner(gameState : Ref<GameState>) : boolean {
  const cellState = gameState.value.board.cells[2]![0]; // upper right corner
  if (cellState !== EnCellState.O && cellState != EnCellState.X) return false;
  gameState.value.board.strike.start.x = 2;
  gameState.value.board.strike.start.y = 0;
  if (gameState.value.board.cells[1]![1] === cellState && gameState.value.board.cells[0]![2] === cellState) { // cross
    gameState.value.board.strike.end.x = 0; // ??X
    gameState.value.board.strike.end.y = 2; // ?X?
    return true;                            // X??
  }
  return false;
}
