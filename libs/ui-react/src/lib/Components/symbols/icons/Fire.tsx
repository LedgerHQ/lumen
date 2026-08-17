import createIcon from '../Icon/createIcon';

/**
 * Fire icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:Fire Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { Fire } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <Fire />
 *
 * @example
 * // With custom size and className
 * <Fire size={40} className="text-warning" />
 */
export const Fire = createIcon(
  'Fire',
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
      d='m4.132 5.04 2.322-2.71 2.503 2.921 1.62-1.89 1.291 1.507a5.34 5.34 0 0 1 1.286 3.476v.171A5.154 5.154 0 0 1 8 13.67v0a5.154 5.154 0 0 1-5.154-5.154v0A5.34 5.34 0 0 1 4.132 5.04'
      clipRule='evenodd'
    />
  </svg>,
);
