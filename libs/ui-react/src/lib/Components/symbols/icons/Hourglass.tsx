import createIcon from '../Icon/createIcon';

/**
 * Hourglass icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:Hourglass Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { Hourglass } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <Hourglass />
 *
 * @example
 * // With custom size and className
 * <Hourglass size={40} className="text-warning" />
 */
export const Hourglass = createIcon(
  'Hourglass',
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
      d='M6.667 12h2.666M11.32 2H4.681a.667.667 0 0 0-.667.667v1.585c0 .28.089.555.253.782L6.414 8l-2.147 2.966a1.33 1.33 0 0 0-.253.782v1.585c0 .368.299.667.667.667h6.638a.667.667 0 0 0 .666-.667v-1.561c0-.296-.098-.583-.28-.817L9.414 8l2.292-2.955c.181-.234.28-.522.28-.818v-1.56A.667.667 0 0 0 11.319 2'
    />
  </svg>,
);
