import createIcon from '../../Components/Icon/createIcon';

/**
 * MonitorPassword icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:MonitorPassword Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { MonitorPassword } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <MonitorPassword />
 *
 * @example
 * // With custom size and className
 * <MonitorPassword size={40} className="text-warning" />
 */
export const MonitorPassword = createIcon(
  'MonitorPassword',
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
      d='M14 8v1.613c0 .94-.773 1.714-1.72 1.714H3.7c-.947 0-1.72-.774-1.72-1.72q-.01-.009 0-.007V3.693a1.714 1.714 0 0 1 1.713-1.72m0 0q0-.009 0 0m0 0h.28m5.36 9.36L9.667 14m-3-2.667L6.333 14m-.906 0h5.146M8.33 3.667V3.66l-.007-.007h-.006m2.013.014V3.66l-.007-.007h-.006m2.01.014V3.66l-.007-.007h-.007M14 9H2m5.333-7.667h6c.737 0 1.334.597 1.334 1.334v2c0 .736-.597 1.333-1.334 1.333h-6A1.333 1.333 0 0 1 6 4.667v-2c0-.737.597-1.334 1.333-1.334'
    />
  </svg>,
);
