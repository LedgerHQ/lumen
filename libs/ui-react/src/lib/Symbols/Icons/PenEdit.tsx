import createIcon from '../../Components/Icon/createIcon';

/**
 * PenEdit icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:PenEdit Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { PenEdit } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <PenEdit />
 *
 * @example
 * // With custom size and className
 * <PenEdit size={40} className="text-warning" />
 */
export const PenEdit = createIcon(
  'PenEdit',
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
      d='m9.167 4.773 2.06 2.06m-7.7 3.574 6.88-6.887c.26-.26.68-.26.94 0l1.113 1.113c.26.26.26.68 0 .94L5.573 12.46a.7.7 0 0 1-.473.194H3.313v-1.787a.66.66 0 0 1 .194-.473z'
    />
  </svg>,
);
