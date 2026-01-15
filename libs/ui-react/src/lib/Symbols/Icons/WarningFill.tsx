import createIcon from '../../Components/Icon/createIcon';

/**
 * WarningFill icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/symbols-interface-icons--icon&args=name:WarningFill Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { WarningFill } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <WarningFill />
 *
 * @example
 * // With custom size and className
 * <WarningFill size={40} className="text-warning" />
 */
export const WarningFill = createIcon(
  'WarningFill',
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='1em'
    height='1em'
    fill='currentColor'
    viewBox='0 0 16 16'
  >
    <path
      fill='currentColor'
      fillRule='evenodd'
      d='M9.773 2.506c-.79-1.388-2.789-1.392-3.575 0v.002L1.1 11.44c-.784 1.372.206 3.08 1.787 3.08h10.212c1.576 0 2.572-1.712 1.787-3.08zM8.5 6.253a.5.5 0 1 0-1 0v2.494a.5.5 0 1 0 1 0zm-.507 3.997h-.006q-.021 0-.041.002a.665.665 0 0 0-.62.665c0 .35.285.666.667.666.197 0 .361-.088.47-.197a.67.67 0 0 0 .197-.47.67.67 0 0 0-.667-.666'
      clipRule='evenodd'
    />
  </svg>,
);
