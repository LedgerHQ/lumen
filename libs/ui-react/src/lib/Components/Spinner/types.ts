import { IconSize } from '../Icon/types';

export type SpinnerProps = React.SVGProps<SVGSVGElement> & {
  /**
   * The size of the spinner icon in pixels.
   * @default 16
   */
  size?: IconSize;
  ref?: React.Ref<SVGSVGElement>;
};
