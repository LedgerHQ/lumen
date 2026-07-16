import createIcon from '../../Components/Icon/createIcon';

/**
 * Upload icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:Upload Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { Upload } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <Upload />
 *
 * @example
 * // With custom size and className
 * <Upload size={40} className="text-warning" />
 */
export const Upload = createIcon(
  'Upload',
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
      d='M13.333 10.963a2.37 2.37 0 0 1-2.37 2.37H5.037a2.37 2.37 0 0 1-2.37-2.37m7.704-5.926L8 2.667l-2.37 2.37M8 2.667v7.111'
    />
  </svg>,
);
