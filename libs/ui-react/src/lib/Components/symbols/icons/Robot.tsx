import createIcon from '../Icon/createIcon';

/**
 * Robot icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:Robot Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { Robot } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <Robot />
 *
 * @example
 * // With custom size and className
 * <Robot size={40} className="text-warning" />
 */
export const Robot = createIcon(
  'Robot',
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='1em'
    height='1em'
    fill='currentColor'
    viewBox='0 0 16 16'
  >
    <path
      stroke='currentColor'
      d='M8 .789v3.208M.667 6.667v4m14.666-4v4M4 3.997h8c.736 0 1.333.597 1.333 1.333v6.667c0 .736-.597 1.333-1.333 1.333H4a1.333 1.333 0 0 1-1.333-1.333V5.33c0-.736.597-1.333 1.333-1.333ZM8.333 1.32a.333.333 0 1 1-.666 0 .333.333 0 0 1 .666 0Z'
    />
    <circle cx={6} cy={8.667} r={0.983} fill='currentColor' />
    <circle cx={10} cy={8.667} r={0.983} fill='currentColor' />
  </svg>,
);
