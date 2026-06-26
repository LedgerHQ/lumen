import createIcon from '../../Components/Icon/createIcon';

/**
 * Dollar icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:Dollar Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { Dollar } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <Dollar />
 *
 * @example
 * // With custom size and className
 * <Dollar size={40} className="text-warning" />
 */
export const Dollar = createIcon(
  'Dollar',
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
      d='M8 5v.667M8 11v-.667M6.567 9.5c.26.54.826.867 1.426.833.726.08 1.393-.44 1.5-1.166 0-.507-.36-.94-.854-1.04L7.333 7.86c-.5-.1-.854-.533-.854-1.04.1-.733.767-1.253 1.5-1.167.6-.04 1.16.287 1.427.834M8 1.66a6.333 6.333 0 1 0 0 12.667A6.333 6.333 0 0 0 8 1.66'
    />
  </svg>,
);
