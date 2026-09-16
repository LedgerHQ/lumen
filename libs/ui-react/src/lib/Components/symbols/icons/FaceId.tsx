import createIcon from '../Icon/createIcon';

/**
 * FaceId icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:FaceId Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { FaceId } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <FaceId />
 *
 * @example
 * // With custom size and className
 * <FaceId size={40} className="text-warning" />
 */
export const FaceId = createIcon(
  'FaceId',
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
      d='M5 6.053v1m6-1v1M7.333 9.065h.334a.667.667 0 0 0 .666-.667V6.065m1.828 4.706a3.056 3.056 0 0 1-4.322 0M5.06 2H3.333C2.597 2 2 2.597 2 3.333V5.06M10.941 14h1.726c.736 0 1.333-.597 1.333-1.333V10.94m-12 0v1.726C2 13.403 2.597 14 3.333 14H5.06M14 5.059V3.333C14 2.597 13.403 2 12.667 2H10.94'
    />
  </svg>,
);
