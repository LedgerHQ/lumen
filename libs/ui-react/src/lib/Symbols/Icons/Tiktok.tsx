import createIcon from '../../Components/Icon/createIcon';

/**
 * Tiktok icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:Tiktok Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { Tiktok } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <Tiktok />
 *
 * @example
 * // With custom size and className
 * <Tiktok size={40} className="text-warning" />
 */
export const Tiktok = createIcon(
  'Tiktok',
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='1em'
    height='1em'
    fill='currentColor'
    viewBox='0 0 16 16'
  >
    <path
      fill='currentColor'
      d='M12.208 3.806A3.36 3.36 0 0 1 10.708 1H8.344l-.004 9.646c-.04 1.08-.914 1.947-1.985 1.947-.333 0-.646-.084-.922-.232a2.03 2.03 0 0 1-1.066-1.791c0-1.116.892-2.023 1.988-2.023.205 0 .401.034.587.093V6.183a4 4 0 0 0-.587-.043C3.954 6.14 2 8.127 2 10.57a4.45 4.45 0 0 0 1.859 3.627A4.28 4.28 0 0 0 6.354 15c2.401 0 4.355-1.987 4.355-4.43V5.679A5.56 5.56 0 0 0 14 6.755V4.35c-.66 0-1.276-.2-1.792-.543'
    />
  </svg>,
);
