import createIcon from '../../Components/Icon/createIcon';

/**
 * MoreHorizontal icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:MoreHorizontal Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { MoreHorizontal } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <MoreHorizontal />
 *
 * @example
 * // With custom size and className
 * <MoreHorizontal size={40} className="text-warning" />
 */
export const MoreHorizontal = createIcon(
  'MoreHorizontal',
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='1em'
    height='1em'
    fill='currentColor'
    viewBox='0 0 16 16'
  >
    <path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='M11.66 8a.33.33 0 0 0 .333.333c.18 0 .334-.146.334-.333a.34.34 0 0 0-.334-.333.336.336 0 0 0-.333.34M7.66 8a.33.33 0 0 0 .333.333c.18 0 .334-.146.334-.333a.34.34 0 0 0-.334-.333.336.336 0 0 0-.333.34M3.66 8a.33.33 0 0 0 .333.333c.18 0 .334-.146.334-.333a.34.34 0 0 0-.334-.333.336.336 0 0 0-.333.34'
    />
  </svg>,
);
