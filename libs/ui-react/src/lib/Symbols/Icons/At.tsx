import createIcon from '../../Components/Icon/createIcon';

/**
 * At icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:At Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { At } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <At />
 *
 * @example
 * // With custom size and className
 * <At size={40} className="text-warning" />
 */
export const At = createIcon(
  'At',
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
      d='M11.333 14H8a6 6 0 1 1 6-6v1a1.666 1.666 0 1 1-3.333 0V8m0 0a2.667 2.667 0 1 0-5.334 0 2.667 2.667 0 0 0 5.334 0'
    />
  </svg>,
);
