import createIcon from '../../Components/Icon/createIcon';

/**
 * Magnet icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:Magnet Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { Magnet } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <Magnet />
 *
 * @example
 * // With custom size and className
 * <Magnet size={40} className="text-warning" />
 */
export const Magnet = createIcon(
  'Magnet',
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
      d='M10 2.666v3.333m0 4v3.333M12.333 10H8a2 2 0 1 1 0-4h4.333a1 1 0 0 0 1-1V3.667a1 1 0 0 0-1-1H8a5.333 5.333 0 1 0 0 10.666h4.333a1 1 0 0 0 1-1V11a1 1 0 0 0-1-1'
    />
  </svg>,
);
