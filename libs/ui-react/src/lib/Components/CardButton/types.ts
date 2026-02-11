import type { ComponentPropsWithRef, ComponentType } from 'react';
import { IconSize } from '../Icon/types';

export type CardButtonProps = {
  /**
   * The visual style of the card button.
   * @default base
   */
  appearance?: 'base' | 'outline';
  /**
   * An optional icon component to render on the left side.
   */
  icon?: ComponentType<{ size?: IconSize; className?: string }>;
  /**
   * The main title of the card button.
   * @required
   */
  title: string;
  /**
   * Optional descriptive text displayed below the title.
   */
  description?: string;
  /**
   * If true, hides the chevron arrow on the right side.
   * @default false
   */
  hideChevron?: boolean;
} & Omit<ComponentPropsWithRef<'button'>, 'children'>;
