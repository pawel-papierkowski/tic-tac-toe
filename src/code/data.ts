import { Difficulty, WhoFirst, PlayerType } from "./types";

export const difficultyDescr: Record<Difficulty, string> = {
  [Difficulty.Easy]: 'Easy - Random moves.',
  [Difficulty.Medium]: 'Medium - Sometimes strategic.',
  [Difficulty.Hard]: 'Hard - Occasional mistakes.',
  [Difficulty.Impossible]: 'Impossible - Perfect play.'
};

export const whoFirstDescr: Record<WhoFirst, string> = {
  [WhoFirst.Random]: 'Random.',
  [WhoFirst.Human]: 'Human.',
  [WhoFirst.AI]: 'AI.',
};

export const playerTypeDescr: Record<PlayerType, string> = {
  [PlayerType.Human]: 'Human',
  [PlayerType.AI]: 'AI',
};
