import createIcon from '../../Components/Icon/createIcon';

/**
 * LockCheckSuccess icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:LockCheckSuccess Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { LockCheckSuccess } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <LockCheckSuccess />
 *
 * @example
 * // With custom size and className
 * <LockCheckSuccess size={40} className="text-warning" />
 */
export const LockCheckSuccess = createIcon(
  'LockCheckSuccess',
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
      d='m9.333 9.607-1.54 1.533-.926-.927M5.333 6.667v-2a2.666 2.666 0 1 1 5.334 0v2M11.333 14H4.667c-.74 0-1.334-.6-1.334-1.333V8c0-.74.594-1.333 1.334-1.333h6.666c.734 0 1.334.593 1.334 1.333v4.667c0 .733-.6 1.333-1.334 1.333'
    />
  </svg>,
);
