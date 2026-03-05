import type { PointsData, MiniMaxScoring, Line3 } from './types.ts';
import { createPointsData } from './types.ts';
import { EnDifficulty } from './enums.ts';

/** Fundamental project properties. More or less constant. */
type ProjectProp = {
  title: string;
  author: string;
  dateRange: string;
  version: string;
  build: string;
};

export const projectProp: ProjectProp = {
  title: "TIC TAC TOE",
  author: "Paweł Papierkowski",
  dateRange: "2026",
  version: import.meta.env.VITE_APP_VERSION, // from package.json, defined in vite.config.ts
  build: import.meta.env.DEV ? "DEV" : "PROD",
}

/** Fundamental game properties. More or less constant. */
type GameProp = {
  boardSize: number;
};

export const gameProp: GameProp = {
  boardSize: 3,
}

/** General configuration of game. */
type GameConfig = {
  aiWait: number; // how long AI is idling before making move in milliseconds
  maxDepth: number; // maximum depth to go, for miniMax algo
};

export const gameConfig: GameConfig = {
  aiWait: 700, // in ms, default is 700
  maxDepth: 3, // enough to detect fork attempts
}

//

/** All difficulties have same score rules. */
export const defScoringData: PointsData = {
  posBasic: 10,
  posCorner: 20,
  posCenter: 50,

  bonusLineUp: 25,
  bonusFork: 1000,
  bonusPreventFork: 5000,
  bonusWin: 100000,
  bonusPreventLoss: 10000,

  mulMiniMax: 10,
};

const weightsMedium: PointsData = {
  posBasic: 10,
  posCorner: 20,
  posCenter: 50,

  bonusLineUp: 25,
  bonusFork: 100,
  bonusPreventFork: 50,
  bonusWin: 500,
  bonusPreventLoss: 400,

  mulMiniMax: 1,
};

const weightsHard: PointsData = {
  posBasic: 10,
  posCorner: 20,
  posCenter: 50,

  bonusLineUp: 25,
  bonusFork: 1000,
  bonusPreventFork: 50,
  bonusWin: 100000,
  bonusPreventLoss: 10000,

  mulMiniMax: 10,
};

/** Weights matter only for Medium and Hard difficulties. */
export const weightData: Record<EnDifficulty, PointsData> = {
  [EnDifficulty.Easy]: createPointsData(), // easy makes completely random moves, score does not matter
  [EnDifficulty.Medium]: weightsMedium,
  [EnDifficulty.Hard]: weightsHard,
  [EnDifficulty.Impossible]: createPointsData(), // impossible relies only on miniMax
};

/** Evaluation values for MiniMax algorithm. */
export const miniMaxScoring: MiniMaxScoring = {
  max:     10000,
  win:     1000,
  draw:    0,
  inLine3: 100,
  inLine2: 10,
  inLine1: 1,
  other:   0,
};

/** Shortcut to know which cells are lines. */
export const line3array: Line3[] = [
  {x1: 0, y1: 0, x2: 0, y2: 1, x3: 0, y3: 2}, // horizontal lines
  {x1: 1, y1: 0, x2: 1, y2: 1, x3: 1, y3: 2},
  {x1: 2, y1: 0, x2: 2, y2: 1, x3: 2, y3: 2},
  {x1: 0, y1: 0, x2: 1, y2: 0, x3: 2, y3: 0}, // vertical lines
  {x1: 0, y1: 1, x2: 1, y2: 1, x3: 2, y3: 1},
  {x1: 0, y1: 2, x2: 1, y2: 2, x3: 2, y3: 2},
  {x1: 0, y1: 0, x2: 1, y2: 1, x3: 2, y3: 2}, // diagonal
  {x1: 0, y1: 2, x2: 1, y2: 1, x3: 2, y3: 0}, // backward diagonal
];
