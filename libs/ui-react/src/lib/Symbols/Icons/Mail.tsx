import createIcon from '../../Components/Icon/createIcon';

/**
 * Mail icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:Mail Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { Mail } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <Mail />
 *
 * @example
 * // With custom size and className
 * <Mail size={40} className="text-warning" />
 */
export const Mail = createIcon(
  'Mail',
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
      d='M2 4.667v6.666c0 .734.6 1.334 1.333 1.334h9.334c.733 0 1.333-.6 1.333-1.334V4.667M2 4.533c0 .4.2.734.533 1l4 2.734c.934.6 2.067.6 3 0l4-2.667c.267-.333.467-.667.467-1.067 0-.666-.533-1.2-1.2-1.2H3.2c-.667 0-1.2.534-1.2 1.2'
    />
  </svg>,
);
