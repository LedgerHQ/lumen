import createIcon from '../../Components/Icon/createIcon';

/**
 * Slideshow icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:Slideshow Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { Slideshow } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <Slideshow />
 *
 * @example
 * // With custom size and className
 * <Slideshow size={40} className="text-warning" />
 */
export const Slideshow = createIcon(
  'Slideshow',
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
      d='m6.667 3.333-1.334-.666v10.666l1.334-.666m-4-9.334-1.334-.666v10.666l1.334-.666m12-1.334-5.334 2V2.667l5.334 2z'
    />
  </svg>,
);
