import createIcon from '../../Components/Icon/createIcon';

/**
 * CheckmarkCircleFill icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:CheckmarkCircleFill Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { CheckmarkCircleFill } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <CheckmarkCircleFill />
 *
 * @example
 * // With custom size and className
 * <CheckmarkCircleFill size={40} className="text-warning" />
 */
export const CheckmarkCircleFill = createIcon(
  'CheckmarkCircleFill',
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='1em'
    height='1em'
    fill='currentColor'
    viewBox='0 0 16 16'
  >
    <path
      fill='currentColor'
      d='M8.001 1.35a6.65 6.65 0 1 1-.003 13.301A6.65 6.65 0 0 1 8.001 1.35m2.795 4.58a.67.67 0 0 0-.944 0L7.064 8.718l-.963-.962a.666.666 0 1 0-.943.942l1.444 1.445a.67.67 0 0 0 1.027-.105l3.167-3.164a.667.667 0 0 0 0-.942'
    />
  </svg>,
);
