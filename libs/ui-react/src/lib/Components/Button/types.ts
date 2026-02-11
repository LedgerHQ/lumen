import { IconSize } from '../Icon/types';

export type BaseButtonProps = {
  /**
   * The visual style of the button.
   * @default base
   */
  appearance?:
    | 'base'
    | 'gray'
    | 'accent'
    | 'transparent'
    | 'no-background'
    | 'red';
  /**
   * The size variant of the button.
   * @default md
   */
  size?: 'xs' | 'sm' | 'md' | 'lg';
  /**
   * If true, the button expands to full width of its container.
   * @default false
   */
  isFull?: boolean;
  /**
   * Whether the button is disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * If true, shows a loading spinner instead of the icon.
   * @default false
   */
  loading?: boolean;
  /**
   * Additional custom CSS classes to apply.
   */
  className?: string;
  /**
   * Optional prop to render the button as a child element.
   * @default false
   */
  asChild?: boolean;
  /**
   * An optional icon component to render inside the button.
   */
  icon?: React.ComponentType<{ size?: IconSize; className?: string }>;
  /**
   * Optional children to render inside the button.
   */
  children?: React.ReactNode;
} & React.ComponentPropsWithRef<'button'>;

export type ButtonProps = {
  /**
   * If true, shows a loading spinner and disables the button.
   * @default false
   */
  loading?: boolean;
  /**
   * The content of the button. This is required to ensure buttons always have a label.
   * @required
   */
  children: React.ReactNode;
  /**
   * The size variant of the button.
   * @default md
   */
  size?: 'sm' | 'md' | 'lg';
} & Omit<BaseButtonProps, 'children' | 'size'>;
