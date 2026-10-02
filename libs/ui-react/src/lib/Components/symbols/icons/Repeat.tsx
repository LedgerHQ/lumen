import createIcon from '../Icon/createIcon';

/**
 * Repeat icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:Repeat Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { Repeat } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <Repeat />
 *
 * @example
 * // With custom size and className
 * <Repeat size={40} className="text-warning" />
 */
export const Repeat = createIcon(
  'Repeat',
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
      d='M4.313 5.13H2.384V3.203M2 8a6 6 0 1 0 .73-2.87m4.564.909 2.588 1.53a.5.5 0 0 1 0 .861L7.294 9.96a.5.5 0 0 1-.755-.43V6.47a.5.5 0 0 1 .755-.431'
    />
  </svg>,
);
