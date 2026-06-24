import createIcon from '../../Components/Icon/createIcon';

/**
 * IdCard icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:IdCard Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { IdCard } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <IdCard />
 *
 * @example
 * // With custom size and className
 * <IdCard size={40} className="text-warning" />
 */
export const IdCard = createIcon(
  'IdCard',
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
      d='M6.727 5.433c.58.58.58 1.534 0 2.12-.587.58-1.54.58-2.127 0a1.505 1.505 0 0 1 0-2.126 1.497 1.497 0 0 1 2.12 0m3.28.906h2.667M11.6 9H10m-1.94 2c-.12-.293-.3-.56-.533-.77a2.1 2.1 0 0 0-1.438-.566h-.867a2.12 2.12 0 0 0-1.971 1.33m-1.918 1.34v-8.64c0-.754.607-1.367 1.36-1.367h10.64c.733 0 1.333.593 1.333 1.333v8.667c0 .733-.6 1.333-1.333 1.333H2.666c-.737 0-1.333-.6-1.333-1.333z'
    />
  </svg>,
);
