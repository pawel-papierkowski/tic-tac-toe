import { describe, it } from 'vitest';
import { ref } from 'vue';
import { assertMove } from '../utils/assertions.ts';

import { createGameState, type LegalMove } from '../../code/data/types.ts';
import { EnCellState } from '../../code/data/enums.ts';
import { resolveLegalMove } from '../../code/legalMoves.ts';

describe('Tests of legal moves.', () => {
  describe('Scoring', () => {
    it('calculates correct score for edge position', () => {
      const gameState = ref(createGameState());
      // note game state is untouched (all cells are empty)
      const who = EnCellState.O;
      const x = 1;
      const y = 0;

      const actualMove = resolveLegalMove(gameState, who, x, y, null);
      const expectedMove: LegalMove = {
        who: who,
        x: x,
        y: y, // always same
        weight: 10, // same as score
        score: 10, // basic score
        miniMax: 0,
        props: {
          win: false,
          fork: false,
          lineUp: 0,
        },
        oppProps: {
          win: false,
          fork: false,
          lineUp: 0,
        },
      };
      assertMove(actualMove, expectedMove);
    });

    it('calculates correct score for corner position', () => {
      const gameState = ref(createGameState());
      // note game state is untouched (all cells are empty)
      const who = EnCellState.X;
      const x = 2;
      const y = 2;

      const actualMove = resolveLegalMove(gameState, who, x, y, null);
      const expectedMove: LegalMove = {
        who: who,
        x: x,
        y: y, // always same
        weight: 20, // same as score
        score: 20, // score for corner cell
        miniMax: 0,
        props: {
          win: false,
          fork: false,
          lineUp: 0,
        },
        oppProps: {
          win: false,
          fork: false,
          lineUp: 0,
        },
      };
      assertMove(actualMove, expectedMove);
    });

    it('calculates correct score for center position', () => {
      const gameState = ref(createGameState());
      // note game state is untouched (all cells are empty)
      const who = EnCellState.X;
      const x = 1;
      const y = 1;

      const actualMove = resolveLegalMove(gameState, who, x, y, null);
      const expectedMove: LegalMove = {
        who: who,
        x: x,
        y: y, // always same
        weight: 50, // same as score
        score: 50, // score for center cell
        miniMax: 0,
        props: {
          win: false,
          fork: false,
          lineUp: 0,
        },
        oppProps: {
          win: false,
          fork: false,
          lineUp: 0,
        },
      };
      assertMove(actualMove, expectedMove);
    });
  });

  describe('Line up situations', () => {
    it('detects minimal lineup', () => {
      const gameState = ref(createGameState());
      gameState.value.board.cells[0]![0] = EnCellState.X;
      const who = EnCellState.X;
      const x = 0;
      const y = 2;

      const actualMove = resolveLegalMove(gameState, who, x, y, null);
      const expectedMove: LegalMove = {
        who: who,
        x: x,
        y: y, // always same
        weight: 45, // same as score
        score: 45, // lineup provides bonus to score
        miniMax: 0,
        props: {
          win: false,
          fork: false,
          lineUp: 1,
        },
        oppProps: {
          win: false,
          fork: false,
          lineUp: 0,
        },
      };
      assertMove(actualMove, expectedMove);
    });

    it('detects NO lineup', () => {
      const gameState = ref(createGameState());
      gameState.value.board.cells[0]![0] = EnCellState.X;
      gameState.value.board.cells[0]![1] = EnCellState.O; // prevents lineup from counting
      const who = EnCellState.X;
      const x = 0;
      const y = 2;

      const actualMove = resolveLegalMove(gameState, who, x, y, null);
      const expectedMove: LegalMove = {
        who: who,
        x: x,
        y: y, // always same
        weight: 20, // same as score
        score: 20, // no lineup bonus
        miniMax: 0,
        props: {
          win: false,
          fork: false,
          lineUp: 0,
        },
        oppProps: {
          win: false,
          fork: false,
          lineUp: 0,
        },
      };
      assertMove(actualMove, expectedMove);
    });
  });

  describe('Fork situations', () => {
    it('detects double lineup that is not winning move', () => {
      const gameState = ref(createGameState());
      gameState.value.board.cells[0]![2] = EnCellState.X;
      gameState.value.board.cells[2]![2] = EnCellState.X;
      const who = EnCellState.X;
      const x = 0;
      const y = 0;

      const actualMove = resolveLegalMove(gameState, who, x, y, null);
      const expectedMove: LegalMove = {
        who: who,
        x: x,
        y: y, // always same
        weight: 1070, // same as score
        score: 1070, // lineup provides bonus to score
        miniMax: 0,
        props: {
          win: false,
          fork: true,
          lineUp: 2,
        },
        oppProps: {
          win: false,
          fork: false,
          lineUp: 0,
        },
      };
      assertMove(actualMove, expectedMove);
    });

    it('detects triple lineup that is not winning move', () => {
      const gameState = ref(createGameState());
      gameState.value.board.cells[0]![2] = EnCellState.X;
      gameState.value.board.cells[2]![2] = EnCellState.X;
      gameState.value.board.cells[2]![0] = EnCellState.X;
      const who = EnCellState.X;
      const x = 0;
      const y = 0;

      const actualMove = resolveLegalMove(gameState, who, x, y, null);
      const expectedMove: LegalMove = {
        who: who,
        x: x,
        y: y, // always same
        weight: 1095, // same as score
        score: 1095, // lineup provides bonus to score
        miniMax: 0,
        props: {
          win: false,
          fork: true,
          lineUp: 3,
        },
        oppProps: {
          win: false,
          fork: false,
          lineUp: 0,
        },
      };
      assertMove(actualMove, expectedMove);
    });

    it('detects direct fork on realistic board', () => {
      const gameState = ref(createGameState());
      gameState.value.board.cells[2]![0] = EnCellState.X; // O?X
      gameState.value.board.cells[0]![0] = EnCellState.O; // ?O?
      gameState.value.board.cells[0]![2] = EnCellState.X; // X??
      gameState.value.board.cells[1]![1] = EnCellState.O;
      const who = EnCellState.X;
      const x = 2;
      const y = 2; // this move creates fork for board defined above

      const actualMove = resolveLegalMove(gameState, who, x, y, null);
      const expectedMove: LegalMove = {
        who: who,
        x: x,
        y: y, // always same
        weight: 11070, // same as score
        score: 11070, // fork provides large bonus to score
        miniMax: 0,
        props: {
          win: false,
          fork: true,
          lineUp: 2,
        },
        oppProps: {
          win: true,
          fork: false,
          lineUp: 2,
        },
      };
      assertMove(actualMove, expectedMove);
    });
  });

  describe('Win situations', () => {
    it('detects winning move: | vertical line left', () => {
      const gameState = ref(createGameState());
      gameState.value.board.cells[0]![0] = EnCellState.O;
      gameState.value.board.cells[0]![1] = EnCellState.O;
      const who = EnCellState.O;
      const x = 0;
      const y = 2;

      const actualMove = resolveLegalMove(gameState, who, x, y, null);
      const expectedMove: LegalMove = {
        who: who,
        x: x,
        y: y, // always same
        weight: 100070, // same as score
        score: 100070, // winning move has big score bonus
        miniMax: 0,
        props: {
          win: true,
          fork: false,
          lineUp: 2,
        },
        oppProps: {
          win: false,
          fork: false,
          lineUp: 0,
        },
      };
      assertMove(actualMove, expectedMove);
    });

    it('detects winning move: | vertical line middle', () => {
      const gameState = ref(createGameState());
      gameState.value.board.cells[1]![1] = EnCellState.X;
      gameState.value.board.cells[1]![2] = EnCellState.X;
      const who = EnCellState.X;
      const x = 1;
      const y = 0;

      const actualMove = resolveLegalMove(gameState, who, x, y, null);
      const expectedMove: LegalMove = {
        who: who,
        x: x,
        y: y, // always same
        weight: 100060, // same as score
        score: 100060, // winning move has big score bonus
        miniMax: 0,
        props: {
          win: true,
          fork: false,
          lineUp: 2,
        },
        oppProps: {
          win: false,
          fork: false,
          lineUp: 0,
        },
      };
      assertMove(actualMove, expectedMove);
    });

    it('detects winning move: | vertical line right', () => {
      const gameState = ref(createGameState());
      gameState.value.board.cells[2]![0] = EnCellState.X;
      gameState.value.board.cells[2]![2] = EnCellState.X;
      const who = EnCellState.X;
      const x = 2;
      const y = 1;

      const actualMove = resolveLegalMove(gameState, who, x, y, null);
      const expectedMove: LegalMove = {
        who: who,
        x: x,
        y: y, // always same
        weight: 100060, // same as score
        score: 100060, // winning move has big score bonus
        miniMax: 0,
        props: {
          win: true,
          fork: false,
          lineUp: 2,
        },
        oppProps: {
          win: false,
          fork: false,
          lineUp: 0,
        },
      };
      assertMove(actualMove, expectedMove);
    });

    it('detects winning move: - horizontal line top', () => {
      const gameState = ref(createGameState());
      gameState.value.board.cells[1]![0] = EnCellState.X;
      gameState.value.board.cells[2]![0] = EnCellState.X;
      const who = EnCellState.X;
      const x = 0;
      const y = 0;

      const actualMove = resolveLegalMove(gameState, who, x, y, null);
      const expectedMove: LegalMove = {
        who: who,
        x: x,
        y: y, // always same
        weight: 100070, // same as score
        score: 100070,
        miniMax: 0,
        props: {
          win: true,
          fork: false,
          lineUp: 2,
        },
        oppProps: {
          win: false,
          fork: false,
          lineUp: 0,
        },
      };
      assertMove(actualMove, expectedMove);
    });

    it('detects winning move: - horizontal line middle', () => {
      const gameState = ref(createGameState());
      gameState.value.board.cells[0]![1] = EnCellState.X;
      gameState.value.board.cells[2]![1] = EnCellState.X;
      const who = EnCellState.X;
      const x = 1;
      const y = 1;

      const actualMove = resolveLegalMove(gameState, who, x, y, null);
      const expectedMove: LegalMove = {
        who: who,
        x: x,
        y: y, // always same
        weight: 100100, // same as score
        score: 100100,
        miniMax: 0,
        props: {
          win: true,
          fork: false,
          lineUp: 2,
        },
        oppProps: {
          win: false,
          fork: false,
          lineUp: 0,
        },
      };
      assertMove(actualMove, expectedMove);
    });

    it('detects winning move: - horizontal line bottom', () => {
      const gameState = ref(createGameState());
      gameState.value.board.cells[0]![2] = EnCellState.O;
      gameState.value.board.cells[2]![2] = EnCellState.O;
      const who = EnCellState.O;
      const x = 1;
      const y = 2;

      const actualMove = resolveLegalMove(gameState, who, x, y, null);
      const expectedMove: LegalMove = {
        who: who,
        x: x,
        y: y, // always same
        weight: 100060, // same as score
        score: 100060,
        miniMax: 0,
        props: {
          win: true,
          fork: false,
          lineUp: 2,
        },
        oppProps: {
          win: false,
          fork: false,
          lineUp: 0,
        },
      };
      assertMove(actualMove, expectedMove);
    });

    it('detects winning move: / diagonal line', () => {
      const gameState = ref(createGameState());
      gameState.value.board.cells[0]![2] = EnCellState.O;
      gameState.value.board.cells[1]![1] = EnCellState.O;
      const who = EnCellState.O;
      const x = 2;
      const y = 0;

      const actualMove = resolveLegalMove(gameState, who, x, y, null);
      const expectedMove: LegalMove = {
        who: who,
        x: x,
        y: y, // always same
        weight: 100070, // same as score
        score: 100070,
        miniMax: 0,
        props: {
          win: true,
          fork: false,
          lineUp: 2,
        },
        oppProps: {
          win: false,
          fork: false,
          lineUp: 0,
        },
      };
      assertMove(actualMove, expectedMove);
    });

    it('detects winning move: \\ diagonal line', () => {
      const gameState = ref(createGameState());
      gameState.value.board.cells[0]![0] = EnCellState.O;
      gameState.value.board.cells[2]![2] = EnCellState.O;
      const who = EnCellState.O;
      const x = 1;
      const y = 1;

      const actualMove = resolveLegalMove(gameState, who, x, y, null);
      const expectedMove: LegalMove = {
        who: who,
        x: x,
        y: y, // always same
        weight: 100100, // same as score
        score: 100100,
        miniMax: 0,
        props: {
          win: true,
          fork: false,
          lineUp: 2,
        },
        oppProps: {
          win: false,
          fork: false,
          lineUp: 0,
        },
      };
      assertMove(actualMove, expectedMove);
    });

    it('detects NOT winning move: | vertical line', () => {
      // exactly same as "detects winning move: | vertical line", but naughts are making move
      const gameState = ref(createGameState());
      gameState.value.board.cells[0]![0] = EnCellState.X;
      gameState.value.board.cells[0]![1] = EnCellState.X;
      const who = EnCellState.O;
      const x = 0;
      const y = 2;

      const actualMove = resolveLegalMove(gameState, who, x, y, null);
      const expectedMove: LegalMove = {
        who: who,
        x: x,
        y: y, // always same
        weight: 10020, // same as score
        score: 10020, // score higher if it prevents opponent's win
        miniMax: 0,
        props: {
          win: false,
          fork: false,
          lineUp: 0,
        },
        oppProps: {
          win: true,
          fork: false,
          lineUp: 2,
        },
      };
      assertMove(actualMove, expectedMove);
    });
  });
});
