/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-default-export */
import { Template } from '@svgr/babel-plugin-transform-svg-component';

const template: Template = (variables, { tpl }) => {
  const componentName = variables.componentName;
  const jsDocComment = `
/**
 * ${componentName} icon component for React Native.
 * 
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props (from react-native-svg)
 * and additional size variants defined in the Icon component.
 * 
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [color] - The color of the icon.
 * @param {SVGProps} [...props] - All standard SVG element props (from react-native-svg).
 * 
 * @example
 * // Basic usage with default size (24px)
 * import { ${componentName} } from '@ledgerhq/lumen-ui-rnative/symbols';
 * 
 * <${componentName} />
 * 
 * @example
 * // With custom size and style
 * <${componentName} size={40} color="warning" lx={{ marginTop: 's4' }} />
 * 
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 * 
 * <Button icon={${componentName}} size="md">
 *   Click me
 * </Button>
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
