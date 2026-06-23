import createIcon from '../../Components/Icon/createIcon';

/**
 * Medal1 icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:Medal1 Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { Medal1 } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <Medal1 />
 *
 * @example
 * // With custom size and className
 * <Medal1 size={40} className="text-warning" />
 */
export const Medal1 = createIcon(
  'Medal1',
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
      d='M4.667 9.333v4.66c0 .18.146.327.333.327a.4.4 0 0 0 .133-.033l2.86-1.307 2.86 1.3c.167.073.36 0 .44-.167.014-.046.027-.093.027-.14v-4.74M8 1.333a4.667 4.667 0 1 0 0 9.334 4.667 4.667 0 0 0 0-9.334'
    />
  </svg>,
);
