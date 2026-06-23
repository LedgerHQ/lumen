import createIcon from '../../Components/Icon/createIcon';

/**
 * Tablet icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:Tablet Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { Tablet } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <Tablet />
 *
 * @example
 * // With custom size and className
 * <Tablet size={40} className="text-warning" />
 */
export const Tablet = createIcon(
  'Tablet',
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
      d='M8 11.917a.085.085 0 0 0-.087.083c0 .04.033.083.083.083.04 0 .083-.04.083-.083a.085.085 0 0 0-.086-.083m4.674.583v-9c0-.833-.674-1.5-1.5-1.5H4.833c-.833 0-1.5.667-1.5 1.5v9c0 .827.667 1.5 1.5 1.5h6.334c.826 0 1.5-.673 1.5-1.5'
    />
  </svg>,
);
