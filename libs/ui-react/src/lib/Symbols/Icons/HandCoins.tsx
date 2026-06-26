import createIcon from '../../Components/Icon/createIcon';

/**
 * HandCoins icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:HandCoins Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { HandCoins } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <HandCoins />
 *
 * @example
 * // With custom size and className
 * <HandCoins size={40} className="text-warning" />
 */
export const HandCoins = createIcon(
  'HandCoins',
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
      d='M4.647 13.307h1.006c.214 0 .434.026.647.08l1.767.446c.386.1.78.107 1.173.034l1.953-.387c.52-.107.994-.36 1.367-.727l1.387-1.38a1.01 1.01 0 0 0-1.32-1.52l-1.607 1.214a1.34 1.34 0 0 1-.8.266H8.667h.986c.554 0 1.007-.453 1.007-1.013v-.207c0-.466-.32-.873-.767-.98l-1.528-.386a3.152 3.152 0 0 0-2.5.427l-1.213.806m6.788-6.547a1.9 1.9 0 0 1 0 2.674c-.74.733-1.94.733-2.68 0-.74-.74-.74-1.94 0-2.68a1.887 1.887 0 0 1 2.673 0m-1.68-.51c-.066-.38-.24-.74-.526-1.034A1.892 1.892 0 0 0 6.55 4.557c.46.46 1.094.626 1.687.52M4 14H2.667A.67.67 0 0 1 2 13.333v-4a.66.66 0 0 1 .667-.666H4c.367 0 .667.293.667.666v4c0 .367-.3.667-.667.667'
    />
  </svg>,
);
