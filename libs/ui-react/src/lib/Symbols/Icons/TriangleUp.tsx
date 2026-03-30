import createIcon from '../../Components/Icon/createIcon';

/**
 * TriangleUp icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/symbols-interface-icons--icon&args=name:TriangleUp Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { TriangleUp } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <TriangleUp />
 *
 * @example
 * // With custom size and className
 * <TriangleUp size={40} className="text-warning" />
 */
export const TriangleUp = createIcon(
  'TriangleUp',
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='1em'
    height='1em'
    fill='currentColor'
    viewBox='0 0 16 16'
  >
    <path
      fill='currentColor'
      d='M13.038 11.512 8.82 4.798a1 1 0 0 0-1.696.004L2.95 11.516a1 1 0 0 0 .85 1.528h8.39a1 1 0 0 0 .848-1.532'
    />
  </svg>,
);
