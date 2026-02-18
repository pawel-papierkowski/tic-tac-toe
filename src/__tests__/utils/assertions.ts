import { expect } from 'vitest';

import type { LegalMove, MoveProps, StrikeData } from '../../code/data/types.ts';

export function assertMove(actual: LegalMove, expected: LegalMove) {
  expect(actual.who, `Who mismatch`).toEqual(expected.who);
  expect(actual.x, `X mismatch`).toEqual(expected.x);
  expect(actual.y, `Y mismatch`).toEqual(expected.y);
  expect(actual.weight, `Weight mismatch`).toEqual(expected.weight);
  expect(actual.score, `Score mismatch`).toEqual(expected.score);

  assertMoveProps('Your move props', actual.props, expected.props);
  assertMoveProps('Opponent move props', actual.oppProps, expected.oppProps);
}

function assertMoveProps(comment: string, actual: MoveProps, expected: MoveProps) {
  expect(actual.win, `${comment}: Win mismatch`).toEqual(expected.win);
  expect(actual.lineUp, `${comment}: LineUp mismatch`).toEqual(expected.lineUp);
  expect(actual.fork, `${comment}: Fork mismatch`).toEqual(expected.fork);
}

export function assertWinState(actualStrike: StrikeData, expectedStrike: Partial<StrikeData>) {
  expect(actualStrike.present, `Strike present mismatch`).toEqual(expectedStrike.present);
  expect(actualStrike.start, `Strike start mismatch`).toEqual(expectedStrike.start);
  expect(actualStrike.end, `Strike end mismatch`).toEqual(expectedStrike.end);
}
