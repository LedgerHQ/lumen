import { Button, ThemeProvider } from '@ledgerhq/lumen-ui-react';
import { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { ChartsPocPage } from './charts-poc';

function Home() {
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>('light');

  return (
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
      <Link
        to='/charts'
        style={{
          marginTop: 32,
          color: 'var(--text-accent)',
          textDecoration: 'underline',
          fontSize: 14,
        }}
      >
        Charts POC &rarr;
      </Link>
    </div>
  );
}

export function App() {
  return (
    <ThemeProvider colorScheme='system'>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/charts' element={<ChartsPocPage />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
