import createIcon from '../../Components/Icon/createIcon';

/**
 * Legal icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:Legal Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { Legal } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <Legal />
 *
 * @example
 * // With custom size and className
 * <Legal size={40} className="text-warning" />
 */
export const Legal = createIcon(
  'Legal',
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
      d='M6 14H3.333C2.593 14 2 13.4 2 12.667V3.333C2 2.593 2.593 2 3.333 2h8c.734 0 1.334.593 1.334 1.333V6m-8-.667h4M4.667 8H6m2.667 6H14m-4.667 0v-3.053m2 3.053v-3.053m2 3.053v-3.053m-4.666 0H14V9.753L11.333 8.66 8.667 9.747z'
    />
  </svg>,
);
