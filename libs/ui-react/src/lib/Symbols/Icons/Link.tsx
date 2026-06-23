import createIcon from '../../Components/Icon/createIcon';

/**
 * Link icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:Link Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { Link } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <Link />
 *
 * @example
 * // With custom size and className
 * <Link size={40} className="text-warning" />
 */
export const Link = createIcon(
  'Link',
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
      d='m9.417 11.508-.971.971a3.58 3.58 0 0 1-5.067 0 3.58 3.58 0 0 1 0-5.066l.974-.969M5.93 9.931l4.14-4.14M6.583 4.215l.971-.972a3.58 3.58 0 0 1 5.844 1.163 3.58 3.58 0 0 1-.777 3.904l-.974.969'
    />
  </svg>,
);
