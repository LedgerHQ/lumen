export type IconSize = 12 | 16 | 20 | 24 | 32 | 40 | 48 | 56;

export type IconProps = {
  /**
   * The size of the icon.
   */
  size?: IconSize;
  /**
   * The class name of the icon.
   */
  className?: string;
  /**
   * The children of the icon.
   */
  children: React.ReactNode;
  /**
   * Ref to the icon SVG element.
   */
  ref?: React.Ref<SVGSVGElement>;
} & React.SVGProps<SVGSVGElement>;
