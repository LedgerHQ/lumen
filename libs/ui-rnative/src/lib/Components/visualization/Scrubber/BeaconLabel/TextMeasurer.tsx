import { useEffect, useRef } from 'react';
import { G, Text as SvgText } from 'react-native-svg';

import { safeGetBBoxWidth } from '../DefaultScrubberTooltip/utils';
import type { SvgBBoxElement } from '../types';
import { getMissingChars, saveCharWidths, type TextFont } from './utils';

const FENCE = '|';
const MAX_ATTEMPTS = 10;

type TextMeasurerProps = {
  text: string;
  font: TextFont;
};

/**
 * Measures the chars of `text` not cached yet with invisible probes, so the
 * visible text never goes through `getBBox`.
 */
export function TextMeasurer({ text, font }: Readonly<TextMeasurerProps>) {
  const missing = getMissingChars(text, font).join('');
  const refs = useRef<(SvgBBoxElement | null)[]>([]);

  useEffect(() => {
    if (!missing) {
      return;
    }
    const chars = [...missing];
    let canceled = false;
    let attempts = 0;
    let frame = 0;

    const measure = (): void => {
      attempts += 1;
      void Promise.all(
        [null, ...chars].map((_, i) =>
          safeGetBBoxWidth(refs.current[i] ?? null),
        ),
      ).then(([fence, ...widths]) => {
        if (canceled) {
          return;
        }
        if (fence > 0 && widths.every((w) => w > fence)) {
          saveCharWidths(
            font,
            Object.fromEntries(chars.map((c, i) => [c, widths[i] - fence])),
          );
        } else if (attempts < MAX_ATTEMPTS) {
          frame = requestAnimationFrame(measure);
        }
      });
    };

    frame = requestAnimationFrame(measure);
    return () => {
      canceled = true;
      cancelAnimationFrame(frame);
    };
  }, [missing, font]);

  if (!missing) {
    return null;
  }
  return (
    <G opacity={0}>
      {['', ...missing].map((char, i) => (
        <SvgText
          key={char}
          ref={(el) => {
            refs.current[i] = el as unknown as SvgBBoxElement | null;
          }}
          fontSize={font.size}
          fontFamily={font.family}
          fontWeight={font.weight}
        >
          {FENCE + char + FENCE}
        </SvgText>
      ))}
    </G>
  );
}
