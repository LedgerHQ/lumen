import { ThemeProvider } from '@ledgerhq/lumen-ui-react';
import { LottieView } from '@ledgerhq/lumen-ui-react/lottie';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import '../../src/global.css';

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(
    <StrictMode>
      <ThemeProvider colorScheme='light'>
        <LottieView animation='/success.lottie' />
      </ThemeProvider>
    </StrictMode>,
  );
}
