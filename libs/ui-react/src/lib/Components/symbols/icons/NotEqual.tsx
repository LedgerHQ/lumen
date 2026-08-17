import createIcon from '../Icon/createIcon';

/**
 * NotEqual icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:NotEqual Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { NotEqual } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <NotEqual />
 *
 * @example
 * // With custom size and className
 * <NotEqual size={40} className="text-warning" />
 */
export const NotEqual = createIcon(
  'NotEqual',
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
      strokeWidth={1.3}
      d='M3 5.5h10m-10 5h10m-8.355 2.474 6.71-9.948'
    />
  </svg>,
);
