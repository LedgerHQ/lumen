import createIcon from '../../Components/Icon/createIcon';

/**
 * ExternalLink icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/symbols-interface-icons--icon&args=name:ExternalLink Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { ExternalLink } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <ExternalLink />
 *
 * @example
 * // With custom size and className
 * <ExternalLink size={40} className="text-warning" />
 */
export const ExternalLink = createIcon(
  'ExternalLink',
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
      d='m8 8 5-5M9.333 3H13v3.667M6 3H4.333C3.597 3 3 3.597 3 4.333v7.334C3 12.4 3.597 13 4.333 13h7.334C12.4 13 13 12.4 13 11.667V10'
    />
  </svg>,
);
