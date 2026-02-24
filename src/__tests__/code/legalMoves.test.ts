import { describe, it } from 'vitest';
import { ref } from 'vue';
import { assertMove } from '../utils/assertions.ts';

import { createGameState, type LegalMove } from '../../code/data/types.ts';
import { EnCellState, EnDifficulty } from '../../code/data/enums.ts';
import { gameConfig } from '../../code/data/data.ts';
import { resolveLegalMove } from '../../code/legalMoves.ts';
import { resolveMiniMax } from '../../code/miniMax.ts';

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
        score: 10, // basic score
        weight: 0, // on easy weight does not matter
        miniMax: null,
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
        score: 20, // score for corner cell
        weight: 0, // on easy weight does not matter
        miniMax: null,
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
        score: 50, // score for center cell
        weight: 0, // on easy weight does not matter
        miniMax: null,
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

  describe('Weights', () => {
    it('calculates correct weight for win on medium difficulty', () => {
      const gameState = ref(createGameState());
      gameState.value.settings.difficulty = EnDifficulty.Medium;
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
        score: 100070, // winning move has big score bonus
        weight: 570, // weight for medium difficulty
        miniMax: null,
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

    it('calculates correct weight for win on hard difficulty', () => {
      const gameState = ref(createGameState());
      gameState.value.settings.difficulty = EnDifficulty.Hard;
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
        score: 100070, // winning move has big score bonus
        weight: 100070, // weight for hard difficulty is same as score
        miniMax: null,
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

    it('calculates correct weight for win on impossible difficulty', () => {
      const gameState = ref(createGameState());
      gameState.value.settings.difficulty = EnDifficulty.Impossible;
      gameState.value.board.cells[0]![0] = EnCellState.O;
      gameState.value.board.cells[0]![1] = EnCellState.O;
      const who = EnCellState.O;
      const x = 0;
      const y = 2;

      const miniMaxResult = resolveMiniMax(who, gameConfig.maxDepth, gameState.value.board.cells);
      const actualMove = resolveLegalMove(gameState, who, x, y, miniMaxResult);
      const expectedMove: LegalMove = {
        who: who,
        x: x,
        y: y, // always same
        score: 1000, // same as miniMax
        weight: 1000, // same as miniMax (weight for impossible difficulty does not matter anyway)
        miniMax: 1000, // result from miniMax algorithm
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
        score: 45, // lineup provides bonus to score
        weight: 0, // on easy weight does not matter
        miniMax: null,
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
        score: 20, // no lineup bonus
        weight: 0, // on easy weight does not matter
        miniMax: null,
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
        score: 1070, // lineup provides bonus to score
        weight: 0, // on easy weight does not matter
        miniMax: null,
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
        score: 1095, // lineup provides bonus to score
        weight: 0, // on easy weight does not matter
        miniMax: null,
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
        score: 11070, // fork provides large bonus to score
        weight: 0, // on easy weight does not matter
        miniMax: null,
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
        score: 100070, // winning move has big score bonus
        weight: 0, // on easy weight does not matter
        miniMax: null,
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
        score: 100060, // winning move has big score bonus
        weight: 0, // on easy weight does not matter
        miniMax: null,
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
        score: 100060, // winning move has big score bonus
        weight: 0, // on easy weight does not matter
        miniMax: null,
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
        score: 100070,
        weight: 0, // on easy weight does not matter
        miniMax: null,
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
        score: 100100,
        weight: 0, // on easy weight does not matter
        miniMax: null,
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
        score: 100060,
        weight: 0, // on easy weight does not matter
        miniMax: null,
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
        score: 100070,
        weight: 0, // on easy weight does not matter
        miniMax: null,
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
        score: 100100,
        weight: 0, // on easy weight does not matter
        miniMax: null,
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
        score: 10020, // score higher if it prevents opponent's win
        weight: 0, // on easy weight does not matter
        miniMax: null,
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
