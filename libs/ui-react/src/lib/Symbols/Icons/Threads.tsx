import createIcon from '../../Components/Icon/createIcon';

/**
 * Threads icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:Threads Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { Threads } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <Threads />
 *
 * @example
 * // With custom size and className
 * <Threads size={40} className="text-warning" />
 */
export const Threads = createIcon(
  'Threads',
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='1em'
    height='1em'
    fill='currentColor'
    viewBox='0 0 16 16'
  >
    <path
      fill='currentColor'
      d='M11.338 7.489a5 5 0 0 0-.183-.084c-.108-1.99-1.192-3.13-3.012-3.142h-.025c-1.088 0-1.994.466-2.55 1.315l1 .689c.416-.634 1.07-.77 1.55-.77h.018c.599.005 1.051.18 1.344.52q.32.374.426 1.025a7.6 7.6 0 0 0-1.72-.083c-1.731.1-2.843 1.113-2.769 2.52.038.715.393 1.329.998 1.73.512.34 1.171.505 1.857.468.905-.05 1.615-.397 2.11-1.03.376-.482.614-1.105.72-1.891.43.261.75.605.927 1.018.3.703.317 1.857-.621 2.799-.822.824-1.811 1.18-3.305 1.192-1.657-.013-2.91-.546-3.725-1.586C3.615 11.206 3.221 9.8 3.206 8c.015-1.8.41-3.206 1.172-4.18.815-1.039 2.068-1.572 3.725-1.585 1.67.013 2.944.549 3.79 1.593.415.513.728 1.157.934 1.908L14 5.422q-.375-1.389-1.178-2.382C11.737 1.7 10.152 1.014 8.107 1H8.1c-2.04.014-3.608.703-4.661 2.047C2.5 4.244 2.016 5.908 2 7.995v.01c.016 2.086.5 3.751 1.438 4.948C4.49 14.297 6.06 14.986 8.099 15h.008c1.814-.013 3.092-.49 4.145-1.545 1.377-1.381 1.336-3.113.882-4.176-.326-.762-.947-1.381-1.796-1.79m-3.131 2.954c-.758.043-1.546-.299-1.585-1.03-.03-.543.384-1.149 1.631-1.22q.214-.013.421-.013c.453 0 .877.044 1.262.129-.144 1.8-.987 2.093-1.73 2.134'
    />
  </svg>,
);
