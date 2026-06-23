import createIcon from '../../Components/Icon/createIcon';

/**
 * ListEye icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:ListEye Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { ListEye } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <ListEye />
 *
 * @example
 * // With custom size and className
 * <ListEye size={40} className="text-warning" />
 */
export const ListEye = createIcon(
  'ListEye',
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
      d='M5.333 2.667 6.2 1.583a.65.65 0 0 1 .52-.25h2.553c.2 0 .394.087.52.25l.86 1.084v.666c0 .367-.3.667-.666.667h-4a.664.664 0 0 1-.667-.667v-.666zm0 0H4c-.74 0-1.333.593-1.333 1.333v8.667C2.667 13.4 3.26 14 4 14h4m5.333-6V4c0-.74-.6-1.333-1.333-1.333h-1.333m1.586 9.267c.033.033.033.093 0 .133a.11.11 0 0 1-.14 0 .097.097 0 0 1 0-.14c.033-.04.093-.04.133 0M5.333 9h3.334M5.333 6.667h5.334m-5.334 4.666h1.334M9.84 12.46a.83.83 0 0 1 0-.92c.56-.86 1.453-1.547 2.342-1.547.887 0 1.773.68 2.34 1.54.18.274.18.64 0 .92-.567.855-1.46 1.54-2.347 1.54-.893 0-1.78-.686-2.342-1.54z'
    />
  </svg>,
);
