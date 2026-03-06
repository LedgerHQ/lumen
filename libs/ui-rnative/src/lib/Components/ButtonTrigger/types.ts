import { ReactNode } from 'react';
import { StyledPressableProps } from '../../../styles';

export type ButtonTriggerProps = {
  /**
   * The visual style of the trigger button.
   * @default 'gray'
   */
  appearance?: 'gray' | 'transparent' | 'no-background';
  /**
   * The size variant of the trigger button.
   * @default 'md'
   */
  size?: 'sm' | 'md';
  /**
   * An optional pre-rendered icon element to display as leading content.
   * Consumer is responsible for sizing the icon.
   */
  icon?: ReactNode;
  /**
   * Determines the padding scheme when an icon is present.
   * - `'flat'`: Standard padding for line/interface icons.
   * - `'rounded'`: Tighter left padding for circular icons with their own background (e.g., crypto icons).
   *
   * Only relevant when `icon` is provided.
   * @default 'flat'
   */
  iconType?: 'flat' | 'rounded';
  /**
   * Whether the trigger button is disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * The label content of the trigger button.
   */
  children: ReactNode;
} & Omit<StyledPressableProps, 'children'>;
