import createIcon from '../../Components/Icon/createIcon';

/**
 * Nft icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:Nft Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { Nft } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <Nft />
 *
 * @example
 * // With custom size and className
 * <Nft size={40} className="text-warning" />
 */
export const Nft = createIcon(
  'Nft',
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
      d='M4.333 9.667V6.333L6 9.667V6.333m1.667 3.334V6.333H9m2 3.334V6.333m0 0h-.667m.667 0h.667M8 8h.333m5.167 2.47V5.53c0-.437-.233-.84-.611-1.059L8.61 2.001a1.22 1.22 0 0 0-1.222 0L3.11 4.472A1.22 1.22 0 0 0 2.5 5.53v4.94c0 .436.233.84.611 1.058l4.278 2.47c.378.218.844.218 1.222 0l4.278-2.47c.378-.218.611-.621.611-1.058'
    />
  </svg>,
);
