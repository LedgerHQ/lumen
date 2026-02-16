import { PropsWithChildren } from 'react';
import { Insets } from 'react-native';
import { StyledPressableProps } from '../../../styles';
import { IconSize } from '../Icon';

export const HIT_SLOP_MAP: Partial<
  Record<HitSlopType, Partial<Record<IconSize, Insets>>>
> = {
  comfortable: {
    12: { top: 16, bottom: 16, left: 16, right: 16 },
    16: { top: 14, bottom: 14, left: 14, right: 14 },
    20: { top: 12, bottom: 12, left: 12, right: 12 },
    24: { top: 10, bottom: 10, left: 10, right: 10 },
    32: { top: 6, bottom: 6, left: 6, right: 6 },
    40: { top: 2, bottom: 2, left: 2, right: 2 },
  },
  'compact-vertical': {
    12: { top: 14, bottom: 14, left: 10, right: 10 },
    16: { top: 12, bottom: 12, left: 8, right: 8 },
    20: { top: 10, bottom: 10, left: 6, right: 6 },
    24: { top: 8, bottom: 8, left: 4, right: 4 },
    32: { top: 4, bottom: 4, left: 0, right: 0 },
  },
  'compact-horizontal': {
    12: { top: 10, bottom: 10, left: 14, right: 14 },
    16: { top: 8, bottom: 8, left: 12, right: 12 },
    20: { top: 6, bottom: 6, left: 10, right: 10 },
    24: { top: 4, bottom: 4, left: 8, right: 8 },
    32: { top: 0, bottom: 0, left: 4, right: 4 },
  },
};

/**
 * Preset for the touchable area around the icon.
 * - `comfortable`: Increases hit area across both axes in a 1:1 ratio.
 * - `compact-horizontal`: Larger hit area on the horizontal axis.
 * - `compact-vertical`: Larger hit area on the vertical axis.
 */
export type HitSlopType =
  | 'comfortable'
  | 'compact-horizontal'
  | 'compact-vertical';

export type InteractiveIconProps = {
  /**
   * The visual style of the icon button.
   * Choose 'filled' for icons with solid backgrounds or 'stroked' for outlined icons.
   */
  iconType: 'filled' | 'stroked';
  /**
   * Preset for the touchable area. Ignored if `hitSlop` is passed explicitly.
   * Automatically applies insets based on the child's icon size.
   *
   * @default 'comfortable'
   */
  hitSlopType?: HitSlopType;
} & PropsWithChildren &
  Omit<StyledPressableProps, 'children'>;
