import createIcon from '../../Components/Icon/createIcon';

/**
 * AutoLock icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:AutoLock Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { AutoLock } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <AutoLock />
 *
 * @example
 * // With custom size and className
 * <AutoLock size={40} className="text-warning" />
 */
export const AutoLock = createIcon(
  'AutoLock',
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
      d='M8.26 4.667V8.26H5.327m8.633-.927a6.01 6.01 0 0 0-6.633-5.3 5.996 5.996 0 0 0-.007 11.92M11.5 12h2.334M11.5 12a.833.833 0 0 0-.833.833v1c0 .46.373.834.833.834h2.334c.46 0 .833-.373.833-.834v-1a.833.833 0 0 0-.833-.833M11.5 12v-.833a1.168 1.168 0 0 1 2.333 0V12'
    />
  </svg>,
);
