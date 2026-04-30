export type TrendProps = {
  /**
   * The value to display in the trend. This value affects the appearance of the component in terms of color and icon.
   * @required
   */
  value: number;
  /**
   * The size of the trend component.
   * @default md
   */
  size?: 'sm' | 'md';
};
