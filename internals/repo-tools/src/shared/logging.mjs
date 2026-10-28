/** Minimal console helpers so CI output reads consistently across scripts. */

/** @param {string} message */
export const info = (message) => console.log(message);

/** @param {string} message */
export const step = (message) => console.log(`\n${message}`);

/** @param {string} message */
export const ok = (message) => console.log(`  ✓ ${message}`);

/** @param {string} message */
export const skip = (message) => console.log(`  – ${message}`);

/** @param {string} message */
export const fail = (message) => console.error(`  ✗ ${message}`);
