/**
 * Transforms a kebab-case, snake_case, or space-separated string into PascalCase.
 * e.g., 'arrow-up' -> 'ArrowUp'
 */
export function toPascalCase(str: string): string {
  if (!str) return '';
  return str
    .split(/[-_ ]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
}
