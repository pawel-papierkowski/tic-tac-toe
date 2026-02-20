import { expect } from 'vitest';

import type { LegalMove, StrikeData } from '../../code/data/types.ts';

export function assertMove(actual: LegalMove, expected: LegalMove) {
  expect(actual, `LegalMove mismatch`).toEqual(expected);
}

export function assertWinState(actualStrike: StrikeData, expectedStrike: Partial<StrikeData>) {
  expect(actualStrike.present, `Strike present mismatch`).toEqual(expectedStrike.present);
  expect(actualStrike.start, `Strike start mismatch`).toEqual(expectedStrike.start);
  expect(actualStrike.end, `Strike end mismatch`).toEqual(expectedStrike.end);
}

export function assertEvaluation(actualScore: number, expectedScore: number) {
  expect(actualScore, `Evaluated score mismatch.`).toBe(expectedScore);
}

export function assertMiniMax(actualScore: number, expectedScore: number) {
  expect(actualScore, `MiniMax score mismatch.`).toBe(expectedScore);
}
