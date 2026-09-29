import { describe, expect, it } from 'vitest';
import { mapWithConcurrency } from './concurrency.js';

const tick = (): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, 1));

describe('mapWithConcurrency', () => {
  it('keeps results in input order regardless of completion order', async () => {
    const delays = [30, 1, 15, 1];
    const results = await mapWithConcurrency(
      delays,
      4,
      async (delay, index) => {
        await new Promise((resolve) => setTimeout(resolve, delay));
        return `${index}:${delay}`;
      },
    );
    expect(results).toEqual(['0:30', '1:1', '2:15', '3:1']);
  });

  it('never runs more than `limit` calls at once', async () => {
    let inFlight = 0;
    let peak = 0;
    await mapWithConcurrency(
      Array.from({ length: 20 }, (_, i) => i),
      3,
      async () => {
        inFlight += 1;
        peak = Math.max(peak, inFlight);
        await tick();
        inFlight -= 1;
      },
    );
    expect(peak).toBe(3);
  });

  it('handles an empty list and a limit larger than the list', async () => {
    expect(await mapWithConcurrency([], 5, async (x: number) => x)).toEqual([]);
    expect(await mapWithConcurrency([1, 2], 10, async (x) => x * 2)).toEqual([
      2, 4,
    ]);
  });

  it('rejects when a call rejects', async () => {
    await expect(
      mapWithConcurrency([1, 2, 3], 2, async (x) => {
        if (x === 2) throw new Error('boom');
        return x;
      }),
    ).rejects.toThrow('boom');
  });
});
