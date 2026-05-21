import { useGameStore, flipAnimationLockMs } from '../state/gameStore';

const sampleCards = [
  { id: '1', value: 'A', isFlipped: false, isMatched: false },
  { id: '2', value: 'A', isFlipped: false, isMatched: false },
  { id: '3', value: 'B', isFlipped: false, isMatched: false },
  { id: '4', value: 'B', isFlipped: false, isMatched: false },
];

describe('gameStore actions', () => {
  beforeEach(() => {
    // reset state to defaults (leave actions intact)
    useGameStore.setState({
      gameState: 'IDLE',
      isAnimating: false,
      difficulty: 'easy',
      cards: [],
      moves: 0,
      elapsedTime: 0,
      firstCardFlipped: null,
    });
  });

  test('initializeGame sets peek state and flips cards', () => {
    const actions = useGameStore.getState().actions;
    actions.initializeGame(sampleCards, 'easy');
    const s = useGameStore.getState();
    expect(s.gameState).toBe('PEEKING');
    expect(s.cards.every(c => c.isFlipped)).toBe(true);
  });

  test('finishPeek transitions to IDLE and hides cards', () => {
    const actions = useGameStore.getState().actions;
    actions.initializeGame(sampleCards, 'easy');
    actions.finishPeek();
    const s = useGameStore.getState();
    expect(s.gameState).toBe('IDLE');
    expect(s.isAnimating).toBe(true);
    expect(s.cards.every(c => c.isFlipped === false)).toBe(true);
  });

  test('flipCard from IDLE flips a card and sets firstCardFlipped', () => {
    const actions = useGameStore.getState().actions;
    actions.initializeGame(sampleCards, 'easy');
    actions.finishPeek();
    actions.unlockInput();
    actions.flipCard('1');
    const s = useGameStore.getState();
    expect(s.gameState).toBe('FLIPPED_ONE');
    expect(s.firstCardFlipped?.id).toBe('1');
    expect(s.cards.find(c => c.id === '1')?.isFlipped).toBe(true);
  });

  test('flipCard second flip increments moves and processes match', () => {
    const actions = useGameStore.getState().actions;
    actions.initializeGame(sampleCards, 'easy');
    actions.finishPeek();
    actions.unlockInput();
    actions.flipCard('1');
    actions.unlockInput();
    actions.flipCard('2');
    const s = useGameStore.getState();
    expect(s.moves).toBe(1);
    expect(s.gameState).toBe('PROCESSING_MATCH');
    expect(s.cards.find(c => c.id === '2')?.isFlipped).toBe(true);
  });

  test('matchCards marks pairs and sets GAME_OVER when all matched', () => {
    const actions = useGameStore.getState().actions;
    actions.initializeGame(sampleCards, 'easy');
    actions.finishPeek();
    // match first pair
    actions.matchCards('1', '2');
    let s = useGameStore.getState();
    expect(s.cards.find(c => c.id === '1')?.isMatched).toBe(true);
    expect(s.gameState).toBe('IDLE');

    // match second pair -> game over
    actions.matchCards('3', '4');
    s = useGameStore.getState();
    expect(s.cards.every(c => c.isMatched)).toBe(true);
    expect(s.gameState).toBe('GAME_OVER');
  });

  test('resetFlippedCards unflips unmatched cards', () => {
    // prepare state with some flipped but not matched
    useGameStore.setState({ cards: sampleCards.map(c => ({ ...c, isFlipped: true })) });
    const actions = useGameStore.getState().actions;
    actions.resetFlippedCards();
    const s = useGameStore.getState();
    expect(s.cards.every(c => c.isFlipped === false)).toBe(true);
    expect(s.gameState).toBe('IDLE');
  });

  test('tickTimer increments only when in active game or when a card is flipped', () => {
    const actions = useGameStore.getState().actions;
    // no increment when idle and no moves
    useGameStore.setState({ elapsedTime: 0, moves: 0, firstCardFlipped: null, gameState: 'IDLE' });
    actions.tickTimer();
    expect(useGameStore.getState().elapsedTime).toBe(0);

    // increment when moves > 0
    useGameStore.setState({ elapsedTime: 0, moves: 1, gameState: 'FLIPPED_ONE' });
    actions.tickTimer();
    expect(useGameStore.getState().elapsedTime).toBe(1);
  });

  test('setGameOver sets state and stops animations', () => {
    const actions = useGameStore.getState().actions;
    actions.setGameOver();
    const s = useGameStore.getState();
    expect(s.gameState).toBe('GAME_OVER');
    expect(s.isAnimating).toBe(false);
  });

  test('flipAnimationLockMs constant is exported', () => {
    expect(typeof flipAnimationLockMs).toBe('number');
    expect(flipAnimationLockMs).toBeGreaterThan(0);
  });
});
