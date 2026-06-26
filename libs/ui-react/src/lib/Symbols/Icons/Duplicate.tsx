import createIcon from '../../Components/Icon/createIcon';

/**
 * Duplicate icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:Duplicate Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { Duplicate } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <Duplicate />
 *
 * @example
 * // With custom size and className
 * <Duplicate size={40} className="text-warning" />
 */
export const Duplicate = createIcon(
  'Duplicate',
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
      d='M10 4v-.667C10 2.6 9.4 2 8.667 2H3.333C2.593 2 2 2.6 2 3.333v5.334C2 9.407 2.593 10 3.333 10H4m6-1.667v3.334M8.333 10h3.334M6 7.333v5.334C6 13.403 6.597 14 7.333 14h5.334c.736 0 1.333-.597 1.333-1.333V7.333C14 6.597 13.403 6 12.667 6H7.333C6.597 6 6 6.597 6 7.333'
    />
  </svg>,
);
