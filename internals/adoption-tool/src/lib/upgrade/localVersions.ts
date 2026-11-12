// Target versions of an upgrade run, read from the libs in this checkout.
import { readFileSync } from 'node:fs';
import { LUMEN_PACKAGES, type LumenPackage } from '../../config.js';

/**
 * Not the npm registry: right after a release it is a mirror of the internal
 * one and can still serve the previous `latest`, which would "upgrade"
 * consumers to the version they already have. The release commit on main
 * already holds the version just published.
 */
export function readLocalVersions(): Record<LumenPackage, string> {
  return Object.fromEntries(
    LUMEN_PACKAGES.map((pkg) => {
      const dir = pkg.replace('@ledgerhq/lumen-', '');
      const manifest = JSON.parse(
        readFileSync(`libs/${dir}/package.json`, 'utf-8'),
      ) as { version: string };
      return [pkg, manifest.version] as const;
    }),
  ) as Record<LumenPackage, string>;
}
