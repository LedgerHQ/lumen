import { describe, expect, it } from 'vitest';
import { devVersion, renderComment } from './generateTarballs.mjs';

describe('devVersion', () => {
  it('matches the scheme the workflow published before', () => {
    expect(devVersion('0.1.27', '858', 'a2cb4f2')).toBe(
      '0.1.27-pr.858.a2cb4f2',
    );
  });

  it('keeps prerelease bases parseable by npm', () => {
    expect(devVersion('1.0.0-beta.1', '12', 'abc1234')).toBe(
      '1.0.0-beta.1-pr.12.abc1234',
    );
  });
});

describe('renderComment', () => {
  const packed = [
    {
      name: '@ledgerhq/lumen-ui-react',
      version: '0.2.0-pr.1.abc1234',
      filename: 'a.tgz',
    },
  ];

  it('keeps the marker the comment-update step greps for', () => {
    const body = renderComment({
      tag: 'dev-pr-1',
      repo: 'o/r',
      headSha: 'abc',
      packed,
    });
    expect(body.startsWith('<!-- dev-packages-comment -->')).toBe(true);
  });

  it('builds an install URL pointing at the release asset', () => {
    const body = renderComment({
      tag: 'dev-pr-1',
      repo: 'o/r',
      headSha: 'abc',
      packed,
    });
    expect(body).toContain(
      '`npm i https://github.com/o/r/releases/download/dev-pr-1/a.tgz`',
    );
  });

  it('still renders a valid table when nothing was packed', () => {
    const body = renderComment({
      tag: 'dev-pr-1',
      repo: 'o/r',
      headSha: 'abc',
      packed: [],
    });
    expect(body).toContain('|---------|---------|---------|');
    expect(body).not.toContain('undefined');
  });
});
