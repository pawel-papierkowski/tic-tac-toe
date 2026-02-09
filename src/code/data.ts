import { Difficulty } from "./types";

export const difficultyDescriptions: Record<Difficulty, string> = {
  [Difficulty.Easy]: 'Easy - Random moves',
  [Difficulty.Medium]: 'Medium - Sometimes strategic',
  [Difficulty.Hard]: 'Hard - Occasional mistakes',
  [Difficulty.Impossible]: 'Impossible - Perfect play'
};