import { describe, expect, it } from 'vitest';
import { prefixSourceFiles } from './fixLcovPaths.mjs';

describe('prefixSourceFiles', () => {
  it('makes project-relative records root-relative', () => {
    const lcov = 'TN:\nSF:src/lib/cn.ts\nDA:1,1\nend_of_record\n';
    expect(prefixSourceFiles(lcov, 'libs/utils-shared')).toBe(
      'TN:\nSF:libs/utils-shared/src/lib/cn.ts\nDA:1,1\nend_of_record\n',
    );
  });

  it('rewrites every record, not just the first', () => {
    const lcov = 'SF:src/a.ts\nend_of_record\nSF:src/b.ts\nend_of_record\n';
    const out = prefixSourceFiles(lcov, 'libs/ui-react');
    expect(out).toContain('SF:libs/ui-react/src/a.ts');
    expect(out).toContain('SF:libs/ui-react/src/b.ts');
  });

  // The workflow step is not guarded, so a re-run must not double-prefix.
  it('is idempotent', () => {
    const once = prefixSourceFiles('SF:src/a.ts\n', 'libs/ui-react');
    expect(prefixSourceFiles(once, 'libs/ui-react')).toBe(once);
  });

  it('leaves already-absolute paths alone', () => {
    const lcov = 'SF:/abs/src/a.ts\nSF:C:/win/src/b.ts\n';
    expect(prefixSourceFiles(lcov, 'libs/ui-react')).toBe(lcov);
  });

  it('touches nothing but SF records', () => {
    const lcov = 'TN:\nFN:12,foo\nDA:1,1\nBRF:0\nend_of_record\n';
    expect(prefixSourceFiles(lcov, 'libs/ui-react')).toBe(lcov);
  });
});
