import React, { ReactNode } from 'react';

/**
 * Extracts text from the children of a specific component type.
 *
 * Walks the React element tree looking for `textComponentType` and collects
 * only the string/number content inside it. Returns `""` if no match is found.
 *
 * When `textComponentType` is omitted, returns `""`.
 */
export function extractTextFromChildren(
  children: ReactNode,
  textComponentType?: React.ComponentType<any>,
): string {
  if (!textComponentType) return '';

  let text = '';

  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child)) {
      if (child.type === textComponentType) {
        text += collectText(
          (child.props as { children?: ReactNode })?.children,
        );
      }
    }
  });

  return text;
}

export function collectText(children: ReactNode): string {
  let text = '';

  React.Children.forEach(children, (child) => {
    if (typeof child === 'string' || typeof child === 'number') {
      text += child;
    } else if (React.isValidElement(child)) {
      if ((child.props as { children?: ReactNode })?.children) {
        text += collectText(
          (child.props as { children?: ReactNode })?.children,
        );
      }
    }
  });

  return text;
}
