import { Button, ThemeProvider } from '@ledgerhq/lumen-ui-react';
import { Incognito } from '@ledgerhq/lumen-ui-react/symbols';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import '../../src/global.css';

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(
    <StrictMode>
      <ThemeProvider colorScheme='light'>
        <div className='flex h-screen w-screen flex-col items-center justify-center gap-16 bg-base'>
          <Incognito size={48} />
          <Button appearance='accent'>Tree Shaking Test</Button>
        </div>
      </ThemeProvider>
    </StrictMode>,
  );
}
