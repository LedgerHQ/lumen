/**
 * Companion to `main.treeshaking.tsx`.
 *
 * That fixture proves charts stay OUT of a main-barrel bundle. This one proves
 * the `./visualization` subpath actually resolves and carries them — the two
 * assertions are only meaningful together, because an export key that resolves
 * to nothing would satisfy the exclusion check by accident.
 */
import { ThemeProvider } from '@ledgerhq/lumen-ui-react';
import { LineChart } from '@ledgerhq/lumen-ui-react/visualization';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import '../../src/global.css';

const series = [
  { id: 'prices', stroke: '#7B61FF', data: [10, 22, 29, 45, 98, 45, 22] },
];

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(
    <StrictMode>
      <ThemeProvider colorScheme='light'>
        <LineChart series={series} width={320} height={120} />
      </ThemeProvider>
    </StrictMode>,
  );
}
