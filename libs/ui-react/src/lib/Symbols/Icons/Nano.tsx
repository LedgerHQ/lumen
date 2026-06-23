import createIcon from '../../Components/Icon/createIcon';

/**
 * Nano icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:Nano Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { Nano } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <Nano />
 *
 * @example
 * // With custom size and className
 * <Nano size={40} className="text-warning" />
 */
export const Nano = createIcon(
  'Nano',
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
      d='M11.333 11.944a.279.279 0 0 0 .556 0 .28.28 0 0 0-.278-.277.28.28 0 0 0-.278.283M6.172 8 3.236 5.064a.333.333 0 0 1 0-.471l2.357-2.357c.13-.13.341-.13.471 0L11.83 8m-9.536 6H12a2 2 0 1 0 0-4H2.293a.293.293 0 0 0-.293.293v3.414c0 .162.131.293.293.293'
    />
  </svg>,
);
