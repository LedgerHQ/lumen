import type { ComponentPropsWithRef, ReactNode } from 'react';
import type { BaseButtonProps } from '../Button/types';

export type MediaButtonProps = {
  /**
   * The visual style of the media button.
   * @default 'gray'
   */
  appearance?: 'gray' | 'transparent' | 'no-background';
  /**
   * The size variant of the media button.
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
   * When true, hides the trailing chevron indicator.
   * @default false
   */
  hideChevron?: boolean;
  /**
   * The label content of the media button.
   */
  children: ReactNode;
} & Pick<BaseButtonProps, 'disabled' | 'className' | 'asChild'> &
  ComponentPropsWithRef<'button'>;
