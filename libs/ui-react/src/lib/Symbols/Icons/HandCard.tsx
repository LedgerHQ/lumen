import createIcon from '../../Components/Icon/createIcon';

/**
 * HandCard icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/symbols-interface-icons--icon&args=name:HandCard Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { HandCard } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <HandCard />
 *
 * @example
 * // With custom size and className
 * <HandCard size={40} className="text-warning" />
 */
export const HandCard = createIcon(
  'HandCard',
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
      d='m1.33 9.334 1.702-2.835a2 2 0 0 1 .82-.76l.39-.195a2 2 0 0 1 .896-.212h9.532M5.332 8.667h1.334l1.461-1.46a1.098 1.098 0 0 1 1.69 1.385L7.82 11.585a2.67 2.67 0 0 1-1.313 1.029l-3.843 1.388m4.002-5.335V4.932a1.573 1.573 0 0 1 1.545-1.6h4.914c.868.015 1.56.732 1.544 1.6v2.801a1.573 1.573 0 0 1-1.544 1.6H9.32'
    />
  </svg>,
);
