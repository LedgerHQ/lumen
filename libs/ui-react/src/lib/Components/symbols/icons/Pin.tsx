import createIcon from '../Icon/createIcon';

/**
 * Pin icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:Pin Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { Pin } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <Pin />
 *
 * @example
 * // With custom size and className
 * <Pin size={40} className="text-warning" />
 */
export const Pin = createIcon(
  'Pin',
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
      d='M8 13.333V10m-3.34 0h6.68a.66.66 0 0 0 .383-1.197l-2.056-1.47v-2l1.703-1.135a.67.67 0 0 0 .297-.555v-.31A.667.667 0 0 0 11 2.667H5a.667.667 0 0 0-.667.666v.31c0 .223.112.432.297.555l1.703 1.135v2l-2.056 1.47A.66.66 0 0 0 4.66 10'
    />
  </svg>,
);
