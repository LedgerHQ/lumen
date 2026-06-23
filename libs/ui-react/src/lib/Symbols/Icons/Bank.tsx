import createIcon from '../../Components/Icon/createIcon';

/**
 * Bank icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:Bank Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { Bank } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <Bank />
 *
 * @example
 * // With custom size and className
 * <Bank size={40} className="text-warning" />
 */
export const Bank = createIcon(
  'Bank',
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
      d='M9.762 6.667V12m2.905 0V6.667m-9.334 0V12m2.905 0V6.667m7.762 0H2V4.663L8.101 2 14 4.574zM2 14h12v-.667L13.333 12H2.667L2 13.333z'
    />
  </svg>,
);
