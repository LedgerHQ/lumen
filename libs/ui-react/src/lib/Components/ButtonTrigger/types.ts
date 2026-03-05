import type { ComponentPropsWithRef, ReactNode } from 'react';
import { BaseButtonProps } from '../Button/types';

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
   * An optional pre-rendered icon to display as leading content.
   * Consumer is responsible for sizing the icon (typically 20px).
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
   * The label content of the trigger button.
   */
  children: ReactNode;
} & Pick<BaseButtonProps, 'disabled' | 'className' | 'asChild'> &
  ComponentPropsWithRef<'button'>;
