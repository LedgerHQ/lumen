import createIcon from '../../Components/Icon/createIcon';

/**
 * ArrowRight icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/symbols-interface-icons--icon&args=name:ArrowRight Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { ArrowRight } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <ArrowRight />
 *
 * @example
 * // With custom size and className
 * <ArrowRight size={40} className="text-warning" />
 */
export const ArrowRight = createIcon(
  'ArrowRight',
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
      d='M12.667 8H3.333m6-3.333L12.667 8l-3.334 3.333'
    />
  </svg>,
);
