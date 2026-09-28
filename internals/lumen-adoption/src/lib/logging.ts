/** Minimal console helpers so CI output reads consistently across scripts. */

export function step(message: string): void {
  console.log(`\n${message}`);
}

export function ok(message: string): void {
  console.log(`  ✓ ${message}`);
}

export function warn(message: string): void {
  console.warn(`  ! ${message}`);
}
