import { Button, ThemeProvider } from '@ledgerhq/lumen-ui-react';
import { useState } from 'react';

type ColorScheme = 'light' | 'dark';

export function App() {
  const [colorScheme, setColorScheme] = useState<ColorScheme>('light');

  return (
    <ThemeProvider colorScheme='system'>
      <div className='flex h-screen w-screen flex-col items-center justify-center bg-muted'>
        <Button
          onClick={() =>
            setColorScheme(colorScheme === 'light' ? 'dark' : 'light')
          }
        >
          Toggle theme
        </Button>
        <div className='mt-32 flex flex-row gap-2'>
          <Button appearance='accent'>Button</Button>
          <Button appearance='base'>Button</Button>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
