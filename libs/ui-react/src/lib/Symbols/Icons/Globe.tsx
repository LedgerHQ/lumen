import createIcon from '../../Components/Icon/createIcon';

/**
 * Globe icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:Globe Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { Globe } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <Globe />
 *
 * @example
 * // With custom size and className
 * <Globe size={40} className="text-warning" />
 */
export const Globe = createIcon(
  'Globe',
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
      d='M2.34 6h11.32M2.34 10h11.32M8 2.067c2.889 0 2.889 11.866 0 11.866S5.111 2.067 8 2.067M8 2c3.32 0 6 2.679 6 6 0 3.32-2.68 6-6 6-3.321 0-6-2.68-6-6 0-3.321 2.679-6 6-6'
    />
  </svg>,
);
