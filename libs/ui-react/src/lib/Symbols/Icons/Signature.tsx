import createIcon from '../../Components/Icon/createIcon';

/**
 * Signature icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/symbols-interface-icons--icon&args=name:Signature Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { Signature } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <Signature />
 *
 * @example
 * // With custom size and className
 * <Signature size={40} className="text-warning" />
 */
export const Signature = createIcon(
  'Signature',
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
      d='M9.006 12.667h4m-10.65-7.3A2.5 2.5 0 0 1 2 4.053 1.89 1.89 0 0 1 3.667 2C5.507 2 7 4.686 7 8s-1.343 6-3 6h.001c-.92 0-1.668-1.194-1.668-2.667A5.336 5.336 0 0 1 7.671 6h-.004A2.517 2.517 0 0 1 10 8.668a6.5 6.5 0 0 1-.334 1.999c1.2-3.61 2.334-4 3-4A1.333 1.333 0 0 1 14 8'
    />
  </svg>,
);
