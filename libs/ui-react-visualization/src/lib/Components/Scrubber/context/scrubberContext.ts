import { createSafeContext } from '@ledgerhq/lumen-utils-shared';

import type { ScrubberContextValue } from '../types';

const [ScrubberContextProvider, _useScrubberSafeContext] =
  createSafeContext<ScrubberContextValue>('Scrubber');

export const useScrubberContext = (): ScrubberContextValue =>
  _useScrubberSafeContext({
    consumerName: 'useScrubberContext',
    contextRequired: true,
  });

export { ScrubberContextProvider };
