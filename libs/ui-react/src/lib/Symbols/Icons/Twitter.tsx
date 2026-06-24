import createIcon from '../../Components/Icon/createIcon';

/**
 * Twitter icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:Twitter Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { Twitter } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <Twitter />
 *
 * @example
 * // With custom size and className
 * <Twitter size={40} className="text-warning" />
 */
export const Twitter = createIcon(
  'Twitter',
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='1em'
    height='1em'
    fill='currentColor'
    viewBox='0 0 16 16'
  >
    <path
      fill='currentColor'
      d='M9.332 6.928 14.544 1h-1.235L8.783 6.147 5.17 1H1l5.466 7.784L1 15h1.235l4.78-5.436L10.83 15H15zM7.64 8.852l-.554-.775L2.68 1.91h1.897l3.556 4.977.554.775 4.622 6.47h-1.897z'
    />
  </svg>,
);
