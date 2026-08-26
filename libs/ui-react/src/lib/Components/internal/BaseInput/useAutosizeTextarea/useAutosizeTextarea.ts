import { debounce } from '@ledgerhq/lumen-utils-shared';
import type { RefObject } from 'react';
import { useCallback, useLayoutEffect, useRef } from 'react';

/** MUI's own debounce default: roughly ten frames at 60fps. */
const RESIZE_DEBOUNCE_MS = 166;

const SINGLE_ROW_PROBE = 'x';

const getStyleValue = (value: string): number => parseInt(value, 10) || 0;

type MeasuredHeight = {
  height: number;
  /** Whether the content fits without scrolling. */
  fits: boolean;
};

type UseAutosizeTextareaArgs = {
  minLines: number;
  maxLines: number | undefined;
};

type UseAutosizeTextareaReturn = {
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  shadowRef: RefObject<HTMLTextAreaElement | null>;
};

/**
 * Grows a `textarea` between `minLines` and `maxLines`, measuring on an off-screen
 * clone so the visible field is never collapsed and re-grown.
 *
 * Ported from MUI's `TextareaAutosize` (MIT).
 *
 * @internal
 */
export const useAutosizeTextarea = ({
  minLines,
  maxLines,
}: UseAutosizeTextareaArgs): UseAutosizeTextareaReturn => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const shadowRef = useRef<HTMLTextAreaElement>(null);
  const heightRef = useRef<number | null>(null);
  const frameRef = useRef(-1);

  const measure = useCallback((): MeasuredHeight | undefined => {
    const textarea = textareaRef.current;
    const shadow = shadowRef.current;
    if (!textarea || !shadow) return undefined;

    const computedStyle = window.getComputedStyle(textarea);
    // A hidden ancestor (closed Dialog, inactive tab panel) collapses the field.
    if (computedStyle.width === '0px') return undefined;

    shadow.style.width = computedStyle.width;
    shadow.value = textarea.value || SINGLE_ROW_PROBE;
    // Fonts that overflow their line height report a different scrollHeight when the
    // last line is empty.
    if (shadow.value.endsWith('\n')) {
      shadow.value += ' ';
    }
    const contentHeight = shadow.scrollHeight;

    // Measuring a row beats reading `line-height`, which may be `normal` or fractional.
    shadow.value = SINGLE_ROW_PROBE;
    const singleRowHeight = shadow.scrollHeight;

    let height = Math.max(minLines * singleRowHeight, contentHeight);
    if (maxLines) {
      height = Math.min(maxLines * singleRowHeight, height);
    }
    height = Math.max(height, singleRowHeight);

    const padding =
      getStyleValue(computedStyle.paddingTop) +
      getStyleValue(computedStyle.paddingBottom);
    const border =
      getStyleValue(computedStyle.borderTopWidth) +
      getStyleValue(computedStyle.borderBottomWidth);
    const boxOffset =
      computedStyle.boxSizing === 'border-box' ? padding + border : 0;

    return {
      height: height + boxOffset,
      // A pixel of tolerance absorbs subpixel rounding.
      fits: Math.abs(height - contentHeight) <= 1,
    };
  }, [minLines, maxLines]);

  const syncHeight = useCallback((): void => {
    const textarea = textareaRef.current;
    const measured = measure();
    if (!textarea || !measured) return;

    if (heightRef.current !== measured.height) {
      heightRef.current = measured.height;
      textarea.style.height = `${measured.height}px`;
    }
    textarea.style.overflow = measured.fits ? 'hidden' : '';
  }, [measure]);

  const didHeightChange = useCallback((): boolean => {
    const measured = measure();
    return (
      measured !== undefined &&
      heightRef.current !== null &&
      heightRef.current !== measured.height
    );
  }, [measure]);

  // Deliberately no dependency array: `useBaseInputValue` re-renders on every keystroke,
  // so the value can never change without passing through here.
  useLayoutEffect(syncHeight);

  useLayoutEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Redundant with the observer below wherever `ResizeObserver` exists, since narrowing
    // the window narrows the field. Kept as the fallback, and to keep the port re-diffable.
    const handleWindowResize = debounce(syncHeight, RESIZE_DEBOUNCE_MS);
    window.addEventListener('resize', handleWindowResize);

    let observer: ResizeObserver | undefined;
    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(() => {
        if (!didHeightChange()) return;

        // Writing the height of an observed element schedules another callback; stepping
        // out for a frame avoids the undelivered-notifications loop.
        observer?.unobserve(textarea);
        cancelAnimationFrame(frameRef.current);
        syncHeight();
        frameRef.current = requestAnimationFrame(() => {
          observer?.observe(textarea);
        });
      });
      observer.observe(textarea);
    }

    return () => {
      handleWindowResize.cancel();
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('resize', handleWindowResize);
      observer?.disconnect();
    };
  }, [syncHeight, didHeightChange]);

  return { textareaRef, shadowRef };
};
