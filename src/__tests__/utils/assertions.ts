import { expect } from 'vitest';

import type { LegalMove, StrikeData } from '../../code/types.ts';

export function assertMove(actual: LegalMove, expected: LegalMove) {
  expect(actual.who, `Who mismatch`).toEqual(expected.who);
  expect(actual.x, `X mismatch`).toEqual(expected.x);
  expect(actual.y, `Y mismatch`).toEqual(expected.y);
  expect(actual.win, `Win mismatch`).toEqual(expected.win);
  expect(actual.preventLoss, `PreventLoss mismatch`).toEqual(expected.preventLoss);
  expect(actual.lineUp, `LineUp mismatch`).toEqual(expected.lineUp);

  expect(actual.score, `Score mismatch`).toEqual(expected.score);
  expect(actual.weight, `Weight mismatch`).toEqual(expected.weight);
}

export function assertWinState(actualStrike: StrikeData, expectedStrike: Partial<StrikeData>) {
  expect(actualStrike.present, `Strike present mismatch`).toEqual(expectedStrike.present);
  expect(actualStrike.start, `Strike start mismatch`).toEqual(expectedStrike.start);
  expect(actualStrike.end, `Strike end mismatch`).toEqual(expectedStrike.end);
}
