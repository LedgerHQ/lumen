import createIcon from '../../Components/Icon/createIcon';

/**
 * CoinsAddPlus icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/symbols-interface-icons--icon&args=name:CoinsAddPlus Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { CoinsAddPlus } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <CoinsAddPlus />
 *
 * @example
 * // With custom size and className
 * <CoinsAddPlus size={40} className="text-warning" />
 */
export const CoinsAddPlus = createIcon(
  'CoinsAddPlus',
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
      d='M8.667 7V5.333c0-.353-.352-.692-.977-.942S6.217 4 5.333 4s-1.732.14-2.357.39S2 4.98 2 5.334v5.334C2 11.4 3.493 12 5.333 12M2 5.333c0 .354.351.693.976.943s1.473.39 2.357.39 1.732-.14 2.357-.39.977-.589.977-.943M7.333 10c0 .733 1.487 1.333 3.334 1.333 1.84 0 3.333-.6 3.333-1.333m-6.667 0v2.667C7.333 13.4 8.82 14 10.667 14c1.84 0 3.333-.6 3.333-1.333V10m-6.667 0c0-.74 1.487-1.333 3.334-1.333C12.507 8.667 14 9.26 14 10m-2.667-6.667H14m-1.333 1.334V2M5.333 9.333C3.493 9.333 2 8.733 2 8'
    />
  </svg>,
);
