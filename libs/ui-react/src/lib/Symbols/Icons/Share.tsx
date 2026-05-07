import createIcon from '../../Components/Icon/createIcon';

/**
 * Share icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/symbols-interface-icons--icon&args=name:Share Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { Share } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <Share />
 *
 * @example
 * // With custom size and className
 * <Share size={40} className="text-warning" />
 */
export const Share = createIcon(
  'Share',
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
      d='M5.333 6.667H4c-.737 0-1.333.596-1.333 1.333v4.667C2.667 13.403 3.263 14 4 14h8c.737 0 1.333-.597 1.333-1.333V8c0-.737-.596-1.333-1.333-1.333h-1.333M8 2v7.333M10 4 8 2 6 4'
    />
  </svg>,
);
