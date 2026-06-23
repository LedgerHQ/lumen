import createIcon from '../../Components/Icon/createIcon';

/**
 * Note icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:Note Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { Note } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <Note />
 *
 * @example
 * // With custom size and className
 * <Note size={40} className="text-warning" />
 */
export const Note = createIcon(
  'Note',
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
      d='M4.667 8h6.666M4.667 5.333h6.666m-6.666 5.334H8M4.667 14h6.666A2.667 2.667 0 0 0 14 11.333V4.667A2.667 2.667 0 0 0 11.333 2H4.667A2.667 2.667 0 0 0 2 4.667v6.666A2.667 2.667 0 0 0 4.667 14'
    />
  </svg>,
);
