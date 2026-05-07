import createIcon from '../../Components/Icon/createIcon';

/**
 * ExitLogout icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/symbols-interface-icons--icon&args=name:ExitLogout Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { ExitLogout } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <ExitLogout />
 *
 * @example
 * // With custom size and className
 * <ExitLogout size={40} className="text-warning" />
 */
export const ExitLogout = createIcon(
  'ExitLogout',
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
      d='M7.333 8H14m-2.333-2.333L14 8l-2.333 2.333M8 2H4c-1.107 0-2 .893-2 2v8c0 1.1.893 2 2 2h4'
    />
  </svg>,
);
