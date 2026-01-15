import createIcon from '../../Components/Icon/createIcon';

/**
 * ExpandLeft icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/symbols-interface-icons--icon&args=name:ExpandLeft Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { ExpandLeft } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <ExpandLeft />
 *
 * @example
 * // With custom size and className
 * <ExpandLeft size={40} className="text-warning" />
 */
export const ExpandLeft = createIcon(
  'ExpandLeft',
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
      d='M6.333 6.667 5 8l1.333 1.333m1 4.667h-2A3.333 3.333 0 0 1 2 10.667V5.333A3.333 3.333 0 0 1 5.333 2h2m2 0v12h1.334A3.333 3.333 0 0 0 14 10.667V5.333A3.333 3.333 0 0 0 10.667 2z'
    />
  </svg>,
);
