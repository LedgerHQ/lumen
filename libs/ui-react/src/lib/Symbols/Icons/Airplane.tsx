import createIcon from '../../Components/Icon/createIcon';

/**
 * Airplane icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:Airplane Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { Airplane } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <Airplane />
 *
 * @example
 * // With custom size and className
 * <Airplane size={40} className="text-warning" />
 */
export const Airplane = createIcon(
  'Airplane',
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='1em'
    height='1em'
    fill='currentColor'
    viewBox='0 0 16 16'
  >
    <g clipPath='url(#clip0_436_164)'>
      <path
        stroke='currentColor'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={1.3}
        d='m2 8-.666-2.667h1.2c.066 0 .2.067.266.134l1.067 1.2h3.2L4.934 1.8c-.134-.2 0-.467.266-.467h1.134c.2 0 .4.134.533.267L10.2 6.667h3.134c.733 0 1.333.6 1.333 1.333s-.6 1.333-1.333 1.333H10.2L6.867 14.4c-.133.2-.333.267-.533.267H5.2c-.266 0-.4-.267-.333-.467L7 9.333H3.8l-1.066 1.2c-.067.067-.134.134-.267.134H1.334z'
      />
    </g>
    <defs>
      <clipPath id='clip0_436_164'>
        <path fill='#fff' d='M0 0h16v16H0z' />
      </clipPath>
    </defs>
  </svg>,
);
