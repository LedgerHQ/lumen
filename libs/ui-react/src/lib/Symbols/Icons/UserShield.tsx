import createIcon from '../../Components/Icon/createIcon';

/**
 * UserShield icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:UserShield Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { UserShield } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <UserShield />
 *
 * @example
 * // With custom size and className
 * <UserShield size={40} className="text-warning" />
 */
export const UserShield = createIcon(
  'UserShield',
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
      d='M7.562 10.667c-1.433 0-2.8.566-3.807 1.573M14 8c0-3.32-2.687-6-6-6-3.32 0-6 2.68-6 6 0 3.313 2.68 6 6 6m2-3.033v.56a2.48 2.48 0 0 0 1.62 2.34l.286.106q.081.03.173 0l.287-.113a2.51 2.51 0 0 0 1.62-2.347v-.566a.51.51 0 0 0-.353-.48l-1.5-.474a.46.46 0 0 0-.3 0l-1.5.467a.486.486 0 0 0-.354.473zM10 6.5v.333c0 1.1-.9 2-2 2-1.107 0-2-.9-2-2V6.5c0-1.107.893-2 2-2 1.1 0 2 .893 2 2'
    />
  </svg>,
);
