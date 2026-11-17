import createIcon from '../Icon/createIcon';

/**
 * BadgeVerifiedFill icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:BadgeVerifiedFill Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { BadgeVerifiedFill } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <BadgeVerifiedFill />
 *
 * @example
 * // With custom size and className
 * <BadgeVerifiedFill size={40} className="text-warning" />
 */
export const BadgeVerifiedFill = createIcon(
  'BadgeVerifiedFill',
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='1em'
    height='1em'
    fill='currentColor'
    viewBox='0 0 16 16'
  >
    <path
      fill='currentColor'
      d='M6.965 1.625a1.4 1.4 0 0 1 2.002-.002l1.14 1.14h1.617c.776 0 1.416.624 1.416 1.416v1.617l1.14 1.14a1.413 1.413 0 0 1 0 2v.002l-1.153 1.145v1.61a1.42 1.42 0 0 1-1.424 1.416h-1.628l-1.149 1.143-.006.005c-.554.54-1.443.55-2-.007l-1.067-1.067H4.23a1.423 1.423 0 0 1-1.424-1.424v-1.623L1.654 8.984a1.41 1.41 0 0 1-.001-2.006l1.14-1.147V4.2c0-.777.62-1.424 1.417-1.424h1.61l1.145-1.152M10.46 6.54a.65.65 0 0 0-.92 0L7.5 8.58 6.46 7.54a.651.651 0 0 0-.92.92l1.5 1.5a.65.65 0 0 0 .92 0l2.5-2.5a.65.65 0 0 0 0-.92'
    />
  </svg>,
);
