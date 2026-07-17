import createIcon from '../../Components/Icon/createIcon';

/**
 * Cutlery icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:Cutlery Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { Cutlery } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <Cutlery />
 *
 * @example
 * // With custom size and className
 * <Cutlery size={40} className="text-warning" />
 */
export const Cutlery = createIcon(
  'Cutlery',
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
      d='M2 2.056v2.975m0 0v.06m0-.06c0 .849.35 1.601.893 2.088.265.238.44.559.44.916V13a1 1 0 0 0 2 0V8.035c0-.357.176-.678.441-.916.543-.487.893-1.239.893-2.088V2.056M4.333 5.333V2m9 .701a.667.667 0 0 0-.666-.666H12a2 2 0 0 0-2 2v4c0 .869.558 1.602 1.333 1.877V13a1 1 0 0 0 2 0z'
    />
  </svg>,
);
