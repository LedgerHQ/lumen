import React from 'react';
import { StyledViewProps } from '../../../styles';
import { IconProps } from '../Icon';

export type SpotAppearance =
  | 'icon'
  | 'bluetooth'
  | 'check'
  | 'error'
  | 'warning'
  | 'info'
  | 'loader'
  | 'number';

type IconSpotProps = {
  /**
   * Displays a custom icon with neutral base styling.
   */
  appearance: 'icon';
  /**
   * A React component to be rendered as the icon. Required when appearance is 'icon'.
   */
  icon: React.ComponentType<IconProps>;
};

type NumberSpotProps = {
  /**
   * Displays a single digit (0-9) with number styling.
   */
  appearance: 'number';
  /**
   * A single digit from 0 to 9 to display. Required when appearance is 'number'.
   */
  number: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
};

type StatusSpotProps = {
  /**
   * Self-contained predefined status indicators with semantic styling.
   */
  appearance: Exclude<SpotAppearance, 'icon' | 'number'>;
};

export type DiscriminatedSpotProps =
  | IconSpotProps
  | NumberSpotProps
  | StatusSpotProps;

export type SpotSize = 32 | 40 | 48 | 56 | 72;

export type SpotProps = {
  /**
   * Whether the spot is disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * The size of the spot.
   * @default 48
   */
  size?: SpotSize;
} & DiscriminatedSpotProps &
  StyledViewProps;
