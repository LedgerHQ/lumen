import { cssVar } from '@ledgerhq/lumen-design-core';

export const DEFAULT_OFFSET = 10;
export const DEFAULT_TOOLTIP_WIDTH = 120;
export const PADDING_X = 8;
export const PADDING_Y = 8;
export const ROW_HEIGHT = 16;
export const ROW_GAP = 6;
export const TITLE_GAP = 6;
export const BORDER_RADIUS = 4;
export const TOOLTIP_TRANSITION = 'opacity 0.15s ease-out 0.05s';

export const BASE_TEXT_STYLE = {
  fontSize: cssVar('var(--font-style-body-4-size)'),
  fontFamily: cssVar('var(--font-family-font)'),
} as const;
