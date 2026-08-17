import createIcon from '../Icon/createIcon';

/**
 * Merge icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:Merge Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { Merge } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <Merge />
 *
 * @example
 * // With custom size and className
 * <Merge size={40} className="text-warning" />
 */
export const Merge = createIcon(
  'Merge',
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
      d='M4.332 5.332a1.667 1.667 0 1 0 0-3.334 1.667 1.667 0 0 0 0 3.334m0 0v5.336m7.336-5.336a1.667 1.667 0 1 0 0-3.334 1.667 1.667 0 0 0 0 3.334m0 0V6a1.667 1.667 0 0 1-1.667 1.668H5.999c-.92 0-1.667.746-1.667 1.667v1.334m0 0a1.667 1.667 0 1 0 0 3.334 1.667 1.667 0 0 0 0-3.334'
    />
  </svg>,
);
