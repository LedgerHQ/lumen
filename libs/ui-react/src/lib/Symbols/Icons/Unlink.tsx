import createIcon from '../../Components/Icon/createIcon';

/**
 * Unlink icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/symbols-interface-icons--icon&args=name:Unlink Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { Unlink } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <Unlink />
 *
 * @example
 * // With custom size and className
 * <Unlink size={40} className="text-warning" />
 */
export const Unlink = createIcon(
  'Unlink',
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
      d='m11.403 8.36 1.458-1.458a2.75 2.75 0 0 0-3.889-3.89L7.514 4.472M5.5 10.374l1.25-1.25m2.5-2.5 1.25-1.25m2.187 7.187L3.313 3.187m1.284 4.201L3.139 8.846a2.75 2.75 0 1 0 3.889 3.89l1.458-1.459'
    />
  </svg>,
);
