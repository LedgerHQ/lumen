/* eslint-disable import/no-default-export */
import type { Template } from '@svgr/babel-plugin-transform-svg-component';

const template: Template = (variables, { tpl }) => {
  const componentName = variables.componentName;

  const jsDocComment = `
/**
 * ${componentName} icon component.
 * 
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 * 
 * @see {@link https://ldls.vercel.app/?path=/story/symbols-interface-icons--icon&args=name:${componentName} Storybook}
 * 
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 * 
 * @example
 * // Basic usage with default size (24px)
 * import { ${componentName} } from '@ledgerhq/lumen-ui-react/symbols';
 * 
 * <${componentName} />
 * 
 * @example
 * // With custom size and className
 * <${componentName} size={40} className="text-warning" />
 */
`;

  return tpl`
${variables.imports};
import createIcon from '../../Components/Icon/createIcon';

${variables.interfaces};

${jsDocComment}
export const ${variables.componentName} = createIcon('${variables.componentName}', ${variables.jsx});
`;
};

export default template;
