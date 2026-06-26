import createIcon from '../../Components/Icon/createIcon';

/**
 * Apple icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:Apple Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { Apple } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <Apple />
 *
 * @example
 * // With custom size and className
 * <Apple size={40} className="text-warning" />
 */
export const Apple = createIcon(
  'Apple',
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='1em'
    height='1em'
    fill='currentColor'
    viewBox='0 0 16 16'
  >
    <path
      fill='currentColor'
      d='M6 14.56c.32 0 .784-.144 1.088-.272.416-.16.832-.256 1.2-.256.336 0 .72.096 1.168.256.416.176.768.272 1.072.272.416 0 .8-.192 1.168-.528.224-.176.528-.56.896-1.088.272-.368.512-.8.72-1.264l.224-.608c-1.024-.432-1.792-1.408-1.792-2.672-.032-1.088.464-1.936 1.456-2.528-.576-.8-1.392-1.232-2.48-1.312-.432-.032-.928.064-1.504.272-.624.224-1.008.336-1.12.336-.128 0-.48-.096-.976-.304-.544-.176-.944-.272-1.264-.272-.576.016-1.104.144-1.6.448-.512.288-.896.688-1.2 1.216-.384.624-.592 1.392-.592 2.272 0 .752.144 1.552.448 2.384.256.752.592 1.408.992 1.984.4.56.704.928.96 1.136.368.352.752.528 1.136.528M8.016 4.304c0 .08 0 .16.016.24 1.392.128 2.736-1.392 2.736-2.848V1.44a2.6 2.6 0 0 0-1.072.304c-1.024.512-1.68 1.536-1.68 2.56'
    />
  </svg>,
);
