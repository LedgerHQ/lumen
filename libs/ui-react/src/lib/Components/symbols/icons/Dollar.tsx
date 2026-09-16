import createIcon from '../Icon/createIcon';

/**
 * Dollar icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:Dollar Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { Dollar } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <Dollar />
 *
 * @example
 * // With custom size and className
 * <Dollar size={40} className="text-warning" />
 */
export const Dollar = createIcon(
  'Dollar',
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
      d='M3.522 3.515a6.333 6.333 0 1 1 8.956 8.957 6.333 6.333 0 0 1-8.956-8.957'
    />
    <path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M8.02 4.103v.974m0 6.82v-.974M9.951 6.44A1.457 1.457 0 0 0 8.5 5.077H7.433c-.756 0-1.372.608-1.372 1.364 0 .624.427 1.17 1.03 1.325l1.825.452a1.35 1.35 0 0 1 1.029 1.325c0 .756-.616 1.364-1.372 1.364H7.505c-.779 0-1.402-.608-1.457-1.372'
    />
  </svg>,
);
