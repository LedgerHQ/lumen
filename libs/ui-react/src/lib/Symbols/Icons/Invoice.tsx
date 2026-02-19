import createIcon from '../../Components/Icon/createIcon';

/**
 * Invoice icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/symbols-interface-icons--icon&args=name:Invoice Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { Invoice } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <Invoice />
 *
 * @example
 * // With custom size and className
 * <Invoice size={40} className="text-warning" />
 */
export const Invoice = createIcon(
  'Invoice',
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
      d='M10.667 6H5.333m5.334 2H5.333m3.334 2H5.333m7.633 3.597-.66.332a.67.67 0 0 1-.595.002l-1.048-.518-1.027.516a.67.67 0 0 1-.597 0L8 13.413l-1.04.518a.67.67 0 0 1-.596-.001l-1.027-.517-1.048.519a.67.67 0 0 1-.595-.002l-.66-.332a.67.67 0 0 1-.367-.595V2.998c0-.252.142-.482.367-.595l.66-.332a.67.67 0 0 1 .595-.002l1.048.518 1.027-.516a.67.67 0 0 1 .597 0L8 2.587l1.04-.518a.67.67 0 0 1 .596.001l1.027.516 1.048-.518a.67.67 0 0 1 .595.002l.66.332a.67.67 0 0 1 .367.595v10.004a.67.67 0 0 1-.367.595'
    />
  </svg>,
);
