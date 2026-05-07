import createIcon from '../../Components/Icon/createIcon';

/**
 * StarHalf icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/symbols-interface-icons--icon&args=name:StarHalf Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { StarHalf } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <StarHalf />
 *
 * @example
 * // With custom size and className
 * <StarHalf size={40} className="text-warning" />
 */
export const StarHalf = createIcon(
  'StarHalf',
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='1em'
    height='1em'
    fill='currentColor'
    viewBox='0 0 16 16'
  >
    <path
      fill='currentColor'
      d='M4.12 13.33 7.5 11.654l.051-8.758-1.439 2.837-4.12.52L4.92 9.25z'
    />
    <path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='m6.113 5.733 1.44-2.837-.052 8.758L4.12 13.33l.8-4.08-2.926-2.997zl1.88-3.753 1.88 3.747 4.12.513-2.927 2.987.8 4.08L8 11.49l-3.88 1.84'
    />
  </svg>,
);
