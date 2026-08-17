import createIcon from '../Icon/createIcon';

/**
 * Minimize icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:Minimize Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { Minimize } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <Minimize />
 *
 * @example
 * // With custom size and className
 * <Minimize size={40} className="text-warning" />
 */
export const Minimize = createIcon(
  'Minimize',
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
      d='M10.167 13.833V11.5c0-.737.596-1.333 1.333-1.333h2.333m-8-8V4.5c0 .737-.596 1.333-1.333 1.333H2.167m11.666 0H11.5A1.333 1.333 0 0 1 10.167 4.5V2.167m-8 8H4.5c.737 0 1.333.596 1.333 1.333v2.333'
    />
  </svg>,
);
