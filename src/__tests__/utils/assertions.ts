import { expect } from 'vitest';

import { EnCellState } from '../../code/data/enums.ts';
import type { LegalMove, StrikeData, MiniMaxResult } from '../../code/data/types.ts';
import { resolveMiniMax, evaluate } from '../../code/miniMax.ts';

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

export function verifyEvaluation(board: EnCellState[][], whoYou: EnCellState, whoOpponent: EnCellState, expectedScore: number) {
  const actualScore = evaluate(whoYou, whoOpponent, board);
  expect(actualScore, `Evaluated score mismatch.`).toBe(expectedScore);
}

export function assertMiniMax(actualScore: number, expectedScore: number) {
  expect(actualScore, `MiniMax score mismatch.`).toBe(expectedScore);
}

export function verifyMiniMaxForBoard(board: EnCellState[][], who: EnCellState, maxDepth: number, expectedResult: MiniMaxResult) {
  const actualResult = resolveMiniMax(who, maxDepth, board);
  expect(actualResult, `MiniMax result mismatch`).toEqual(expectedResult);
}
