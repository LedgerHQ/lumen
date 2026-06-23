import createIcon from '../../Components/Icon/createIcon';

/**
 * Folder icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:Folder Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { Folder } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <Folder />
 *
 * @example
 * // With custom size and className
 * <Folder size={40} className="text-warning" />
 */
export const Folder = createIcon(
  'Folder',
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
      d='M14 6V4.667c0-.74-.6-1.334-1.333-1.334h-5.5m.96 1.927L7.193 3.4A1.34 1.34 0 0 0 6 2.66H3.32v-.007c-.74 0-1.333.594-1.333 1.334v8c0 .733.593 1.333 1.333 1.333h9.333c.734 0 1.334-.6 1.334-1.333v-6h-4.68c-.507 0-.974-.287-1.194-.74z'
    />
  </svg>,
);
