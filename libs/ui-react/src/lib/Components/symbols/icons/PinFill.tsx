import createIcon from '../Icon/createIcon';

/**
 * PinFill icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:PinFill Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { PinFill } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <PinFill />
 *
 * @example
 * // With custom size and className
 * <PinFill size={40} className="text-warning" />
 */
export const PinFill = createIcon(
  'PinFill',
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='1em'
    height='1em'
    fill='currentColor'
    viewBox='0 0 16 16'
  >
    <path
      fill='currentColor'
      d='M12.316 3.643c0 .44-.22.85-.585 1.095l-1.415.943v1.317l1.785 1.275.123.1a1.31 1.31 0 0 1-.884 2.277H8.65v2.684a.65.65 0 0 1-1.3 0V10.65H4.66a1.31 1.31 0 0 1-.76-2.377l1.784-1.275V5.68L4.27 4.74a1.32 1.32 0 0 1-.586-1.096v-.31c0-.726.589-1.317 1.316-1.317h6c.727 0 1.316.59 1.316 1.318z'
    />
  </svg>,
);
