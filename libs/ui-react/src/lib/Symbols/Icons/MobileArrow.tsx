import createIcon from '../../Components/Icon/createIcon';

/**
 * MobileArrow icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/symbols-interface-icons--icon&args=name:MobileArrow Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { MobileArrow } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <MobileArrow />
 *
 * @example
 * // With custom size and className
 * <MobileArrow size={40} className="text-warning" />
 */
export const MobileArrow = createIcon(
  'MobileArrow',
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
      d='M6.333 2v1.333c0 .18.154.334.334.334h2.666a.334.334 0 0 0 .334-.334V2M4 11.333v1.334C4 13.4 4.6 14 5.333 14h5.334c.74 0 1.333-.6 1.333-1.333V3.333C12 2.593 11.407 2 10.667 2H5.333C4.6 2 4 2.593 4 3.333v1.334M1.333 8h3.334M3.333 9.333 4.667 8 3.333 6.667'
    />
  </svg>,
);
