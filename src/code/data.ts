import { EnDifficulty, EnWhoFirst, EnPlayerType } from "./types";

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
};

export const playerTypeDescr: Record<EnPlayerType, string> = {
  [EnPlayerType.Human]: 'Human',
  [EnPlayerType.AI]: 'AI',
};
