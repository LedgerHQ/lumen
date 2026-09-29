/** Minimal console helpers so CI output reads consistently across scripts.
 * Everything goes to stderr so stdout carries only the report itself and can
 * be piped (`--format json | jq`). */

export function step(message: string): void {
  console.error(`\n${message}`);
}

export function ok(message: string): void {
  console.error(`  ✓ ${message}`);
}

export function warn(message: string): void {
  console.error(`  ! ${message}`);
}
