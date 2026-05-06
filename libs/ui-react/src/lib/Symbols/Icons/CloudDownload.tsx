import createIcon from '../../Components/Icon/createIcon';

/**
 * CloudDownload icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/symbols-interface-icons--icon&args=name:CloudDownload Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { CloudDownload } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <CloudDownload />
 *
 * @example
 * // With custom size and className
 * <CloudDownload size={40} className="text-warning" />
 */
export const CloudDownload = createIcon(
  'CloudDownload',
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
      d='M8 10.667V14m1.333-1.333L8 14l-1.333-1.333m-1.734-1.334H4.66A3.33 3.33 0 0 1 1.327 8a3.32 3.32 0 0 1 2.879-3.293V4.7a3.98 3.98 0 0 1 3.78-2.713c2.207 0 4 1.786 4 4a2.67 2.67 0 0 1 2.667 2.666c0 1.467-1.2 2.667-2.667 2.667h-.94'
    />
  </svg>,
);
