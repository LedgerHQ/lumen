import createIcon from '../../Components/Icon/createIcon';

/**
 * FileDownload icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/symbols-interface-icons--icon&args=name:FileDownload Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { FileDownload } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <FileDownload />
 *
 * @example
 * // With custom size and className
 * <FileDownload size={40} className="text-warning" />
 */
export const FileDownload = createIcon(
  'FileDownload',
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
      d='M2.653 8.653V3.987c0-1.107.894-2 2-2h5c.534 0 1.04.206 1.42.586l1.674 1.674c.373.38.58.886.586 1.42V12c0 1.1-.9 2-2 2H8.667m4.666-8.333H11c-.74 0-1.333-.6-1.333-1.334V2m-5 8.667V14m-1.334-1.333L4.667 14 6 12.667'
    />
  </svg>,
);
