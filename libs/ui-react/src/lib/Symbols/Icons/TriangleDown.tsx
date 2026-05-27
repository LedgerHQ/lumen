import createIcon from '../../Components/Icon/createIcon';

/**
 * TriangleDown icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/symbols-interface-icons--icon&args=name:TriangleDown Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { TriangleDown } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <TriangleDown />
 *
 * @example
 * // With custom size and className
 * <TriangleDown size={40} className="text-warning" />
 */
export const TriangleDown = createIcon(
  'TriangleDown',
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='1em'
    height='1em'
    fill='currentColor'
    viewBox='0 0 16 16'
  >
    <path
      fill='currentColor'
      d='M13.038 5.347 8.82 12.06a1 1 0 0 1-1.696-.004L2.95 5.343a1 1 0 0 1 .85-1.528h8.39a1 1 0 0 1 .848 1.532'
    />
  </svg>,
);
