import createIcon from '../../Components/Icon/createIcon';

/**
 * Macos icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:Macos Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { Macos } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <Macos />
 *
 * @example
 * // With custom size and className
 * <Macos size={40} className="text-warning" />
 */
export const Macos = createIcon(
  'Macos',
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='1em'
    height='1em'
    fill='currentColor'
    viewBox='0 0 16 16'
  >
    <path
      fill='currentColor'
      d='M5.772 8.685c0 .146.125.238.312.238.244 0 .44-.158.44-.372v-.136L6.1 8.44c-.208.014-.328.104-.328.245M10.905 8c0-.54-.284-.881-.73-.881s-.729.342-.729.882c0 .538.283.88.73.88.445 0 .729-.342.729-.88'
    />
    <path
      fill='currentColor'
      fillRule='evenodd'
      d='M4.5 1.5a3 3 0 0 0-3 3v7a3 3 0 0 0 3 3h7a3 3 0 0 0 3-3v-7a3 3 0 0 0-3-3zM2.931 9.21H2.5V7.432h.414v.309h.009a.54.54 0 0 1 .523-.342c.26 0 .445.129.513.357h.01c.088-.22.307-.357.572-.357.362 0 .599.236.599.592V9.21h-.431V8.093c0-.218-.118-.342-.33-.342-.207 0-.35.148-.35.36V9.21H3.61V8.07c0-.198-.124-.32-.325-.32-.208 0-.354.156-.354.37zm3.595-.284c-.106.193-.336.312-.572.312-.355 0-.613-.216-.613-.536 0-.316.251-.505.698-.532l.485-.027v-.127c0-.186-.13-.294-.343-.294-.204 0-.334.096-.362.244h-.4c.019-.332.312-.57.78-.57.455 0 .751.233.751.59V9.21h-.416v-.284zm1.503-1.53c.485 0 .785.296.815.67h-.407a.385.385 0 0 0-.402-.332c-.272 0-.447.221-.447.587 0 .372.176.587.45.587.218 0 .36-.12.4-.322h.407c-.034.397-.351.659-.812.659-.537 0-.884-.347-.884-.924 0-.568.347-.925.88-.925M8.99 8c0-.77.457-1.251 1.187-1.251.727 0 1.185.481 1.185 1.25 0 .77-.458 1.25-1.185 1.25-.73 0-1.187-.48-1.187-1.25m3.525 1.249c-.575 0-.952-.275-.971-.721h.433c.027.223.258.369.563.369.301 0 .51-.144.51-.346 0-.174-.128-.274-.443-.347l-.324-.073c-.46-.103-.679-.317-.679-.663 0-.429.386-.719.93-.719.551 0 .915.288.925.714h-.426c-.02-.226-.216-.362-.502-.362-.282 0-.473.134-.473.335 0 .161.127.255.433.326l.288.063c.507.113.722.316.722.676 0 .46-.381.748-.986.748'
      clipRule='evenodd'
    />
  </svg>,
);
