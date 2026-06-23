import createIcon from '../../Components/Icon/createIcon';

/**
 * Warning icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:Warning Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { Warning } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <Warning />
 *
 * @example
 * // With custom size and className
 * <Warning size={40} className="text-warning" />
 */
export const Warning = createIcon(
  'Warning',
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
      d='M8 8.747V6.253m-.007 4.497a.165.165 0 0 0-.166.167.17.17 0 0 0 .166.166c.087 0 .167-.08.167-.166a.17.17 0 0 0-.173-.167m1.366-7.997 5.1 8.936c.593 1.034-.16 2.332-1.354 2.332H2.887a1.558 1.558 0 0 1-1.353-2.332l5.1-8.936c.593-1.053 2.106-1.053 2.705 0z'
    />
  </svg>,
);
