import createIcon from '../../Components/Icon/createIcon';

/**
 * FilterSort icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:FilterSort Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { FilterSort } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <FilterSort />
 *
 * @example
 * // With custom size and className
 * <FilterSort size={40} className="text-warning" />
 */
export const FilterSort = createIcon(
  'FilterSort',
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
      d='m9.667 9 3.471-3.471a.67.67 0 0 0 .195-.472V3.333a.667.667 0 0 0-.666-.666H3.333a.667.667 0 0 0-.666.666v1.724c0 .177.07.347.195.472L6.333 9M6.333 9v4.166c0 .542.51.94 1.036.809l1.666-.417a.834.834 0 0 0 .632-.809V9'
      clipRule='evenodd'
    />
  </svg>,
);
