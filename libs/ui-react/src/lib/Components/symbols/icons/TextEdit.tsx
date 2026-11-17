import createIcon from '../Icon/createIcon';

/**
 * TextEdit icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:TextEdit Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { TextEdit } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <TextEdit />
 *
 * @example
 * // With custom size and className
 * <TextEdit size={40} className="text-warning" />
 */
export const TextEdit = createIcon(
  'TextEdit',
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
      d='M5.333 4H2v1.333M5.333 4h3.334v1.333M5.333 4v8m0 0h1.334m-1.334 0H4m8.667-10v12m0-12h-1.334m1.334 0H14m-1.333 12H14m-1.333 0h-1.334'
    />
  </svg>,
);
