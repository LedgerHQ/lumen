import createIcon from '../../Components/Icon/createIcon';

/**
 * Youtube icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:Youtube Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { Youtube } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <Youtube />
 *
 * @example
 * // With custom size and className
 * <Youtube size={40} className="text-warning" />
 */
export const Youtube = createIcon(
  'Youtube',
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='1em'
    height='1em'
    fill='currentColor'
    viewBox='0 0 16 16'
  >
    <path
      fill='currentColor'
      fillRule='evenodd'
      d='M13.47 3.299a1.77 1.77 0 0 1 1.238 1.263C15 5.675 15 8 15 8s0 2.325-.293 3.438a1.77 1.77 0 0 1-1.238 1.263C12.38 13 8 13 8 13s-4.378 0-5.47-.299a1.77 1.77 0 0 1-1.237-1.263C1 10.325 1 8 1 8s0-2.325.293-3.438A1.77 1.77 0 0 1 2.53 3.299C3.622 3 8 3 8 3s4.378 0 5.47.299M10.239 8 6.6 5.857v4.286z'
      clipRule='evenodd'
    />
  </svg>,
);
