import createIcon from '../Icon/createIcon';

/**
 * Range icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:Range Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { Range } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <Range />
 *
 * @example
 * // With custom size and className
 * <Range size={40} className="text-warning" />
 */
export const Range = createIcon(
  'Range',
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='1em'
    height='1em'
    fill='currentColor'
    viewBox='0 0 16 16'
  >
    <path
      fill='currentColor'
      d='m2.667 8-.46-.46-.46.46.46.459zm10.666 0 .46.459a.65.65 0 0 0 0-.92zm-3.126 2.207a.65.65 0 1 0 .92.92l-.46-.46zm.92-5.333a.65.65 0 1 0-.92.919l.46-.46zm-5.334.919a.65.65 0 0 0-.92-.92l.46.46zm-.92 5.333a.65.65 0 0 0 .92-.919l-.46.46zM2.668 8v.65h10.666v-1.3H2.667zm8 2.668.46.46 2.666-2.668-.46-.46-.46-.46-2.666 2.668zm2.666-2.668.46-.46-2.667-2.665-.46.46-.459.459 2.667 2.666zm-8-2.666-.46-.46L2.208 7.54l.46.46.46.459 2.666-2.666zM2.667 8l-.46.46 2.667 2.667.46-.46.459-.459L3.126 7.54z'
    />
  </svg>,
);
