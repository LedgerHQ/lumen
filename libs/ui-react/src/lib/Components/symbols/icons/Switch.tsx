import createIcon from '../Icon/createIcon';

/**
 * Switch icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:Switch Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { Switch } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <Switch />
 *
 * @example
 * // With custom size and className
 * <Switch size={40} className="text-warning" />
 */
export const Switch = createIcon(
  'Switch',
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
      d='M4.6 4.8h6.8a3.2 3.2 0 0 1 0 6.4H4.6a3.2 3.2 0 0 1 0-6.4'
      clipRule='evenodd'
    />
    <path
      fill='currentColor'
      fillRule='evenodd'
      d='M4.495 6.667c-.736 0-1.334.597-1.328 1.333a1.334 1.334 0 1 0 1.328-1.333'
      clipRule='evenodd'
    />
  </svg>,
);
