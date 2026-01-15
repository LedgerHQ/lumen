import createIcon from '../../Components/Icon/createIcon';

/**
 * TransferVertical icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/symbols-interface-icons--icon&args=name:TransferVertical Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { TransferVertical } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <TransferVertical />
 *
 * @example
 * // With custom size and className
 * <TransferVertical size={40} className="text-warning" />
 */
export const TransferVertical = createIcon(
  'TransferVertical',
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
      d='m6.667 5.333-2-2m0 0-2 2m2-2v9.334m4.666-2 2 2m0 0 2-2m-2 2V3.333'
    />
  </svg>,
);
