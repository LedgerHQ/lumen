import createIcon from '../../Components/Icon/createIcon';

/**
 * Target icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/symbols-interface-icons--icon&args=name:Target Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { Target } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <Target />
 *
 * @example
 * // With custom size and className
 * <Target size={40} className="text-warning" />
 */
export const Target = createIcon(
  'Target',
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
      d='M13.818 8.316a5.684 5.684 0 1 1-5.685-5.684m3.158 5.684a3.158 3.158 0 1 1-3.158-3.158m2.53.629L8.136 8.313M12.555 2 10.66 3.895v1.894h1.895l1.894-1.894-1.263-.632z'
    />
  </svg>,
);
