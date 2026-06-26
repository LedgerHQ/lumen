import createIcon from '../../Components/Icon/createIcon';

/**
 * Flex icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:Flex Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { Flex } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <Flex />
 *
 * @example
 * // With custom size and className
 * <Flex size={40} className="text-warning" />
 */
export const Flex = createIcon(
  'Flex',
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='1em'
    height='1em'
    fill='currentColor'
    viewBox='0 0 16 16'
  >
    <path
      fill='currentColor'
      d='M12.017 14v.65h1.3V14h-1.3m-9.334 0v.65h1.3V14h-1.3m2.817-.65h-.65v1.3h.65v-1.3m5 1.3h.65v-1.3h-.65v1.3m-5-1.967a.65.65 0 1 0 0 1.3v-1.3m5 1.3a.65.65 0 1 0 0-1.3v1.3m2.167.017h.65V6.667h-1.3V14zm0-7.333h.65v-2h-1.3v2zm0-2h.65V4h-1.3v.667zm-2-2.667v-.65H5.333v1.3h5.334zM3.333 4h-.65v10h1.3V4zm2-2v-.65A2.65 2.65 0 0 0 2.683 4h1.3c0-.746.605-1.35 1.35-1.35zm7.334 2h.65a2.65 2.65 0 0 0-2.65-2.65v1.3c.745 0 1.35.604 1.35 1.35zm0 .667v.65h.466v-1.3h-.466zm.6.133h-.65v1.733h1.3V4.8zm-.134 1.867v-.65h-.466v1.3h.466zm.134-.134h-.65c0-.285.231-.516.516-.516v1.3c.433 0 .784-.351.784-.784zm-.134-1.866v.65a.517.517 0 0 1-.516-.517h1.3a.783.783 0 0 0-.784-.783zM5.5 14v.65h5v-1.3h-5zm0-.667v.65h5v-1.3h-5z'
    />
  </svg>,
);
