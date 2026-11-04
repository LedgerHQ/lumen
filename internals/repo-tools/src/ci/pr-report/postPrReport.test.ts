import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  REPORT_MARKER,
  assembleReport,
  readSections,
  upsertReportComment,
} from './postPrReport.ts';

describe('readSections', () => {
  it('reads every non-empty markdown file, keyed by name', () => {
    const dir = mkdtempSync(join(tmpdir(), 'pr-report-'));
    writeFileSync(join(dir, 'coverage.md'), '### Coverage\n');
    writeFileSync(join(dir, 'empty.md'), '\n');
    writeFileSync(join(dir, 'notes.txt'), 'ignored');

    expect(readSections(dir)).toEqual([
      { id: 'coverage', body: '### Coverage' },
    ]);
  });

  it('returns nothing for a missing directory', () => {
    expect(readSections('/does/not/exist')).toEqual([]);
  });
});

describe('assembleReport', () => {
  // The marker is how later runs find the comment to update.
  it('starts with the marker', () => {
    expect(assembleReport([{ id: 'coverage', body: 'x' }])).toMatch(
      new RegExp(`^${REPORT_MARKER}`),
    );
  });

  it('orders sections by id', () => {
    const report = assembleReport([
      { id: 'coverage', body: 'C' },
      { id: 'bundle-size', body: 'B' },
    ]);
    expect(report.indexOf('B')).toBeLessThan(report.indexOf('C'));
  });
});

describe('upsertReportComment', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  const respond = (status: number, json: unknown = {}): Response =>
    new Response(JSON.stringify(json), { status });

  it('updates the existing report comment in place', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        respond(200, [
          { id: 1, body: 'unrelated' },
          { id: 2, body: `${REPORT_MARKER}\nold` },
        ]),
      )
      .mockResolvedValueOnce(respond(200));
    vi.stubGlobal('fetch', fetchMock);

    await upsertReportComment('LedgerHQ/lumen', '42', 'token', 'new');

    expect(fetchMock).toHaveBeenLastCalledWith(
      'https://api.github.com/repos/LedgerHQ/lumen/issues/comments/2',
      expect.objectContaining({ method: 'PATCH', body: '{"body":"new"}' }),
    );
  });

  it('creates the comment on the first run', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(respond(200, []))
      .mockResolvedValueOnce(respond(201));
    vi.stubGlobal('fetch', fetchMock);

    await upsertReportComment('LedgerHQ/lumen', '42', 'token', 'new');

    expect(fetchMock).toHaveBeenLastCalledWith(
      'https://api.github.com/repos/LedgerHQ/lumen/issues/42/comments',
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('throws on a read-only token so the caller can fall back', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValueOnce(respond(200, []))
        .mockResolvedValueOnce(respond(403)),
    );

    await expect(
      upsertReportComment('LedgerHQ/lumen', '42', 'token', 'new'),
    ).rejects.toThrow('HTTP 403');
  });
});
