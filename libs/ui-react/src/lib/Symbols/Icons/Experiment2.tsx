import createIcon from '../../Components/Icon/createIcon';

/**
 * Experiment2 icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/symbols-interface-icons--icon&args=name:Experiment2 Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { Experiment2 } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <Experiment2 />
 *
 * @example
 * // With custom size and className
 * <Experiment2 size={40} className="text-warning" />
 */
export const Experiment2 = createIcon(
  'Experiment2',
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
      d='M13.667 6.82 9.18 2.333m3.74 3.734L5.94 13.04c-.827.82-2.167.82-2.994 0l-.007-.007a2.123 2.123 0 0 1-.007-2.993v-.007l6.973-6.98m-5.232 5.28h5.98'
    />
  </svg>,
);
