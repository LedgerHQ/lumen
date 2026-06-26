import createIcon from '../../Components/Icon/createIcon';

/**
 * HatSchool icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:HatSchool Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { HatSchool } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <HatSchool />
 *
 * @example
 * // With custom size and className
 * <HatSchool size={40} className="text-warning" />
 */
export const HatSchool = createIcon(
  'HatSchool',
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
      d='M14.274 6v4.5M3.994 8.133v2.614c0 .626.313 1.22.84 1.566l1.066.707c1.267.84 2.917.84 4.183 0l1.067-.713c.527-.354.84-.947.84-1.574v-2.62M6.469 2.727 2.347 5.013a1.257 1.257 0 0 0 0 2.2L6.46 9.5a3.16 3.16 0 0 0 3.06 0l4.113-2.287c.86-.486.86-1.726 0-2.205l-4.12-2.287a3.14 3.14 0 0 0-3.066 0z'
    />
  </svg>,
);
