import createIcon from '../../Components/Icon/createIcon';

/**
 * Unlock icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:Unlock Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { Unlock } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <Unlock />
 *
 * @example
 * // With custom size and className
 * <Unlock size={40} className="text-warning" />
 */
export const Unlock = createIcon(
  'Unlock',
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
      d='M14.667 4.013A2.66 2.66 0 0 0 12.087 2 2.67 2.67 0 0 0 9.42 4.667v2M10.667 14H4c-.74 0-1.333-.6-1.333-1.333V8c0-.74.593-1.333 1.333-1.333h6.667C11.4 6.667 12 7.26 12 8v4.667C12 13.4 11.4 14 10.667 14'
    />
  </svg>,
);
