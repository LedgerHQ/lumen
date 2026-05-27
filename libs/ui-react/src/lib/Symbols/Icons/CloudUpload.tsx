import createIcon from '../../Components/Icon/createIcon';

/**
 * CloudUpload icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/symbols-interface-icons--icon&args=name:CloudUpload Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { CloudUpload } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <CloudUpload />
 *
 * @example
 * // With custom size and className
 * <CloudUpload size={40} className="text-warning" />
 */
export const CloudUpload = createIcon(
  'CloudUpload',
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
      d='M4.933 11.333H4.66A3.33 3.33 0 0 1 1.327 8a3.32 3.32 0 0 1 2.879-3.293V4.7a3.98 3.98 0 0 1 3.78-2.713c2.207 0 4 1.786 4 4a2.67 2.67 0 0 1 2.667 2.666c0 1.467-1.2 2.667-2.667 2.667h-.94m-4.38.68L8 10.667 9.333 12M8 10.667V14'
    />
  </svg>,
);
