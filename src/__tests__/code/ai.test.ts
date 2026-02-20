import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { assertMove, assertWinState } from '../utils/assertions.ts';

import type { StrikeData, LegalMove } from '../../code/data/types.ts';
import { createGameState, createLegalMove } from '../../code/data/types.ts';
import { EnDifficulty, EnCellState } from '../../code/data/enums.ts';
import { resolveAllLegalMoves, resolveLegalMove } from '../../code/legalMoves.ts';
import { checkWinState, moveAiDifficulty, executeMove } from '../../code/ai.ts';

import { createGameStateForAI, createGameStateForHuman } from '../utils/prepare.ts';

describe('Tests of AI.', () => {
  describe('Win states', () => {
    it('detect top horizontal line', () => {
      const gameState = ref(createGameState());
      gameState.value.board.cells[0]![0] = EnCellState.X;
      gameState.value.board.cells[1]![0] = EnCellState.X;
      gameState.value.board.cells[2]![0] = EnCellState.X;
      const actualResult = checkWinState(gameState);

      const expectedStrike: Partial<StrikeData> = {
        present: true,
        start: { x: 0, y: 0 },
        end: { x: 2, y: 0 },
      };
      expect(actualResult, `Win state mismatch.`).toBe(true);
      assertWinState(gameState.value.board.strike, expectedStrike);
    });

    it('detect left vertical line', () => {
      const gameState = ref(createGameState());
      gameState.value.board.cells[0]![0] = EnCellState.O;
      gameState.value.board.cells[0]![1] = EnCellState.O;
      gameState.value.board.cells[0]![2] = EnCellState.O;
      const actualResult = checkWinState(gameState);

      const expectedStrike: Partial<StrikeData> = {
        present: true,
        start: { x: 0, y: 0 },
        end: { x: 0, y: 2 },
      };
      expect(actualResult, `Win state mismatch.`).toBe(true);
      assertWinState(gameState.value.board.strike, expectedStrike);
    });

    it('detect forward cross line', () => {
      const gameState = ref(createGameState());
      gameState.value.board.cells[0]![0] = EnCellState.X;
      gameState.value.board.cells[1]![1] = EnCellState.X;
      gameState.value.board.cells[2]![2] = EnCellState.X;
      const actualResult = checkWinState(gameState);

      const expectedStrike: Partial<StrikeData> = {
        present: true,
        start: { x: 0, y: 0 },
        end: { x: 2, y: 2 },
      };
      expect(actualResult, `Win state mismatch.`).toBe(true);
      assertWinState(gameState.value.board.strike, expectedStrike);
    });

    it('detect vertical middle line', () => {
      const gameState = ref(createGameState());
      gameState.value.board.cells[1]![0] = EnCellState.X;
      gameState.value.board.cells[1]![1] = EnCellState.X;
      gameState.value.board.cells[1]![2] = EnCellState.X;
      const actualResult = checkWinState(gameState);

      const expectedStrike: Partial<StrikeData> = {
        present: true,
        start: { x: 1, y: 0 },
        end: { x: 1, y: 2 },
      };
      expect(actualResult, `Win state mismatch.`).toBe(true);
      assertWinState(gameState.value.board.strike, expectedStrike);
    });

    it('detect horizontal middle line', () => {
      const gameState = ref(createGameState());
      gameState.value.board.cells[0]![1] = EnCellState.O;
      gameState.value.board.cells[1]![1] = EnCellState.O;
      gameState.value.board.cells[2]![1] = EnCellState.O;
      const actualResult = checkWinState(gameState);

      const expectedStrike: Partial<StrikeData> = {
        present: true,
        start: { x: 0, y: 1 },
        end: { x: 2, y: 1 },
      };
      expect(actualResult, `Win state mismatch.`).toBe(true);
      assertWinState(gameState.value.board.strike, expectedStrike);
    });

    it('detect backward cross line', () => {
      const gameState = ref(createGameState());
      gameState.value.board.cells[2]![0] = EnCellState.X;
      gameState.value.board.cells[1]![1] = EnCellState.X;
      gameState.value.board.cells[0]![2] = EnCellState.X;
      const actualResult = checkWinState(gameState);

      const expectedStrike: Partial<StrikeData> = {
        present: true,
        start: { x: 2, y: 0 },
        end: { x: 0, y: 2 },
      };
      expect(actualResult, `Win state mismatch.`).toBe(true);
      assertWinState(gameState.value.board.strike, expectedStrike);
    });

    it('detect bottom horizontal line', () => {
      const gameState = ref(createGameState());
      gameState.value.board.cells[0]![2] = EnCellState.X;
      gameState.value.board.cells[1]![2] = EnCellState.X;
      gameState.value.board.cells[2]![2] = EnCellState.X;
      const actualResult = checkWinState(gameState);

      const expectedStrike: Partial<StrikeData> = {
        present: true,
        start: { x: 2, y: 2 },
        end: { x: 0, y: 2 },
      };
      expect(actualResult, `Win state mismatch.`).toBe(true);
      assertWinState(gameState.value.board.strike, expectedStrike);
    });

    it('detect right vertical line', () => {
      const gameState = ref(createGameState());
      gameState.value.board.cells[2]![0] = EnCellState.O;
      gameState.value.board.cells[2]![1] = EnCellState.O;
      gameState.value.board.cells[2]![2] = EnCellState.O;
      const actualResult = checkWinState(gameState);

      const expectedStrike: Partial<StrikeData> = {
        present: true,
        start: { x: 2, y: 2 },
        end: { x: 2, y: 0 },
      };
      expect(actualResult, `Win state mismatch.`).toBe(true);
      assertWinState(gameState.value.board.strike, expectedStrike);
    });
  });

  describe('Difficulty levels', () => {
    it('medium has different weight compared to score', () => {
      const gameState = ref(createGameState());
      gameState.value.settings.difficulty = EnDifficulty.Medium;
      gameState.value.board.cells[0]![0] = EnCellState.X;
      gameState.value.board.cells[0]![1] = EnCellState.X;
      const who = EnCellState.X;
      const x = 0;
      const y = 2;

      const actualMove = resolveLegalMove(gameState, who, x, y, null);
      const expectedMove: LegalMove = {
        who: who,
        x: x,
        y: y, // always same
        score: 100070, // winning move has big score bonus
        weight: 570, // medium has different value compared to score
        miniMax: 0,
        props: {
          win: true,
          lineUp: 2,
          fork: false,
        },
        oppProps: {
          win: false,
          lineUp: 0,
          fork: false,
        },
      };
      assertMove(actualMove, expectedMove);
    });

    it('impossible always picks highest score', () => {
      const gameState = ref(createGameStateForAI());
      const legalMoves = resolveAllLegalMoves(gameState, EnCellState.X);
      // Empty board and AI starts game, so all cells are available as moves.
      expect(legalMoves.length, `Mismatch of amount of available moves.`).toBe(9);

      const actualMove: LegalMove = moveAiDifficulty(gameState, legalMoves);
      // If AI starts game, best score is middle of board. On impossible it will always pick that cell.
      // I know, boring.
      const expectedMove: LegalMove = {
        who: EnCellState.X,
        x: 1,
        y: 1,
        score: 11,
        weight: 11,
        miniMax: 11,
        props: {
          win: false,
          lineUp: 0,
          fork: false,
        },
        oppProps: {
          win: false,
          lineUp: 0,
          fork: false,
        },
      };
      assertMove(actualMove, expectedMove);
    });

    it('impossible plays correct move when human starts first on non-center cell', () => {
      const gameState = ref(createGameStateForHuman());
      // now manually make move as human...
      const humanMove = createLegalMove(EnCellState.X, 0, 0); // first player is X
      executeMove(gameState, humanMove);

      // now AI is current player
      const legalMoves = resolveAllLegalMoves(gameState, EnCellState.O); // second player is O
      // Board with one human move and AI is second, so 8 cells are available as moves.
      expect(legalMoves.length, `Mismatch of amount of available moves.`).toBe(8);

      const actualMove: LegalMove = moveAiDifficulty(gameState, legalMoves);
      const expectedMove: LegalMove = {
        who: EnCellState.O,
        x: 1,
        y: 1,
        score: 23,
        weight: 23,
        miniMax: 23,
        props: {
          win: false,
          lineUp: 0,
          fork: false,
        },
        oppProps: {
          win: false,
          lineUp: 1,
          fork: false,
        },
      };
      assertMove(actualMove, expectedMove);
    });

    // TODO: test sequence of moves that currently leads to human win on impossible difficulty
  });
});
