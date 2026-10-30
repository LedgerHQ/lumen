/** Minimal console helpers so CI output reads consistently across scripts. */

export const info = (message: string): void => console.log(message);

export const step = (message: string): void => console.log(`\n${message}`);

export const ok = (message: string): void => console.log(`  ✓ ${message}`);

export const skip = (message: string): void => console.log(`  – ${message}`);

export const fail = (message: string): void => console.error(`  ✗ ${message}`);
