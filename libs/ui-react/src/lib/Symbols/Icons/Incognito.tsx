import createIcon from '../../Components/Icon/createIcon';

/**
 * Incognito icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:Incognito Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { Incognito } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <Incognito />
 *
 * @example
 * // With custom size and className
 * <Incognito size={40} className="text-warning" />
 */
export const Incognito = createIcon(
  'Incognito',
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
      d='m3.958 6 .481-2.888a1.335 1.335 0 0 1 1.316-1.114h4.41c.652 0 1.208.471 1.315 1.114l.482 2.887m-5.145 6.003a2 2 0 1 1-4.002 0 2 2 0 0 1 4.002 0m0 0c.632-.763 1.655-.763 2.287 0m0 0a2 2 0 1 0 4.002 0 2 2 0 0 0-4.002 0M1.998 8.667c3.315-1.779 8.69-1.779 12.005 0'
    />
  </svg>,
);
