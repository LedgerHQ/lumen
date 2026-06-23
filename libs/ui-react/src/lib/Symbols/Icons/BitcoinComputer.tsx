import createIcon from '../../Components/Icon/createIcon';

/**
 * BitcoinComputer icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:BitcoinComputer Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { BitcoinComputer } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <BitcoinComputer />
 *
 * @example
 * // With custom size and className
 * <BitcoinComputer size={40} className="text-warning" />
 */
export const BitcoinComputer = createIcon(
  'BitcoinComputer',
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
      d='M9.333 11.333 9.667 14m-3-2.667L6.333 14m-.906 0h5.146M6.707 6.653V4.847h1.82a.901.901 0 1 1-.006 1.802m-.673-2.316v.514m0 4.153v-.583m4.438 2.916H3.713c-.946 0-1.72-.773-1.72-1.72V3.707c0-.947.767-1.72 1.714-1.72h8.571c.947 0 1.713.766 1.713 1.713v5.9c0 .947-.773 1.713-1.72 1.713zM8.75 8.407H6.703V6.653h2.04c.48 0 .874.387.874.874 0 .48-.394.873-.88.873z'
    />
  </svg>,
);
