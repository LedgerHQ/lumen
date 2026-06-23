import createIcon from '../../Components/Icon/createIcon';

/**
 * ShieldMore icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:ShieldMore Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { ShieldMore } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <ShieldMore />
 *
 * @example
 * // With custom size and className
 * <ShieldMore size={40} className="text-warning" />
 */
export const ShieldMore = createIcon(
  'ShieldMore',
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
      d='M8.118 7.549c.06.06.06.166 0 .233a.18.18 0 0 1-.24 0 .17.17 0 0 1 0-.24.16.16 0 0 1 .233 0m2.669.007c.06.06.06.166 0 .233a.18.18 0 0 1-.24 0 .17.17 0 0 1 0-.24.16.16 0 0 1 .233 0m-5.322.007c.06.06.06.166 0 .233a.18.18 0 0 1-.24 0 .17.17 0 0 1 0-.24.16.16 0 0 1 .234 0m7.888-.087c0 3.027-2.28 5.858-5.333 6.545-3.058-.693-5.333-3.52-5.333-6.545V4.82c0-.546.326-1.033.766-1.213l3.334-1.364c.806-.333 1.646-.333 2.4-.027l3.333 1.36c.5.2.827.687.827 1.234v2.627z'
    />
  </svg>,
);
