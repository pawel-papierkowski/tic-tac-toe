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

//

export function assertMiniMax(actualScore: number, expectedScore: number) {
  expect(actualScore, `MiniMax score mismatch.`).toBe(expectedScore);
}

export function verifyMiniMaxForBoard(board: EnCellState[][], who: EnCellState, maxDepth: number, expectedResult: MiniMaxResult) {
  const actualResult = resolveMiniMax(who, maxDepth, board);
  expect(actualResult, `MiniMax result mismatch`).toEqual(expectedResult);
}

//

export function assertEvaluation(actualScore: number, expectedScore: number) {
  expect(actualScore, `Evaluated score mismatch.`).toBe(expectedScore);
}

/**
 * Checks if evaluation for given board state and marks gives expected score.
 * Also verifies that if player perspectives are swapped, score should flip sign.
 * @param board Board state.
 * @param whoYou Who is you.
 * @param whoOpponent Who is opponent.
 * @param expectedScore Expected score.
 */
export function verifyEvaluation(board: EnCellState[][], whoYou: EnCellState, whoOpponent: EnCellState, expectedScore: number) {
  const actualScore1 = evaluate(whoYou, whoOpponent, board);
  expect(actualScore1, `Evaluated score mismatch.`).toBe(expectedScore);

  const actualScore2 = evaluate(whoOpponent, whoYou, board); // perspective inversion
  if (actualScore1 === 0) expect(actualScore1).toBe(actualScore2);
  else expect(actualScore1).toBe(-actualScore2);
}

export function verifySameEvaluation(board1: EnCellState[][], board2: EnCellState[][]) {
  const score1 = evaluate(EnCellState.X, EnCellState.O, board1);
  const score2 = evaluate(EnCellState.X, EnCellState.O, board2);
  expect(score1).toBe(score2);
}
