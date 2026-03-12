import React, { ReactNode } from 'react';

/**
 * Recursively searches the React element tree for nodes matching
 * `textComponentType` and collects the string/number content inside them.
 *
 * Non-matching elements are traversed so that `textComponentType` can be
 * found at any depth (e.g. wrapped inside a layout `Box`).
 * Returns `""` when `textComponentType` is omitted or no match is found.
 */
export function extractTextFromChildren(
  children: ReactNode,
  textComponentType?: React.ComponentType<any>,
): string {
  if (!textComponentType) return '';

  let text = '';

  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return;

    if (child.type === textComponentType) {
      text += collectText((child.props as { children?: ReactNode })?.children);
    } else if ((child.props as { children?: ReactNode })?.children) {
      text += extractTextFromChildren(
        (child.props as { children?: ReactNode })?.children,
        textComponentType,
      );
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
