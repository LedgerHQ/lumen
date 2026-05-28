import createIcon from '../../Components/Icon/createIcon';

/**
 * Lightbulb icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/symbols-interface-icons--icon&args=name:Lightbulb Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { Lightbulb } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <Lightbulb />
 *
 * @example
 * // With custom size and className
 * <Lightbulb size={40} className="text-warning" />
 */
export const Lightbulb = createIcon(
  'Lightbulb',
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
      d='M10 10.127H6m7.333-6.794.794-.793M2.667 10l-.794.793m1.46-8.126-.793-.794M13.333 10l.794.793M14 6.667h1.127m-14.254 0H2M6 12h3.913m-4.22-2.07a3.99 3.99 0 0 1-1.646-3.906c.266-1.738 1.713-3.125 3.466-3.33a3.997 3.997 0 0 1 4.484 3.967c0 1.346-.674 2.54-1.7 3.265a.67.67 0 0 0-.307.553v1.84c0 .92-.747 1.667-1.667 1.667h-.666a1.663 1.663 0 0 1-1.667-1.667v-1.842a.71.71 0 0 0-.307-.566z'
    />
  </svg>,
);
