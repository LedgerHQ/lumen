import createIcon from '../../Components/Icon/createIcon';

/**
 * Spacerocket icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/symbols-interface-icons--icon&args=name:Spacerocket Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { Spacerocket } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <Spacerocket />
 *
 * @example
 * // With custom size and className
 * <Spacerocket size={40} className="text-warning" />
 */
export const Spacerocket = createIcon(
  'Spacerocket',
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
      d='M10.668 8.667v2.922a.67.67 0 0 1-.369.597l-1.611.806a.667.667 0 0 1-.931-.386l-.424-1.271M4.665 8.667l-1.271-.424a.667.667 0 0 1-.386-.93L3.814 5.7a.67.67 0 0 1 .597-.369h2.922m4.066 2.75-3.6 2.88a.667.667 0 0 1-.888-.05L5.087 9.09a.667.667 0 0 1-.049-.888l2.88-3.6a6.94 6.94 0 0 1 5.418-2.603c.368 0 .667.298.667.666a6.94 6.94 0 0 1-2.604 5.418m-7.567 5.645-1.834.275.275-1.834a1.37 1.37 0 1 1 1.559 1.559'
    />
  </svg>,
);
