import {
  cn,
  toPascalCase,
  useDisabledContext,
} from '@ledgerhq/lumen-utils-shared';
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
    disabled,
    ...props
  }: Omit<IconProps, 'children'>) => {
    const mergedDisabled = useDisabledContext({
      consumerName: iconName,
      mergeWith: { disabled },
    });

    return createElement(Icon, {
      ref,
      className: cn(className, mergedDisabled && 'text-disabled'),
      viewBox: iconJsx.props.viewBox,
      ...props,
      children: iconJsx.props.children,
    });
  };

  Component.displayName = toPascalCase(iconName);

  return Component;
};

// eslint-disable-next-line import/no-default-export
export default createIcon;
