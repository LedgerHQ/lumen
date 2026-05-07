import createIcon from '../../Components/Icon/createIcon';

/**
 * PictureImage icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/symbols-interface-icons--icon&args=name:PictureImage Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { PictureImage } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <PictureImage />
 *
 * @example
 * // With custom size and className
 * <PictureImage size={40} className="text-warning" />
 */
export const PictureImage = createIcon(
  'PictureImage',
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
      d='m1.998 8.667.863-.864a1.61 1.61 0 0 1 2.274 0L8 10.668m-3.333 3.335 4.199-4.199a1.61 1.61 0 0 1 2.274 0l2.627 2.627m.236-1.096a2.67 2.67 0 0 1-2.668 2.668h-6.67a2.67 2.67 0 0 1-2.667-2.668v-6.67a2.67 2.67 0 0 1 2.667-2.667h6.67a2.67 2.67 0 0 1 2.668 2.667z'
    />
  </svg>,
);
