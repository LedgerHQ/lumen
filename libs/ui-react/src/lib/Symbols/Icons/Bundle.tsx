import createIcon from '../../Components/Icon/createIcon';

/**
 * Bundle icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:Bundle Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { Bundle } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <Bundle />
 *
 * @example
 * // With custom size and className
 * <Bundle size={40} className="text-warning" />
 */
export const Bundle = createIcon(
  'Bundle',
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
      strokeWidth={1.3}
      d='M9.6 3.2h.8a.8.8 0 0 1 .8.8v8a.8.8 0 0 1-.8.8h-.8m3.6-9.6h.8a.8.8 0 0 1 .8.8v8a.8.8 0 0 1-.8.8h-.8m-10.8 0h4.4a.8.8 0 0 0 .8-.8V4a.8.8 0 0 0-.8-.8H2.4a.8.8 0 0 0-.8.8v8a.8.8 0 0 0 .8.8Z'
    />
  </svg>,
);
