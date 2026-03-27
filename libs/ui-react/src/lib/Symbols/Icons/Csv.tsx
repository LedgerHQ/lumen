import createIcon from '../../Components/Icon/createIcon';

/**
 * Csv icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/symbols-interface-icons--icon&args=name:Csv Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { Csv } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <Csv />
 *
 * @example
 * // With custom size and className
 * <Csv size={40} className="text-warning" />
 */
export const Csv = createIcon(
  'Csv',
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
      d='M10.333 14h1a2 2 0 0 0 2-2V5.673a2 2 0 0 0-.585-1.414l-1.673-1.673A2 2 0 0 0 9.66 2H4.667a2 2 0 0 0-2 2v4.667m10.666-3H11a1.333 1.333 0 0 1-1.333-1.334V2M8 6v3.333m0 0L9.333 8M8 9.333 6.667 8'
    />
    <path
      fill='currentColor'
      d='M4.483 13.656a.467.467 0 0 1 .641.156q.022.034.043.044.015.01.04.01h.426a.08.08 0 0 0 .079-.078.08.08 0 0 0-.062-.078l-.728-.183a1.013 1.013 0 0 1 .247-1.994h.426c.39 0 .704.217.878.502a.467.467 0 0 1-.797.486.13.13 0 0 0-.042-.044.1.1 0 0 0-.039-.01H5.17a.079.079 0 0 0-.02.155l.73.183a1.012 1.012 0 0 1-.246 1.995h-.427c-.39 0-.705-.217-.878-.503a.467.467 0 0 1 .155-.64m4.727-2.105c.248.07.392.327.323.575l-.656 2.334a.47.47 0 0 1-.45.34H7.99a.47.47 0 0 1-.45-.34l-.656-2.334a.467.467 0 0 1 .899-.252l.425 1.514.426-1.514a.467.467 0 0 1 .576-.323M1.538 12.667v1c0 .626.508 1.133 1.134 1.133h.666a.467.467 0 0 0 0-.934h-.666a.2.2 0 0 1-.2-.2v-1c0-.11.09-.2.2-.2h.666a.467.467 0 0 0 0-.933h-.666c-.626 0-1.134.508-1.134 1.134'
    />
  </svg>,
);
