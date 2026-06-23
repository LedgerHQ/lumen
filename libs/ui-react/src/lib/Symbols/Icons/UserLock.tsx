import createIcon from '../../Components/Icon/createIcon';

/**
 * UserLock icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:UserLock Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { UserLock } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <UserLock />
 *
 * @example
 * // With custom size and className
 * <UserLock size={40} className="text-warning" />
 */
export const UserLock = createIcon(
  'UserLock',
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
      d='M10.38 10.947v-.954a1.333 1.333 0 1 1 2.666 0v.947M7.333 10H4.667A2.666 2.666 0 0 0 2 12.667v.666m8.38-2.381h2.667c.526 0 .952.426.952.952v1.143a.95.95 0 0 1-.952.952H10.38a.95.95 0 0 1-.952-.952v-1.143c0-.526.426-.952.952-.952M7.333 2a2.667 2.667 0 1 0 0 5.333 2.667 2.667 0 0 0 0-5.333'
    />
  </svg>,
);
