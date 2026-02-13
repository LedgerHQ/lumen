import type { ComponentType, HTMLAttributes } from 'react';
import { IconSize } from '../Icon/types';

export type SpotAppearance =
  | 'icon'
  | 'bluetooth'
  | 'check'
  | 'error'
  | 'warning'
  | 'info'
  | 'loader'
  | 'number';

type SpotIconProps = {
  /**
   * Custom icon appearance with neutral base styling.
   * @example <Spot appearance="icon" icon={SettingsIcon} />
   */
  appearance: 'icon';
  /**
   * Icon component to render. Required when appearance is 'icon'.
   */
  icon: ComponentType<{ size?: IconSize; className?: string }>;
};

type SpotNumberProps = {
  /**
   * Number appearance for displaying a single digit (0-9).
   * @example <Spot appearance="number" number={5} />
   */
  appearance: 'number';
  /**
   * Digit (0-9) to display. Required when appearance is 'number'.
   */
  number: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
};

type SpotStatusProps = {
  /**
   * Predefined status indicators with semantic styling.
   * Options: 'bluetooth' | 'check' | 'error' | 'warning' | 'info' | 'loader'
   * @example <Spot appearance="check" />
   */
  appearance: Exclude<SpotAppearance, 'icon' | 'number'>;
};
/**
 * A discriminated union that enforces type-safe props based on the `appearance`.
 */
export type DiscriminatedSpotProps =
  | SpotIconProps
  | SpotNumberProps
  | SpotStatusProps;

export type SpotSize = 32 | 40 | 48 | 56 | 72;

export type SpotProps = DiscriminatedSpotProps & {
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
} & HTMLAttributes<HTMLDivElement>;
