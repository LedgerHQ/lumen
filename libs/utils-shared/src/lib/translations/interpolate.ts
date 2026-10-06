import type { TranslationParams } from './types';

const PLACEHOLDER_PATTERN = /\{\{\s*(\w+)\s*\}\}/g;

/**
 * Replaces `{{name}}` placeholders with the matching param. A placeholder with
 * no matching param is kept as-is so a missing value stays visible.
 *
 * @example
 * interpolate('Page {{page}}', { page: 3 }); // 'Page 3'
 */
export const interpolate = (
  template: string,
  params?: TranslationParams,
): string => {
  if (!params) {
    return template;
  }

  return template.replace(PLACEHOLDER_PATTERN, (placeholder, name: string) =>
    Object.hasOwn(params, name) ? String(params[name]) : placeholder,
  );
};
