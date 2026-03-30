import { toPascalCase, useDisabledContext } from '@ledgerhq/lumen-utils-shared';
import React from 'react';
import { SvgProps } from 'react-native-svg';
import { useTheme } from '../../../styles';
import { Icon } from './Icon';
import { IconProps } from './types';

/**
 * Create an Icon component for React Native
 * @param {string} iconName - The name of the icon
 * @param {React.ReactElement} iconJsx - The JSX content of the icon (SVG paths/elements)
 * @returns {FunctionComponent} Icon component
 */
const createIcon = (
  iconName: string,
  iconJsx: React.ReactElement<SvgProps>,
) => {
  const Component = ({ disabled, ...props }: Omit<IconProps, 'children'>) => {
    const { theme } = useTheme();
    const mergedDisabled = useDisabledContext({
      consumerName: iconName,
      mergeWith: { disabled },
    });

    return React.createElement(Icon, {
      viewBox: iconJsx.props.viewBox,
      ...props,
      style: [
        mergedDisabled ? { color: theme.colors.text.disabled } : {},
        props.style,
      ],
      children: iconJsx.props.children,
    });
  };

  Component.displayName = toPascalCase(iconName);

  return Component;
};

// eslint-disable-next-line import/no-default-export
export default createIcon;
