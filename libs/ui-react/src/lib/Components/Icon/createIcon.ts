import { toPascalCase } from '@ledgerhq/lumen-utils-shared';
import { createElement, SVGProps } from 'react';
import { Icon } from './Icon';
import { IconProps } from './types';

/**
 * Create an Icon component
 *
 * @param iconName - The name of the icon
 * @param iconJsx - The JSX content of the icon
 * @returns Icon component
 */
const createIcon = (
  iconName: string,
  iconJsx: React.ReactElement<SVGProps<SVGSVGElement>>,
) => {
  const Component = ({
    ref,
    className,
    ...props
  }: Omit<IconProps, 'children'> & {
    ref?: React.Ref<SVGSVGElement>;
  }) =>
    createElement(Icon, {
      ref,
      className,
      viewBox: iconJsx.props.viewBox,
      ...props,
      children: iconJsx.props.children,
    });

  Component.displayName = toPascalCase(iconName);

  return Component;
};

export default createIcon;
