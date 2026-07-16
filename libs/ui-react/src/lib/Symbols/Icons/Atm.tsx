import createIcon from '../../Components/Icon/createIcon';

/**
 * Atm icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:Atm Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { Atm } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <Atm />
 *
 * @example
 * // With custom size and className
 * <Atm size={40} className="text-warning" />
 */
export const Atm = createIcon(
  'Atm',
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
      d='M4.665 9.176H3.331a1.334 1.334 0 0 1-1.333-1.334V3.841c0-.737.597-1.334 1.333-1.334h9.338c.736 0 1.334.597 1.334 1.334v4.001c0 .737-.598 1.334-1.334 1.334h-1.334M7 11.878h2m2.335-6.036h-6.67v7.02a.98.98 0 0 0 .983.983h4.704a.98.98 0 0 0 .983-.982zM7 8.875a1 1 0 1 1 2 0 1 1 0 0 1-2 0'
    />
  </svg>,
);
