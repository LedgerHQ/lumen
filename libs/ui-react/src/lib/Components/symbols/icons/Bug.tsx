import createIcon from '../Icon/createIcon';

/**
 * Bug icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:Bug Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { Bug } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <Bug />
 *
 * @example
 * // With custom size and className
 * <Bug size={40} className="text-warning" />
 */
export const Bug = createIcon(
  'Bug',
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
      d='m14 3-1 2-1.333.917M1 8h3.11m7.78 0H15M2 3l1 2 1.333.917M2 13l1-2 1.333-.917M14 13l-1-2-1.333-.917M8.444 13h-.89a3 3 0 0 1-3-3V7a2 2 0 0 1 2-2h2.89a2 2 0 0 1 2 2v3a3 3 0 0 1-3 3M10 5H6V3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1z'
    />
  </svg>,
);
