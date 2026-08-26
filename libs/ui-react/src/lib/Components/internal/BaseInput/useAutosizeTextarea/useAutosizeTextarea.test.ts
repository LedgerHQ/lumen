import { renderHook } from '@testing-library/react';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { useAutosizeTextarea } from './useAutosizeTextarea';

const LINE_HEIGHT = 20;

type HookProps = {
  minLines: number;
  maxLines: number | undefined;
};

beforeAll(() => {
  global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };

  // jsdom never lays out, so scrollHeight is always 0. Deriving it from the value keeps
  // the single-row probe honest at exactly one line.
  Object.defineProperty(HTMLTextAreaElement.prototype, 'scrollHeight', {
    configurable: true,
    get(this: HTMLTextAreaElement): number {
      return this.value.split('\n').length * LINE_HEIGHT;
    },
  });
});

const setup = (initialProps: HookProps) => {
  const { result, rerender } = renderHook<
    ReturnType<typeof useAutosizeTextarea>,
    HookProps
  >((props) => useAutosizeTextarea(props), { initialProps });

  const textarea = document.createElement('textarea');
  result.current.textareaRef.current = textarea;
  result.current.shadowRef.current = document.createElement('textarea');

  return { textarea, rerender };
};

describe('useAutosizeTextarea', () => {
  it('grows the field to fit the content', () => {
    const { textarea, rerender } = setup({ minLines: 1, maxLines: undefined });

    textarea.value = 'one\ntwo\nthree';
    rerender({ minLines: 1, maxLines: undefined });

    expect(textarea.style.height).toBe('60px');
    expect(textarea.style.overflow).toBe('hidden');
  });

  it('holds the minLines floor when the content is shorter', () => {
    const { textarea, rerender } = setup({ minLines: 3, maxLines: undefined });

    textarea.value = 'one';
    rerender({ minLines: 3, maxLines: undefined });

    expect(textarea.style.height).toBe('60px');
  });

  it('stops growing at maxLines and lets the field scroll', () => {
    const { textarea, rerender } = setup({ minLines: 1, maxLines: 2 });

    textarea.value = 'one\ntwo\nthree\nfour\nfive';
    rerender({ minLines: 1, maxLines: 2 });

    expect(textarea.style.height).toBe('40px');
    expect(textarea.style.overflow).toBe('');
  });

  it('skips the style write when the measured height is unchanged', () => {
    const { textarea, rerender } = setup({ minLines: 1, maxLines: undefined });

    textarea.value = 'one\ntwo';
    rerender({ minLines: 1, maxLines: undefined });
    expect(textarea.style.height).toBe('40px');

    // Any rewrite would put the measured height back.
    textarea.style.height = '999px';
    rerender({ minLines: 1, maxLines: undefined });

    expect(textarea.style.height).toBe('999px');
  });

  it('does not measure a field collapsed by a hidden ancestor', () => {
    const { textarea, rerender } = setup({ minLines: 1, maxLines: undefined });
    const getComputedStyle = vi
      .spyOn(window, 'getComputedStyle')
      .mockReturnValue({ width: '0px' } as CSSStyleDeclaration);

    textarea.value = 'one\ntwo\nthree';
    rerender({ minLines: 1, maxLines: undefined });

    expect(textarea.style.height).toBe('');
    getComputedStyle.mockRestore();
  });
});
