import createIcon from '../../Components/Icon/createIcon';

/**
 * Nfc icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:Nfc Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { Nfc } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <Nfc />
 *
 * @example
 * // With custom size and className
 * <Nfc size={40} className="text-warning" />
 */
export const Nfc = createIcon(
  'Nfc',
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
      d='M6 4.827a2.83 2.83 0 0 1 4 0m-6.244 6.75a6.003 6.003 0 1 1 8.488 0M7 6.414a1.415 1.415 0 0 1 2 0M7.5 13.17h1m-1.634 1.5h2.268a1.2 1.2 0 0 0 1.2-1.2V9.867a1.2 1.2 0 0 0-1.2-1.2H6.866a1.2 1.2 0 0 0-1.2 1.2v3.602a1.2 1.2 0 0 0 1.2 1.2'
    />
  </svg>,
);
