import createIcon from '../../Components/Icon/createIcon';

/**
 * UserDelete icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:UserDelete Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { UserDelete } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <UserDelete />
 *
 * @example
 * // With custom size and className
 * <UserDelete size={40} className="text-warning" />
 */
export const UserDelete = createIcon(
  'UserDelete',
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
      strokeMiterlimit={10}
      strokeWidth={1.3}
      d='M2.667 13.333c0-1.66 1.34-3 3-3h1.722m3.098 2.847 2.36-2.36m-2.36 0 2.36 2.36M8 2.667a2.833 2.833 0 1 0 0 5.666 2.833 2.833 0 0 0 0-5.666'
    />
  </svg>,
);
