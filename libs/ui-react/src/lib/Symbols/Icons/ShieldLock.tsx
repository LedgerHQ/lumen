import createIcon from '../../Components/Icon/createIcon';

/**
 * ShieldLock icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:ShieldLock Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { ShieldLock } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <ShieldLock />
 *
 * @example
 * // With custom size and className
 * <ShieldLock size={40} className="text-warning" />
 */
export const ShieldLock = createIcon(
  'ShieldLock',
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
      d='M9.018 7.417v-.9c0-.562-.46-1.02-1.02-1.02-.562 0-1.02.453-1.02 1.013v.893m2.189.01H6.833a.66.66 0 0 0-.666.667v1.413c0 .367.293.667.666.667h2.334c.366 0 .666-.3.666-.667v-1.42c0-.373-.3-.666-.666-.666zm4.166.08c0 2.912-2.104 5.64-4.986 6.454-.227.06-.468.06-.694 0-2.886-.82-4.986-3.547-4.986-6.46V4.8c0-.547.326-1.033.826-1.234l3.24-1.327a3.3 3.3 0 0 1 2.52 0l3.24 1.327c.5.2.827.687.827 1.234v2.685z'
    />
  </svg>,
);
