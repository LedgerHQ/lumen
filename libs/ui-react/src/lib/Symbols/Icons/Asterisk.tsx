import createIcon from '../../Components/Icon/createIcon';

/**
 * Asterisk icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/symbols-interface-icons--icon&args=name:Asterisk Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { Asterisk } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <Asterisk />
 *
 * @example
 * // With custom size and className
 * <Asterisk size={40} className="text-warning" />
 */
export const Asterisk = createIcon(
  'Asterisk',
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
      d='M2 7.99h12m-9 4.974 6-9.948m0 10L5 3.067'
    />
  </svg>,
);
