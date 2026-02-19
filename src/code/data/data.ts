import { type PointsData } from './types.ts';
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
};

/** Weights matter only for Medium and Hard difficulties. */
export const weightData: Record<EnDifficulty, PointsData> = {
  [EnDifficulty.Easy]: defScoringData,
  [EnDifficulty.Medium]: {
    // only medium has weight different than score
    posBasic: 10,
    posCorner: 20,
    posCenter: 50,

    bonusLineUp: 25,
    bonusFork: 100,
    bonusPreventFork: 200,
    bonusWin: 500,
    bonusPreventLoss: 400,
  },
  [EnDifficulty.Hard]: defScoringData,
  [EnDifficulty.Impossible]: defScoringData,
};
