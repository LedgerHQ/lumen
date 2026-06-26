import createIcon from '../../Components/Icon/createIcon';

/**
 * Desktop icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:Desktop Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { Desktop } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <Desktop />
 *
 * @example
 * // With custom size and className
 * <Desktop size={40} className="text-warning" />
 */
export const Desktop = createIcon(
  'Desktop',
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
      d='M9.333 11.333 9.667 14m-3-2.667L6.333 14M4.8 14h6.4M14 9H2m10.667 2.333H3.333C2.597 11.333 2 10.733 2 10V3.333C2 2.597 2.597 2 3.333 2h9.334C13.4 2 14 2.597 14 3.333V10c0 .733-.6 1.333-1.333 1.333'
    />
  </svg>,
);
