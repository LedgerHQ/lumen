import createIcon from '../../Components/Icon/createIcon';

/**
 * BasketPutIn icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/symbols-interface-icons--icon&args=name:BasketPutIn Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { BasketPutIn } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <BasketPutIn />
 *
 * @example
 * // With custom size and className
 * <BasketPutIn size={40} className="text-warning" />
 */
export const BasketPutIn = createIcon(
  'BasketPutIn',
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
      d='M5.5 12h6.667M5.5 12a1.167 1.167 0 1 0 0 2.333A1.167 1.167 0 0 0 5.5 12m6.667 0a1.167 1.167 0 1 0 0 2.333 1.167 1.167 0 0 0 0-2.333M3.762 4.667h1.571M8.667 4v3.333M10 6 8.667 7.333 7.333 6m-2 6-2-9.333H2m10 2h1.333a.667.667 0 0 1 .644.838l-1.066 4a.67.67 0 0 1-.644.495H4.905'
    />
  </svg>,
);
