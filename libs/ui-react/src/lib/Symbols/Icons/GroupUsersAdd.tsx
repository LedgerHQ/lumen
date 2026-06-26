import createIcon from '../../Components/Icon/createIcon';

/**
 * GroupUsersAdd icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:GroupUsersAdd Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { GroupUsersAdd } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <GroupUsersAdd />
 *
 * @example
 * // With custom size and className
 * <GroupUsersAdd size={40} className="text-warning" />
 */
export const GroupUsersAdd = createIcon(
  'GroupUsersAdd',
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
      d='M2 14a2.33 2.33 0 0 1 2.327-2.333H7a2.326 2.326 0 0 1 2.327 2.326m1.34-2.322h1a2.326 2.326 0 0 1 2.326 2.326M11.92 3h2.829m-1.414 1.414V1.586M5.667 5.67a2 2 0 1 0 0 4 2 2 0 0 0 0-4m5 1.333a1.333 1.333 0 1 0 0 2.667 1.333 1.333 0 0 0 0-2.667'
    />
  </svg>,
);
