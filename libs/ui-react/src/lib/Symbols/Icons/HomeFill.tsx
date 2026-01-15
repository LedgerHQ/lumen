import createIcon from '../../Components/Icon/createIcon';

/**
 * HomeFill icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/symbols-interface-icons--icon&args=name:HomeFill Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { HomeFill } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <HomeFill />
 *
 * @example
 * // With custom size and className
 * <HomeFill size={40} className="text-warning" />
 */
export const HomeFill = createIcon(
  'HomeFill',
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='1em'
    height='1em'
    fill='currentColor'
    viewBox='0 0 16 16'
  >
    <path
      fill='currentColor'
      d='M7.714 1.416a.65.65 0 0 1 .658.052l6.667 4.666a.65.65 0 0 1-.745 1.065l-.31-.218V14a.65.65 0 0 1-.65.65h-2.67a.7.7 0 0 1-.7-.683l-.089-3.875a1.5 1.5 0 0 0-1.499-1.466h-.824a1.5 1.5 0 0 0-1.5 1.5v3.824a.7.7 0 0 1-.7.7H2.666a.65.65 0 0 1-.65-.65V6.98l-.31.218A.65.65 0 0 1 .96 6.134l6.667-4.666z'
    />
  </svg>,
);
