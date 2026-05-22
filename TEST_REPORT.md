# Test Report — MemoFlip (client)

Generated: 2026-05-23

## Summary
- Scope: unit tests under `client/src/__tests__`.
- Test runner: `jest` (configured via `client/package.json`).
- Result (captured run): All tests passed.

## Environment
- OS: Windows (development machine)
- Node/npm: use the project's Node environment (run from `client` folder)
- Run command: `npm test` (from repository root: `cd client; npm test`)

## How to run tests
1. Open a terminal at the repository root.
2. Run:

```powershell
cd client
npm test
```

Jest is invoked via the `test` script in `client/package.json` (`jest --passWithNoTests`).

## Test run (captured output)

> client@1.0.0 test
> jest --passWithNoTests

PASS  src/__tests__/theme.test.ts
PASS  src/__tests__/gameStore.test.ts

Test Suites: 2 passed, 2 total
Tests:       10 passed, 10 total
Snapshots:   0 total
Time:        4.51 s
Ran all test suites.

## Tests — brief descriptions

- `src/__tests__/theme.test.ts`
  - `formatTime formats seconds to MM:SS` — verifies `formatTime` utility produces `MM:SS` strings for several inputs (5s, 65s, 125s).

- `src/__tests__/gameStore.test.ts` — unit tests for the game store actions and constants. Covered cases:
  - `initializeGame sets peek state and flips cards` — verifies initial peek behavior and that cards are flipped.
  - `finishPeek transitions to IDLE and hides cards` — verifies state transition after peek and animation flags.
  - `flipCard from IDLE flips a card and sets firstCardFlipped` — single flip behavior.
  - `flipCard second flip increments moves and processes match` — second flip increments moves and enters match processing.
  - `matchCards marks pairs and sets GAME_OVER when all matched` — matching pairs and game-over transition.
  - `resetFlippedCards unflips unmatched cards` — resets flipped-but-unmatched cards.
  - `tickTimer increments only when in active game or when a card is flipped` — timer increments only when appropriate.
  - `setGameOver sets state and stops animations` — explicit game-over action.
  - `flipAnimationLockMs constant is exported` — verifies the exported constant exists and is > 0.

## Notes & Recommendations
- Tests are fast and deterministic — suitable for CI.
- Consider adding a short `npm run test:ci` script that sets `--runInBand` or other CI-friendly flags if needed.
- Add coverage reporting (`--coverage`) if you want a coverage badge and metrics for the report.
