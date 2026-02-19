import createIcon from '../../Components/Icon/createIcon';

/**
 * Mailbox icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/symbols-interface-icons--icon&args=name:Mailbox Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { Mailbox } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <Mailbox />
 *
 * @example
 * // With custom size and className
 * <Mailbox size={40} className="text-warning" />
 */
export const Mailbox = createIcon(
  'Mailbox',
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
      d='M9.038 4.332 7.74 5.628l-.778-.778m-.964 2.817h4.002M3.33 9.334V3.33c0-.736.598-1.333 1.334-1.333h6.67c.736 0 1.334.597 1.334 1.333v6.003M1.998 12.669v-2.335a1 1 0 0 1 1-1H4.25a1 1 0 0 1 .707.293l.651.65c.25.25.589.39.942.39h2.897c.354 0 .693-.14.944-.39l.553-.553c.25-.25.588-.39.942-.39h1.115a1 1 0 0 1 1 1v2.335c0 .736-.597 1.333-1.333 1.333H3.33a1.334 1.334 0 0 1-1.333-1.333'
    />
  </svg>,
);
