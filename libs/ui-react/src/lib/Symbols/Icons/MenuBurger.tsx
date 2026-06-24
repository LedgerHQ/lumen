import createIcon from '../../Components/Icon/createIcon';

/**
 * MenuBurger icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:MenuBurger Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { MenuBurger } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <MenuBurger />
 *
 * @example
 * // With custom size and className
 * <MenuBurger size={40} className="text-warning" />
 */
export const MenuBurger = createIcon(
  'MenuBurger',
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
      d='M3.667 8h8.666m-8.666 3.667h8.666M3.667 4.333h8.666'
    />
  </svg>,
);
