import createIcon from '../../Components/Icon/createIcon';

/**
 * MoreVertical icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:MoreVertical Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { MoreVertical } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <MoreVertical />
 *
 * @example
 * // With custom size and className
 * <MoreVertical size={40} className="text-warning" />
 */
export const MoreVertical = createIcon(
  'MoreVertical',
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
      d='M7.993 11.667A.33.33 0 0 0 7.66 12c0 .18.147.333.333.333.18 0 .334-.153.334-.333a.336.336 0 0 0-.34-.333m.006-4A.33.33 0 0 0 7.66 8c0 .18.147.333.333.333.18 0 .334-.153.334-.333a.336.336 0 0 0-.34-.333m.006-4A.33.33 0 0 0 7.66 4c0 .18.147.333.333.333.18 0 .334-.153.334-.333a.336.336 0 0 0-.34-.333'
    />
  </svg>,
);
