import createIcon from '../../Components/Icon/createIcon';

/**
 * DocumentCode icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:DocumentCode Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { DocumentCode } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <DocumentCode />
 *
 * @example
 * // With custom size and className
 * <DocumentCode size={40} className="text-warning" />
 */
export const DocumentCode = createIcon(
  'DocumentCode',
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
      d='m4.667 6 1-1-1-1M4 11.333V10m9 4H3.333C2.593 14 2 13.4 2 12.667V12a.66.66 0 0 1 .667-.667h8.666c.367 0 .667.294.667.667v1c0 .547.447 1 1 1m0 0c.547 0 1-.453 1-1V3.333C14 2.593 13.4 2 12.667 2H10M3.667 2h2.666C7.253 2 8 2.746 8 3.667v2.666C8 7.253 7.254 8 6.333 8H3.667C2.747 8 2 7.254 2 6.333V3.667C2 2.747 2.746 2 3.667 2'
    />
  </svg>,
);
