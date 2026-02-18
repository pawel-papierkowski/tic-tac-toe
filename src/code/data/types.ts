// GAME DATA

import type { Position } from '@vueuse/core';
import { EnDifficulty, EnWhoFirst, EnGameStatus, EnCellState, EnPlayerType } from '@/code/data/enums.ts';

// DEBUG CONSTANTS
export const defDebugMode: boolean = true;

// //////////
// Game view.
// //////////

type GameView = {
  activeScreen: 'mainMenu' | 'game';
};

export function createGameView(): GameView {
  return {
    activeScreen: 'mainMenu',
  };
}

// //////////////
// Game settings.
// //////////////

type GameSettings = {
  difficulty: EnDifficulty;
  whoFirst: EnWhoFirst;
};

export function createGameSettings(): GameSettings {
  return {
    difficulty: EnDifficulty.Easy,
    whoFirst: EnWhoFirst.Random,
  };
}

type DebugSettings = {
  debugMode: boolean;
  debugPlayer1: EnPlayerType;
  debugPlayer2: EnPlayerType;
};

export function createDebugSettings(): DebugSettings {
  return {
    debugMode: defDebugMode, // Settable only in code.
    debugPlayer1: EnPlayerType.Human, // Automatically determined from other settings.
    debugPlayer2: EnPlayerType.Human, // Automatically determined from other settings.
  };
}

// ////////////////////////
// Tic Tac Toe board state.
// ////////////////////////

/**
 * If present === true, draws strikethrough line on screen from cell x1,y1 to cell x2,y2.
 */
export type StrikeData = {
  present: boolean; // if true, line should be drawn
  start: Position; // start position of line as x,y index of cell (0-2)
  end: Position; // end position of line as x,y index of cell (0-2)
  diffStart: Position; // slight randomisation of starting position so line looks more "natural" in pixels
  diffEnd: Position; // slight randomisation of ending position in pixels
};

function createStrikeData(): StrikeData {
  return {
    present: false,
    start: { x: 0, y: 0 },
    end: { x: 0, y: 0 },
    diffStart: { x: fuzzyCoord(10), y: fuzzyCoord(10) },
    diffEnd: { x: fuzzyCoord(10), y: fuzzyCoord(10) },
  };
}

export type DebugCell = {
  score: number;
  weight: number;
  props: MoveProps;
  oppProps: MoveProps;
};

function createDebugCell(): DebugCell {
  return {
    score: 0,
    weight: 0,
    props: createMoveProps(),
    oppProps: createMoveProps(),
  };
}

function createDebugBoard(): DebugCell[][] {
  const debugBoard: DebugCell[][] = [[], [], []]; // initialize
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      debugBoard[i]![j] = createDebugCell();
    }
  }
  return debugBoard;
}

export type DebugData = {
  cells: DebugCell[][];
  debugPlayer1: EnPlayerType;
  debugPlayer2: EnPlayerType;
};

function createDebugData(): DebugData {
  return {
    cells: createDebugBoard(),
    debugPlayer1: EnPlayerType.Human,
    debugPlayer2: EnPlayerType.Human,
  };
}

type GameBoard = {
  status: EnGameStatus;
  cells: EnCellState[][];
  firstPlayer: EnPlayerType;
  currentPlayer: EnPlayerType;
  strike: StrikeData;
  debug: DebugData;
};

export function createGameBoard(): GameBoard {
  return {
    status: EnGameStatus.InProgress,
    cells: [
      [EnCellState.Empty, EnCellState.Empty, EnCellState.Empty],
      [EnCellState.Empty, EnCellState.Empty, EnCellState.Empty],
      [EnCellState.Empty, EnCellState.Empty, EnCellState.Empty],
    ],
    firstPlayer: EnPlayerType.Human,
    currentPlayer: EnPlayerType.Human,
    strike: createStrikeData(),
    debug: createDebugData(),
  };
}

type GameStatistics = {
  round: number;
  moveCount: number;
  ties: number;
  tiesInRow: number;
  humanScore: number;
  humanWinInRow: number;
  aiScore: number;
  aiWinInRow: number;
  human1Score: number;
  human1WinInRow: number;
  human2Score: number;
  human2WinInRow: number;
};

export function createGameStatistics(): GameStatistics {
  return {
    round: 0,
    moveCount: 0,
    ties: 0,
    tiesInRow: 0,
    humanScore: 0,
    humanWinInRow: 0,
    aiScore: 0,
    aiWinInRow: 0,
    human1Score: 0,
    human1WinInRow: 0,
    human2Score: 0,
    human2WinInRow: 0,
  };
}

// ///////////////////////
// Complete state of game.
// In principle you could serialize it into file on disk, creating full save of game.
// ///////////////////////

export type GameState = {
  view: GameView;
  settings: GameSettings;
  debugSettings: DebugSettings;
  board: GameBoard;
  statistics: GameStatistics;
};

export function createGameState(): GameState {
  return {
    view: createGameView(), // what should be shown on screen
    settings: createGameSettings(), // determined in main menu
    debugSettings: createDebugSettings(),
    board: createGameBoard(), // reset every round (and so also every game)
    statistics: createGameStatistics(), // reset every game
  };
}

// /////////////////////////////
// Types for tic-tac-toe engine.
// /////////////////////////////

export type PointsData = {
  posBasic: number; // Points for basic move.
  posCorner: number; // Points for move in corner.
  posCenter: number; // Points for move in center.

  bonusLineUp: number; // Bonus for single lineup.
  bonusFork: number; // Bonus for creating fork with this move.
  bonusPreventFork: number; // Bonus for move that prevents fork game.
  bonusWin: number; // Bonus for move that wins the game.
  bonusPreventLoss: number; // Bonus for move that prevents losing game.
};

export function createPointsData(): PointsData {
  return {
    posBasic: 0,
    posCorner: 0,
    posCenter: 0,

    bonusLineUp: 0,
    bonusFork: 0,
    bonusPreventFork: 0,
    bonusWin: 0,
    bonusPreventLoss: 0,
  };
}

export type MoveProps = {
  win: boolean; // If true, this move is winning move.
  futWin: boolean; // If true, this move leads to winning move.
  lineUp: number; // Amout of other your marks that are lined up with this move.
  fork: boolean; // If true, this move will produce fork for you.
};

function createMoveProps(): MoveProps {
  return {
    win: false,
    futWin: false,
    lineUp: 0,
    fork: false,
  };
}

export type LegalMove = {
  who: EnCellState; // Who is making move: crosses or naughts?
  x: number;
  y: number;
  score: number; // The higher score, the better is move. Same on any difficulty.
  weight: number; // Importance of move. Used in medium and hard difficulties.
  props: MoveProps; // move properties needed for score/weight from your perspective
  oppProps: MoveProps; // move properties needed for score/weight from opponent's perspective
};

export function createLegalMove(who: EnCellState, x: number, y: number): LegalMove {
  return {
    who: who,
    x: x,
    y: y,
    score: 0,
    weight: 0,
    props: createMoveProps(),
    oppProps: createMoveProps(),
  };
}

/////////
// Other.
/////////

/**
 * Get number in -range to +range range.
 * @param range Range.
 * @returns Number.
 */
function fuzzyCoord(range: number): number {
  return Math.random() * range * 2 - range;
}
