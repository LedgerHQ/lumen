import createIcon from '../Icon/createIcon';

/**
 * WarningCircleFill icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:WarningCircleFill Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { WarningCircleFill } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <WarningCircleFill />
 *
 * @example
 * // With custom size and className
 * <WarningCircleFill size={40} className="text-warning" />
 */
export const WarningCircleFill = createIcon(
  'WarningCircleFill',
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='1em'
    height='1em'
    fill='currentColor'
    viewBox='0 0 16 16'
  >
    <path
      fill='currentColor'
      d='M8.001 1.35a6.65 6.65 0 0 1 0 13.3A6.647 6.647 0 0 1 1.35 8C1.35 4.32 4.328 1.35 8 1.35M8 10.267a.82.82 0 0 0-.575.241.82.82 0 0 0-.241.576c0 .48.396.81.81.816h.022a.815.815 0 0 0 .797-.732l.004-.084-.005-.08A.82.82 0 0 0 8 10.267m.094.342h.002c-.03-.003-.059-.009-.09-.009zm-.1-6.509a.65.65 0 0 0-.65.65v3.5a.65.65 0 0 0 1.3 0v-3.5a.65.65 0 0 0-.65-.65'
    />
  </svg>,
);
