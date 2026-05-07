import createIcon from '../../Components/Icon/createIcon';

/**
 * Clip icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/symbols-interface-icons--icon&args=name:Clip Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { Clip } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <Clip />
 *
 * @example
 * // With custom size and className
 * <Clip size={40} className="text-warning" />
 */
export const Clip = createIcon(
  'Clip',
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
      d='M8.967 6.253 5.28 9.94a1.083 1.083 0 0 0 0 1.547h-.007c.427.427 1.12.427 1.547 0l5.747-5.75a2.197 2.197 0 0 0 0-3.1l-.007-.007a2.19 2.19 0 0 0-3.1-.007h-.007L3.7 8.369a3.277 3.277 0 0 0-.007 4.639 3.283 3.283 0 0 0 4.64 0v-.007l4.2-4.2'
    />
  </svg>,
);
