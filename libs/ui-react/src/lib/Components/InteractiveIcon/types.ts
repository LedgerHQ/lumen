export type InteractiveIconProps = {
  /**
   * The visual style of the icon button.
   * Choose 'filled' for icons with solid backgrounds or 'stroked' for outlined icons.
   */
  iconType: 'filled' | 'stroked';
  /**
   * The icon component to display inside the button.
   * Should be a single icon element from the design system.
   */
  children: React.ReactNode;
  /**
   * Ref to the interactive icon button element.
   */
  ref?: React.Ref<HTMLButtonElement>;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;
