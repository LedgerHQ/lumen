import { Button, ThemeProvider } from '@ledgerhq/lumen-ui-react';
import { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import type { ColorSchemeName } from '@ledgerhq/lumen-ui-react';
import { ChartsPocPage } from './charts-poc';

function Home({
  colorScheme,
  onColorSchemeChange,
}: {
  colorScheme: 'light' | 'dark';
  onColorSchemeChange: (scheme: 'light' | 'dark') => void;
}) {
  return (
    <div className='flex h-screen w-screen flex-col items-center justify-center bg-muted'>
      <Button
        onClick={() =>
          onColorSchemeChange(colorScheme === 'light' ? 'dark' : 'light')
        }
      >
        Toggle theme
      </Button>
      <div className='mt-32 flex flex-row gap-2'>
        <Button appearance='accent'>Button</Button>
        <Button appearance='base'>Button</Button>
      </div>
      <Link to='/charts' className='mt-32 text-accent underline body-2'>
        Charts POC &rarr;
      </Link>
    </div>
  );
}

export function App() {
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>('dark');

  return (
    <ThemeProvider colorScheme={colorScheme as ColorSchemeName}>
      <Routes>
        <Route
          path='/'
          element={
            <Home
              colorScheme={colorScheme}
              onColorSchemeChange={setColorScheme}
            />
          }
        />
        <Route
          path='/charts'
          element={
            <ChartsPocPage
              colorScheme={colorScheme}
              onColorSchemeChange={setColorScheme}
            />
          }
        />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
