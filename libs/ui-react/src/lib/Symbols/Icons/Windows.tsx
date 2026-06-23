import createIcon from '../../Components/Icon/createIcon';

/**
 * Windows icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:Windows Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { Windows } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <Windows />
 *
 * @example
 * // With custom size and className
 * <Windows size={40} className="text-warning" />
 */
export const Windows = createIcon(
  'Windows',
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='1em'
    height='1em'
    fill='currentColor'
    viewBox='0 0 16 16'
  >
    <path
      fill='currentColor'
      d='M7.504 7.76H13.6V2.4l-6.096.848zM2.4 12.064l4.608.624V8.304H2.4zm0-4.304h4.608V3.312L2.4 3.936zm5.104 4.992 6.096.848V8.304H7.504z'
    />
  </svg>,
);
