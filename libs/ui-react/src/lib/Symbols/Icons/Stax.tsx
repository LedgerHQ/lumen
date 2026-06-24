import createIcon from '../../Components/Icon/createIcon';

/**
 * Stax icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:Stax Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { Stax } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <Stax />
 *
 * @example
 * // With custom size and className
 * <Stax size={40} className="text-warning" />
 */
export const Stax = createIcon(
  'Stax',
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='1em'
    height='1em'
    fill='currentColor'
    viewBox='0 0 16 16'
  >
    <path
      stroke='currentColor'
      strokeWidth={1.3}
      d='M12 4.667h.467c.073 0 .133.06.133.133v1.733c0 .074-.06.134-.133.134H12M4.333 14h6.334c.736 0 1.333-.597 1.333-1.333V3.333C12 2.597 11.403 2 10.667 2H4.333A.333.333 0 0 0 4 2.333v11.334c0 .184.15.333.333.333Z'
    />
  </svg>,
);
