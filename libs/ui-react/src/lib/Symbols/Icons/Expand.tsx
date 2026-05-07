import createIcon from '../../Components/Icon/createIcon';

/**
 * Expand icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/symbols-interface-icons--icon&args=name:Expand Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { Expand } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <Expand />
 *
 * @example
 * // With custom size and className
 * <Expand size={40} className="text-warning" />
 */
export const Expand = createIcon(
  'Expand',
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
      d='M14 4.667V2h-2.667M14 2l-4 4M2.667 7.333V4c0-.737.596-1.333 1.333-1.333h3.333M2 11.333V14h2.667M2 14l4-4m7.333-1.333V12c0 .737-.596 1.333-1.333 1.333H8'
    />
  </svg>,
);
