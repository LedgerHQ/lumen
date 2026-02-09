import createIcon from '../../Components/Icon/createIcon';

/**
 * InfiniteFill icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/symbols-interface-icons--icon&args=name:InfiniteFill Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { InfiniteFill } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <InfiniteFill />
 *
 * @example
 * // With custom size and className
 * <InfiniteFill size={40} className="text-warning" />
 */
export const InfiniteFill = createIcon(
  'InfiniteFill',
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='1em'
    height='1em'
    fill='currentColor'
    viewBox='0 0 16 16'
  >
    <path
      fill='currentColor'
      d='M8.032 2.032a6 6 0 1 1-.001 12 6 6 0 0 1 0-12m2.593 3.307c-1.342 0-2.063 1.058-2.383 1.514a.7.7 0 0 0-.07.132 8 8 0 0 0-.731-.745c-.476-.417-1.173-.902-1.946-.902l-.001.001h-.001c-1.39-.002-2.32 1.31-2.32 2.661s.93 2.663 2.319 2.662v-.002l.003.002c1.383 0 2.19-1.008 2.56-1.496a.7.7 0 0 0 .071-.124c.18.22.399.47.644.702.437.412 1.102.918 1.855.918v-.002l.002.002c.671 0 1.236-.355 1.612-.842.375-.487.588-1.133.588-1.82 0-1.301-.836-2.663-2.2-2.662zm-5.13 1.3.106.009c.258.042.6.233.982.57.358.313.664.677.85.915a.65.65 0 0 0-.415.248c-.365.482-.821.972-1.508.98h-.026c-.452-.005-1.01-.494-1.011-1.36 0-.818.496-1.3.933-1.357l.086-.005zm5.133 0c.35 0 .9.441.9 1.361 0 .424-.133.785-.319 1.026-.182.236-.389.332-.57.335q-.016-.001-.031-.001c-.213-.01-.545-.183-.945-.56a7 7 0 0 1-.8-.932.65.65 0 0 0 .443-.268c.36-.512.72-.95 1.297-.96zM8.644 8.034h-.002l.004-.011z'
    />
  </svg>,
);
