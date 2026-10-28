import { prodConfig } from '../../eslint.config.mjs';
import { defineDependencyChecks } from '../../eslint.shared.mjs';

export default [...prodConfig, defineDependencyChecks()];
