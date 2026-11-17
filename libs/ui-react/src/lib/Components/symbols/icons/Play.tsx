import createIcon from '../Icon/createIcon';

/**
 * Play icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:Play Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { Play } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <Play />
 *
 * @example
 * // With custom size and className
 * <Play size={40} className="text-warning" />
 */
export const Play = createIcon(
  'Play',
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
      d='M4.116 4.279a1.063 1.063 0 0 1 1.6-.919l6.378 3.72a1.063 1.063 0 0 1 .002 1.839l-6.38 3.721a1.065 1.065 0 0 1-1.6-.919z'
    />
  </svg>,
);
