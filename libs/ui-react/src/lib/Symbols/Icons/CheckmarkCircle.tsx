import createIcon from '../../Components/Icon/createIcon';

/**
 * CheckmarkCircle icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:CheckmarkCircle Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { CheckmarkCircle } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <CheckmarkCircle />
 *
 * @example
 * // With custom size and className
 * <CheckmarkCircle size={40} className="text-warning" />
 */
export const CheckmarkCircle = createIcon(
  'CheckmarkCircle',
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
      d='m5.63 8.226 1.444 1.445-.01-.01 3.26-3.259M14 8A6 6 0 1 1 2 8a6 6 0 0 1 12 0'
    />
  </svg>,
);
