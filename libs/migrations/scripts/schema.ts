import semver from 'semver';
import { z } from 'zod';

const kebabCase = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const packageName = String.raw`(?:@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*`;
const modulePath = String.raw`${packageName}(?:\/[\w.-]+)*`;
const name = String.raw`[^\s#.=]+`;

/** The address shape of each surface: `module#Export.member=value`. */
const refShapes = {
  module: new RegExp(`^${modulePath}$`),
  export: new RegExp(`^${modulePath}#${name}$`),
  member: new RegExp(`^${modulePath}#${name}\\.${name}$`),
  value: new RegExp(`^${modulePath}#${name}\\.${name}=\\S+$`),
  token: new RegExp(`^${modulePath}#\\S+$`),
  dependency: new RegExp(`^${packageName}$`),
} as const;

type Surface = keyof typeof refShapes;

function isRegex(pattern: string): boolean {
  try {
    new RegExp(pattern);
    return true;
  } catch {
    return false;
  }
}

const detect = z.strictObject({
  pattern: z.string().min(1).refine(isRegex, 'must be a valid regex'),
  in: z.enum(['source', 'manifests']).default('source'),
  expect: z.enum(['none', 'review']).default('none'),
});

const change = z
  .strictObject({
    change: z.enum(['renamed', 'removed', 'required', 'changed']),
    surface: z.enum(Object.keys(refShapes) as [Surface, ...Surface[]]),
    ref: z.string().min(1),
    to: z.string().min(1).optional(),
    signal: z.enum(['loud', 'silent', 'visual']),
    detect: z.array(detect).nonempty().optional(),
  })
  .superRefine((value, context) => {
    const shape = refShapes[value.surface];
    const addressHint = `must be a ${value.surface} address`;
    if (!shape.test(value.ref)) {
      context.addIssue({ code: 'custom', path: ['ref'], message: addressHint });
    }
    if (value.change === 'renamed' && value.to === undefined) {
      context.addIssue({
        code: 'custom',
        path: ['to'],
        message: 'required when renamed',
      });
    }
    if (value.change !== 'renamed' && value.to !== undefined) {
      context.addIssue({
        code: 'custom',
        path: ['to'],
        message: 'only allowed when renamed',
      });
    }
    if (value.to !== undefined && !shape.test(value.to)) {
      context.addIssue({ code: 'custom', path: ['to'], message: addressHint });
    }
    if (value.signal !== 'loud' && value.detect === undefined) {
      context.addIssue({
        code: 'custom',
        path: ['detect'],
        message: `required when ${value.signal}`,
      });
    }
  });

/**
 * Frontmatter of a migration file. Strict, so the fields derived at release
 * time (id, packages, title, PR, version) can't be written by hand.
 */
export const migrationFrontmatter = z.strictObject({
  changes: z.array(change).nonempty(),
  requires: z
    .record(
      z.string().regex(refShapes.dependency),
      z
        .string()
        .refine(
          (range) => semver.validRange(range) !== null,
          'must be a semver range',
        ),
    )
    .optional(),
  codemod: z.string().regex(kebabCase, 'must be kebab-case').optional(),
  pr: z.number().int().positive().optional(),
});

export type MigrationFrontmatter = z.infer<typeof migrationFrontmatter>;
