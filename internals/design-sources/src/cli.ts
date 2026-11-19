import { createIconModel, IconValidationError } from './icons/model.js';
import { loadTokenSources } from './tokens/load.js';
import { checkDtcgStandard } from './tokens/standard.js';
import { validateSources } from './tokens/validate.js';

/**
 * `validate`: checks the committed sources, as CI does. Tokens: our own rules
 * (what the outputs rely on), then the DTCG standard through Terrazzo's
 * parser. Icons: what the generated components rely on.
 */
const sources = loadTokenSources();
const { errors, warnings } = validateSources(sources);
const standard = await checkDtcgStandard(sources);

const icons = { errors: [] as string[], warnings: [] as string[] };
try {
  icons.warnings = createIconModel().warnings;
} catch (error) {
  if (!(error instanceof IconValidationError)) throw error;
  icons.errors = error.errors;
}

[...warnings, ...icons.warnings].forEach((warning) =>
  console.warn(`⚠️ ${warning}`),
);
[...errors, ...icons.errors].forEach((error) => console.error(`❌ ${error}`));
standard.forEach((problem) => console.error(`❌ DTCG: ${problem}`));

const failures = errors.length + icons.errors.length + standard.length;
if (failures) {
  console.error(`\n${failures} problem(s) in the design sources.`);
  process.exit(1);
}
console.log(
  `✅ Design sources are valid (${warnings.length + icons.warnings.length} warning(s)).`,
);
