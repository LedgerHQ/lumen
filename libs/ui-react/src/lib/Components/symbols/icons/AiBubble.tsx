import createIcon from '../Icon/createIcon';

/**
 * AiBubble icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:AiBubble Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { AiBubble } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <AiBubble />
 *
 * @example
 * // With custom size and className
 * <AiBubble size={40} className="text-warning" />
 */
export const AiBubble = createIcon(
  'AiBubble',
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='1em'
    height='1em'
    fill='currentColor'
    viewBox='0 0 16 16'
  >
    <g clipPath='url(#clip0_10870_31)'>
      <path
        stroke='currentColor'
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M5.328 9.168h3m.256.779-1.26-3.893h-.982l-1.26 3.893m5.643 0V6.054M.995 8.001a6.97 6.97 0 0 0 1.269 4.014l-.492 2.214 2.214-.492A7.003 7.003 0 1 0 .995 8'
      />
    </g>
    <defs>
      <clipPath id='clip0_10870_31'>
        <path fill='#fff' d='M0 0h16v16H0z' />
      </clipPath>
    </defs>
  </svg>,
);
