import type { ComponentPropsWithRef, ReactNode } from 'react';

export type BaseTagSharedProps = {
  /**
   * The appearance of the tag.
   * @default accent
   */
  appearance?:
    | 'base'
    | 'gray'
    | 'accent'
    | 'accent-subtle'
    | 'success'
    | 'error'
    | 'warning'
    | 'white';
  /**
   * The size of the tag.
   * @default md
   */
  size?: 'sm' | 'md';
  /**
   * Label text to display.
   * @required
   */
  label: string;
  /**
   * When `true`, prevents the user from interacting with the tag.
   *
   * @default false
   */
  disabled?: boolean;
} & ComponentPropsWithRef<'div'>;

export type BaseTagVariant = 'tag' | 'media';

export type BaseTagProps = BaseTagSharedProps & {
  variant: BaseTagVariant;
  consumerName: string;
  /**
   * Content rendered before the label (icon component, image, crypto icon, etc.).
   * Color is inherited from the tag's text color so SVGs using `currentColor`
   * will pick up the correct appearance automatically.
   */
  leadingContent?: ReactNode;
};
