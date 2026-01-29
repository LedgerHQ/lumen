import React, { ReactNode } from 'react';

/**
 * Recursively extracts text content from React children.
 * Traverses through React elements and collects all string and number values,
 * ignoring complex React components that don't have text children.
 */
export function extractTextFromChildren(
  children: ReactNode,
  textComponentType?: React.ComponentType<any>,
): string {
  let text = '';

  React.Children.forEach(children, (child) => {
    if (typeof child === 'string' || typeof child === 'number') {
      text += child;
    } else if (React.isValidElement(child)) {
      if (
        (textComponentType && child.type === textComponentType) ||
        (child.props as { children?: ReactNode })?.children
      ) {
        text += extractTextFromChildren(
          (child.props as { children?: ReactNode })?.children,
          textComponentType,
        );
      }
    }
  });

  return text;
}
