import { IconSize } from '../Icon/types';

export type LinkProps = {
  /**
   * The visual style of the link.
   * @default inherit
   */
  appearance?: 'base' | 'accent' | 'inherit';
  /**
   * The size variant of the link.
   * @default inherit
   */
  size?: 'sm' | 'md' | 'inherit';
  /**
   * Whether to underline the link text.
   * @default true
   */
  underline?: boolean;
  /**
   * An optional icon component to render inside the link.
   * The icon styles are defined by the link. Please do not override them.
   */
  icon?: React.ComponentType<{ size?: IconSize; className?: string }>;
  /**
   * If true, adds target="_blank" and rel="noopener noreferrer" for external links.
   * @default false
   */
  isExternal?: boolean;
  /**
   * If true, renders the child element directly with link styles instead of wrapping in an anchor element.
   * Useful for creating router links or other semantic elements with link appearance.
   * @default false
   */
  asChild?: boolean;
  /**
   * The link's content, typically text.
   */
  children: React.ReactNode;
} & React.ComponentPropsWithRef<'a'>;
