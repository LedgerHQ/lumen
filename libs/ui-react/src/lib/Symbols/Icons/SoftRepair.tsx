import createIcon from '../../Components/Icon/createIcon';

/**
 * SoftRepair icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:SoftRepair Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { SoftRepair } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <SoftRepair />
 *
 * @example
 * // With custom size and className
 * <SoftRepair size={40} className="text-warning" />
 */
export const SoftRepair = createIcon(
  'SoftRepair',
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
      d='M2 6h12M7.333 3.997h-.006V3.99l-.007-.007m-1.653.014H5.66V3.99l-.007-.007M4 3.997h-.007V3.99l-.006-.007M14 7V4c0-1.107-.9-2-2-2H4c-1.107 0-2 .893-2 2v8a2 2 0 0 0 2 2h3.333M14 12.577c-.1.3-.273.574-.493.8a2.143 2.143 0 0 1-3.387-.5m3.753-2.037a2.14 2.14 0 0 0-2.9-.86c-.18.093-.346.22-.493.36a1.95 1.95 0 0 0-.493.8m3.068-.294h.94V9.9m-3.048 2.988H10v.94'
    />
  </svg>,
);
