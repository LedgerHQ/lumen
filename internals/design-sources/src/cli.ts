import { loadTokenSources } from './tokens/load.js';
import { checkDtcgStandard } from './tokens/standard.js';
import { validateSources } from './tokens/validate.js';

/**
 * `validate`: checks the committed sources, as CI does: our own rules (what
 * the outputs rely on), then the DTCG standard through Terrazzo's parser.
 */
const sources = loadTokenSources();
const { errors, warnings } = validateSources(sources);
const standard = await checkDtcgStandard(sources);

warnings.forEach((warning) => console.warn(`⚠️ ${warning}`));
errors.forEach((error) => console.error(`❌ ${error}`));
standard.forEach((problem) => console.error(`❌ DTCG: ${problem}`));

const failures = errors.length + standard.length;
if (failures) {
  console.error(`\n${failures} problem(s) in the design sources.`);
  process.exit(1);
}
console.log(
  `✅ Design sources are valid DTCG (${warnings.length} naming warning(s)).`,
);
