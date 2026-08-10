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
   * An optional leading content, usually a pre-rendered icon.
   * Consumer is responsible for sizing the icon (typically 20px).
   */
  leadingContent?: ReactNode;
  /**
   * Determines the padding scheme when `leadingContent` is present.
   * - `'flat'`: Standard padding for line/interface icons.
   * - `'rounded'`: Tighter left padding for circular icons with their own background (e.g., crypto icons).
   *
   * Only relevant when `leadingContent` is provided.
   * @default 'flat'
   */
  leadingContentShape?: 'flat' | 'rounded';
  /**
   * When true, hides the trailing chevron indicator.
   * @default false
   */
  hideChevron?: boolean;
  /**
   * The label content of the media button.
   */
  children: ReactNode;
  /**
   * The native button `type`. Defaults to `'button'` so the media button does
   * not accidentally submit a surrounding `<form>`. Set `'submit'` or `'reset'`
   * to opt into form behaviour. Ignored when `asChild` is used, since the
   * rendered element (e.g. an anchor) is not a native button.
   * @default 'button'
   */
  type?: 'button' | 'submit' | 'reset';
} & Pick<BaseButtonProps, 'disabled' | 'className' | 'asChild'> &
  ComponentPropsWithRef<'button'>;
