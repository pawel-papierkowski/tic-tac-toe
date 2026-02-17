import { EnDifficulty, EnWhoFirst, EnPlayerType, EnCellState } from "./types";

export const difficultyDescr: Record<EnDifficulty, string> = {
  [EnDifficulty.Easy]: 'Easy - Random moves',
  [EnDifficulty.Medium]: 'Medium - Sometimes strategic',
  [EnDifficulty.Hard]: 'Hard - Occasional mistakes',
  [EnDifficulty.Impossible]: 'Impossible - Perfect play'
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
