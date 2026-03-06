import createIcon from '../../Components/Icon/createIcon';

/**
 * Reduce icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/symbols-interface-icons--icon&args=name:Reduce Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { Reduce } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <Reduce />
 *
 * @example
 * // With custom size and className
 * <Reduce size={40} className="text-warning" />
 */
export const Reduce = createIcon(
  'Reduce',
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
      d='M14.002 8v3.335a2.67 2.67 0 0 1-2.667 2.667h-6.67a2.67 2.67 0 0 1-2.668-2.667v-6.67a2.67 2.67 0 0 1 2.668-2.667H8m-.667 6.669 6.67-6.67m-6.67 6.67h2.668m-2.668 0V5.999'
    />
  </svg>,
);
