import createIcon from '../../Components/Icon/createIcon';

/**
 * Heart icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:Heart Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { Heart } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <Heart />
 *
 * @example
 * // With custom size and className
 * <Heart size={40} className="text-warning" />
 */
export const Heart = createIcon(
  'Heart',
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
      d='M10.467 2.667C12.58 2.667 14 4.653 14 6.507c0 3.753-5.893 6.826-6 6.826S2 10.26 2 6.507c0-1.854 1.42-3.84 3.533-3.84 1.214 0 2.007.606 2.467 1.14.46-.534 1.253-1.14 2.467-1.14'
    />
  </svg>,
);
