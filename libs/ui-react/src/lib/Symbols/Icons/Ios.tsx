import createIcon from '../../Components/Icon/createIcon';

/**
 * Ios icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:Ios Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { Ios } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <Ios />
 *
 * @example
 * // With custom size and className
 * <Ios size={40} className="text-warning" />
 */
export const Ios = createIcon(
  'Ios',
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='1em'
    height='1em'
    fill='currentColor'
    viewBox='0 0 16 16'
  >
    <path
      fill='currentColor'
      d='M8.021 8.006c0-.97-.463-1.584-1.188-1.584-.729 0-1.189.614-1.189 1.584 0 .967.46 1.581 1.189 1.581.725 0 1.188-.614 1.188-1.581'
    />
    <path
      fill='currentColor'
      fillRule='evenodd'
      d='M4.5 1.5a3 3 0 0 0-3 3v7a3 3 0 0 0 3 3h7a3 3 0 0 0 3-3v-7a3 3 0 0 0-3-3zm-.008 8.678H3.79V6.985h.702zm.04-4.018a.397.397 0 0 1-.392.406.396.396 0 0 1-.39-.406c0-.23.172-.41.39-.41.22 0 .392.18.392.41m.367 1.846c0-1.383.745-2.247 1.934-2.247 1.185 0 1.93.864 1.93 2.247s-.745 2.244-1.93 2.244c-1.189 0-1.934-.861-1.934-2.244m5.745 2.244c-.937 0-1.553-.494-1.584-1.295h.706c.045.4.42.662.917.662.491 0 .833-.259.833-.62 0-.313-.209-.494-.723-.623l-.527-.133c-.751-.184-1.107-.57-1.107-1.19 0-.77.63-1.292 1.516-1.292.897 0 1.49.518 1.507 1.283h-.694c-.034-.406-.353-.65-.819-.65-.46 0-.77.24-.77.602 0 .29.206.458.705.584l.469.115c.827.202 1.177.566 1.177 1.214 0 .825-.621 1.343-1.606 1.343'
      clipRule='evenodd'
    />
  </svg>,
);
