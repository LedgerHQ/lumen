import createIcon from '../../Components/Icon/createIcon';

/**
 * Share2 icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:Share2 Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { Share2 } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <Share2 />
 *
 * @example
 * // With custom size and className
 * <Share2 size={40} className="text-warning" />
 */
export const Share2 = createIcon(
  'Share2',
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
      d='m6.027 7.207 3.946-1.974m-3.946 3.56 3.946 1.974M5.702 6.743a1.778 1.778 0 1 1-2.515 2.514 1.778 1.778 0 0 1 2.515-2.514m7.11-3.556a1.778 1.778 0 1 1-2.514 2.515 1.778 1.778 0 0 1 2.515-2.515m0 7.111a1.778 1.778 0 1 1-2.514 2.515 1.778 1.778 0 0 1 2.515-2.515'
    />
  </svg>,
);
