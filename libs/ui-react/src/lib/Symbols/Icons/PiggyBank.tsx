import createIcon from '../../Components/Icon/createIcon';

/**
 * PiggyBank icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:PiggyBank Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { PiggyBank } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <PiggyBank />
 *
 * @example
 * // With custom size and className
 * <PiggyBank size={40} className="text-warning" />
 */
export const PiggyBank = createIcon(
  'PiggyBank',
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
      d='M9.313 2.68a2.334 2.334 0 0 1 0 3.293 2.34 2.34 0 0 1-3.3 0 2.33 2.33 0 0 1 0-3.3 2.32 2.32 0 0 1 3.293 0m2.047 5.3c.007.007.007.027 0 .04a.06.06 0 0 1-.046 0 .03.03 0 0 1 0-.046c.006-.014.026-.014.04 0m-1.36-3.394c.213-.06.42-.14.613-.26.307-.2.667-.314 1.06-.314h.667v1.7a3.9 3.9 0 0 1 1.08 1.587h.58c.366 0 .666.293.666.667v2.04c0 .366-.3.666-.666.666h-.88c-.354.6-.86 1.107-1.46 1.46v1.2c0 .367-.3.667-.666.667H9.647a.664.664 0 0 1-.666-.667v-.666H6.647v.573c0 .367-.3.667-.666.667H4.647a.664.664 0 0 1-.666-.667v-1.607a3.98 3.98 0 0 1-1.334-2.98 4.005 4.005 0 0 1 2.727-3.793M1.52 6.666c-.313.18-.525.514-.525.9 0 .58.466 1.052 1.046 1.052h.616m3.01-1.951h4'
    />
  </svg>,
);
