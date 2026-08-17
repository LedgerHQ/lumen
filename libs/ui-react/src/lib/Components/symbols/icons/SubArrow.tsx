import createIcon from '../Icon/createIcon';

/**
 * SubArrow icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:SubArrow Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { SubArrow } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <SubArrow />
 *
 * @example
 * // With custom size and className
 * <SubArrow size={40} className="text-warning" />
 */
export const SubArrow = createIcon(
  'SubArrow',
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
      d='M13.317 10.016H5.984c-1.833 0-3.333-1.465-3.333-3.257v.02-3.43m7.968 9.366 2.698-2.699-2.698-2.699'
    />
  </svg>,
);
