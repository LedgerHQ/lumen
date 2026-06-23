import createIcon from '../../Components/Icon/createIcon';

/**
 * Planet icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:Planet Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { Planet } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <Planet />
 *
 * @example
 * // With custom size and className
 * <Planet size={40} className="text-warning" />
 */
export const Planet = createIcon(
  'Planet',
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
      d='M5.153 8a2.844 2.844 0 0 1 2.84-2.847m7.2-1.313c.76 1.32-1.84 4.26-5.82 6.553s-7.826 3.08-8.586 1.754m.013.013c-.467-.807.313-2.207 1.887-3.7m8.373-4.827c2.073-.62 3.673-.593 4.14.207M8 2.667a5.333 5.333 0 1 0 0 10.666A5.333 5.333 0 0 0 8 2.667'
    />
  </svg>,
);
