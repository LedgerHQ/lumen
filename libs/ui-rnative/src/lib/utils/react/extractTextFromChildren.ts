import React, { ReactNode } from 'react';

/**
 * Recursively extracts text content from React children.
 * Traverses through React elements and collects all string and number values,
 * ignoring complex React components that don't have text children.
 */
type PropsWithChildren = { children?: ReactNode };

export function extractTextFromChildren(
  children: ReactNode,
  textComponentType?: React.ComponentType<any>,
): string {
  let text = '';

  React.Children.forEach(children, (child) => {
    if (typeof child === 'string' || typeof child === 'number') {
      text += child;
    } else if (React.isValidElement<PropsWithChildren>(child)) {
      if (
        (textComponentType && child.type === textComponentType) ||
        child.props.children
      ) {
        text += extractTextFromChildren(
          child.props.children,
          textComponentType,
        );
      }
    }
  });

  return text;
}
