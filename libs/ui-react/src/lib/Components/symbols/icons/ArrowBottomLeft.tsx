import createIcon from '../Icon/createIcon';

/**
 * ArrowBottomLeft icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:ArrowBottomLeft Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { ArrowBottomLeft } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <ArrowBottomLeft />
 *
 * @example
 * // With custom size and className
 * <ArrowBottomLeft size={40} className="text-warning" />
 */
export const ArrowBottomLeft = createIcon(
  'ArrowBottomLeft',
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
      d='m4.7 11.3 6.6-6.6m-1.885 6.6H4.7V6.585'
    />
  </svg>,
);
