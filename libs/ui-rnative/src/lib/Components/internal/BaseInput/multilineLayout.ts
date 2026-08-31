import type { LumenStyleSheetTheme } from '../../../../styles';

type MultilineLayout = {
  lineHeight: number;
  labelRowHeight: number;
  paddingVertical: number;
};

type MultilineMinHeightArgs = {
  hasLabel: boolean;
  minLines: number;
  maxLines: number | undefined;
};

/**
 * Vertical layout values a multiline `BaseInput` is laid out from. A label floats
 * over the field and shrinks its text to `body2`, which moves all three.
 *
 * @internal
 */
export const getMultilineLayout = (
  t: LumenStyleSheetTheme,
  hasLabel: boolean,
): MultilineLayout => ({
  lineHeight: hasLabel
    ? t.typographies.body2.lineHeight
    : t.typographies.body1.lineHeight,
  labelRowHeight: hasLabel ? t.spacings.s16 : 0,
  paddingVertical: hasLabel ? t.spacings.s6 : t.spacings.s12,
});

/**
 * Height floor of a multiline `BaseInput`: `minLines` of text — never more than
 * `maxLines` — plus the label row and the vertical padding.
 *
 * @internal
 */
export const getMultilineMinHeight = (
  t: LumenStyleSheetTheme,
  { hasLabel, minLines, maxLines }: MultilineMinHeightArgs,
): number => {
  const { lineHeight, labelRowHeight, paddingVertical } = getMultilineLayout(
    t,
    hasLabel,
  );
  const floorLines = maxLines ? Math.min(minLines, maxLines) : minLines;

  return floorLines * lineHeight + labelRowHeight + 2 * paddingVertical;
};
