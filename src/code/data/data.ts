import type { PointsData, MiniMaxScoring, Line3 } from './types.ts';
import { createPointsData } from './types.ts';
import { EnDifficulty, EnWhoFirst, EnPlayerType, EnCellState } from './enums.ts';

/** Fundamental game properties. */
type GameFundProp = {
  title: string;
  author: string;
  version: string;
  build: string;
};

export const gameFundProp: GameFundProp = {
  title: "TIC TAC TOE",
  author: "Paweł Papierkowski",
  version: import.meta.env.VITE_APP_VERSION,
  build: import.meta.env.DEV ? "DEV" : "PROD",
}

//

export const difficultyDescr: Record<EnDifficulty, string> = {
  [EnDifficulty.Easy]: 'Easy - Random moves',
  [EnDifficulty.Medium]: 'Medium - Sometimes strategic',
  [EnDifficulty.Hard]: 'Hard - Occasional mistakes',
  [EnDifficulty.Impossible]: 'Impossible - Perfect play',
};

export const whoFirstDescr: Record<EnWhoFirst, string> = {
  [EnWhoFirst.Random]: 'Random',
  [EnWhoFirst.Human]: 'Human',
  [EnWhoFirst.AI]: 'AI',
  [EnWhoFirst.HumanVsHuman]: 'Human vs human',
};

export const playerTypeDescr: Record<EnPlayerType, string> = {
  [EnPlayerType.Human]: 'Human',
  [EnPlayerType.AI]: 'AI',
  [EnPlayerType.Human1]: 'Human 1',
  [EnPlayerType.Human2]: 'Human 2',
};

export const cellStateDescr: Record<EnCellState, string> = {
  [EnCellState.Unknown]: 'Unknown',
  [EnCellState.Empty]: 'Empty',
  [EnCellState.X]: 'Cross',
  [EnCellState.O]: 'Naught',
};

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

export const scoringMedium: PointsData = {
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

export const scoringHard: PointsData = {
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
  [EnDifficulty.Easy]: scoringHard,
  [EnDifficulty.Medium]: scoringMedium,
  [EnDifficulty.Hard]: scoringHard,
  [EnDifficulty.Impossible]: createPointsData(),
};

/** Evaluation score for MiniMax algorithm. */
export const miniMaxScoring: MiniMaxScoring = {
  max:     10000,
  win:     1000,
  draw:    0,
  inLine3: 100,
  inLine2: 10,
  inLine1: 1,
  other:   0,
};

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
