import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import type { AmountInputSize } from '../types';

/** Extra width for empty input (caret + placeholder). */
const INPUT_WIDTH_PADDING_EMPTY = 33;
/** Extra width when the input has a value. */
const INPUT_WIDTH_PADDING_FILLED = 8;
/** Extra width without currency — md size (heading-0 side bearings). */
const INPUT_WIDTH_PADDING_NO_CURRENCY_MD = 24;
/** Extra width without currency — sm size (heading-2 side bearings). */
const INPUT_WIDTH_PADDING_NO_CURRENCY_SM = 16;

const NO_CURRENCY_WIDTH_PADDING_BY_SIZE = {
  md: INPUT_WIDTH_PADDING_NO_CURRENCY_MD,
  sm: INPUT_WIDTH_PADDING_NO_CURRENCY_SM,
} as const satisfies Record<AmountInputSize, number>;

const getInputWidthPadding = (
  inputValue: string,
  currencyText: string | undefined,
  size: AmountInputSize,
): number => {
  const basePadding =
    inputValue === '' ? INPUT_WIDTH_PADDING_EMPTY : INPUT_WIDTH_PADDING_FILLED;

  if (currencyText) {
    return basePadding;
  }

  return basePadding + NO_CURRENCY_WIDTH_PADDING_BY_SIZE[size];
};

type UseAutoWidthInputArgs = {
  inputValue: string;
  currencyText: string | undefined;
  size: AmountInputSize;
};

type UseAutoWidthInputReturn = {
  spanRef: React.RefObject<HTMLSpanElement | null>;
  inputRef: React.RefObject<HTMLInputElement | null>;
};

export const useAutoWidthInput = ({
  inputValue,
  currencyText,
  size,
}: UseAutoWidthInputArgs): UseAutoWidthInputReturn => {
  const spanRef = useRef<HTMLSpanElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const syncInputWidth = useCallback((): void => {
    if (!spanRef.current || !inputRef.current) return;
    const width = Math.ceil(
      Math.max(spanRef.current.scrollWidth, spanRef.current.offsetWidth),
    );
    const padding = getInputWidthPadding(inputValue, currencyText, size);
    inputRef.current.style.width = `${width + padding}px`;
  }, [inputValue, currencyText, size]);

  useLayoutEffect(syncInputWidth, [syncInputWidth]);

  // Re-sync whenever the mirror span resizes — this catches font-loading delays
  useEffect(() => {
    const span = spanRef.current;
    if (!span) return;
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(syncInputWidth);
    observer.observe(span);
    return () => observer.disconnect();
  }, [syncInputWidth]);

  return { spanRef, inputRef };
};
