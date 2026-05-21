import { formatTime } from '../theme';

describe('theme utilities', () => {
  test('formatTime formats seconds to MM:SS', () => {
    expect(formatTime(65)).toBe('01:05');
    expect(formatTime(5)).toBe('00:05');
    expect(formatTime(125)).toBe('02:05');
  });
});
