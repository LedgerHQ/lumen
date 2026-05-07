import createIcon from '../../Components/Icon/createIcon';

/**
 * TransferHorizontal icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/symbols-interface-icons--icon&args=name:TransferHorizontal Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { TransferHorizontal } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <TransferHorizontal />
 *
 * @example
 * // With custom size and className
 * <TransferHorizontal size={40} className="text-warning" />
 */
export const TransferHorizontal = createIcon(
  'TransferHorizontal',
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
      d='m5.333 13.333-2-2 2-2m-2 2h9.334m-2-8.666 2 2-2 2m2-2H3.333'
    />
  </svg>,
);
