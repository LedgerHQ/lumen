import { describe, expect, it } from 'vitest';
import type { CoverageSummary } from '../../shared/coverage.ts';
import { formatDelta, renderCoverageSection } from './coverageSection.ts';

const summary = (pct: number): CoverageSummary => ({
  lines: pct,
  statements: pct,
  functions: pct,
  branches: pct,
});

describe('formatDelta', () => {
  it('signs increases and decreases', () => {
    expect(formatDelta(92.1, 92.02)).toBe(' (+0.08)');
    expect(formatDelta(91.71, 92.02)).toBe(' (−0.31)');
  });

  // Floating-point noise from the summary should not read as a change.
  it('shows ±0 for a rounding-level difference', () => {
    expect(formatDelta(80.001, 80)).toBe(' (±0)');
  });

  it('is empty without a baseline', () => {
    expect(formatDelta(80)).toBe('');
  });
});

describe('renderCoverageSection', () => {
  const report = {
    libs: [
      { slug: 'ui-react', current: summary(92), baseline: summary(91.5) },
      { slug: 'design-core', current: summary(79), baseline: summary(79) },
      { slug: 'utils-shared', baseline: summary(85) },
      { slug: 'brand-new' },
    ],
    internals: [{ slug: 'repo-tools', current: summary(15) }],
    hasBaseline: true,
  };

  it('renders a gated row with deltas', () => {
    expect(renderCoverageSection(report, 80)).toContain(
      '| `ui-react` | 92.00% (+0.50) | 92.00% (+0.50) | 92.00% (+0.50) | 92.00% (+0.50) | ✅ |',
    );
  });

  it('fails the gate below the threshold', () => {
    expect(renderCoverageSection(report, 80)).toContain(
      '| `design-core` | 79.00% (±0) | 79.00% (±0) | 79.00% (±0) | 79.00% (±0) | ❌ |',
    );
  });

  // Not affected by the PR: keep the row, show main's numbers.
  it("shows main's numbers in italics for a lib that did not run", () => {
    expect(renderCoverageSection(report, 80)).toContain(
      '| `utils-shared` | _85.00%_ | _85.00%_ | _85.00%_ | _85.00%_ | not run |',
    );
  });

  it('shows dashes for a lib with no numbers anywhere', () => {
    expect(renderCoverageSection(report, 80)).toContain(
      '| `brand-new` | — | — | — | — | not run |',
    );
  });

  it('lists internals without a gate column', () => {
    const section = renderCoverageSection(report, 80);
    expect(section).toContain('Internals (reported, not gated)');
    expect(section).toContain(
      '| `repo-tools` | 15.00% | 15.00% | 15.00% | 15.00% |',
    );
  });

  it('explains the missing deltas when there is no baseline', () => {
    const section = renderCoverageSection(
      { ...report, hasBaseline: false },
      80,
    );
    expect(section).toContain('No coverage baseline from `main` yet');
  });
});
