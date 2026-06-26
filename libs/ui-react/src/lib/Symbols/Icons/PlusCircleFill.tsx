import createIcon from '../../Components/Icon/createIcon';

/**
 * PlusCircleFill icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:PlusCircleFill Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { PlusCircleFill } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <PlusCircleFill />
 *
 * @example
 * // With custom size and className
 * <PlusCircleFill size={40} className="text-warning" />
 */
export const PlusCircleFill = createIcon(
  'PlusCircleFill',
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='1em'
    height='1em'
    fill='currentColor'
    viewBox='0 0 16 16'
  >
    <path
      fill='currentColor'
      d='M8 1.35a6.65 6.65 0 0 1 0 13.3A6.646 6.646 0 0 1 1.35 8c0-3.679 2.978-6.65 6.65-6.65m0 3.333a.65.65 0 0 0-.65.65V7.35H5.334a.65.65 0 0 0 0 1.3H7.35v2.016a.65.65 0 0 0 1.3 0V8.65h2.016a.65.65 0 1 0 0-1.3H8.65V5.333a.65.65 0 0 0-.65-.65'
    />
  </svg>,
);
