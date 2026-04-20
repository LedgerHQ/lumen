import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { render, renderHook } from '@testing-library/react';
import { ReactNode } from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import '@testing-library/jest-dom';

import { ThemeProvider, useTheme } from './ThemeProvider';

const root = document.documentElement;

const setupMatchMedia = (prefersDark: boolean) => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: prefersDark,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
};

beforeEach(() => {
  root.className = '';
});

afterEach(() => {
  root.className = '';
});

describe('ThemeProvider', () => {
  it('applies light class when theme is light', () => {
    render(
      <ThemeProvider themes={ledgerLiveThemes} colorScheme='light'>
        <div data-testid='child' />
      </ThemeProvider>,
    );

    expect(root).toHaveClass('light');
    expect(root).not.toHaveClass('dark');
  });

  it('applies dark class when theme is dark', () => {
    render(
      <ThemeProvider themes={ledgerLiveThemes} colorScheme='dark'>
        <div data-testid='child' />
      </ThemeProvider>,
    );

    expect(root).toHaveClass('dark');
    expect(root).not.toHaveClass('light');
  });

  it('uses system preference when theme is system and prefers dark', () => {
    setupMatchMedia(true);

    render(
      <ThemeProvider themes={ledgerLiveThemes} colorScheme='system'>
        <div data-testid='child' />
      </ThemeProvider>,
    );

    expect(root).toHaveClass('dark');
    expect(root).not.toHaveClass('light');
  });

  it('uses system preference when theme is system and prefers light', () => {
    setupMatchMedia(false);

    render(
      <ThemeProvider themes={ledgerLiveThemes} colorScheme='system'>
        <div data-testid='child' />
      </ThemeProvider>,
    );

    expect(root).toHaveClass('light');
    expect(root).not.toHaveClass('dark');
  });
});

describe('useTheme', () => {
  const createWrapper =
    (colorScheme: 'light' | 'dark') =>
    ({ children }: { children: ReactNode }) => (
      <ThemeProvider themes={ledgerLiveThemes} colorScheme={colorScheme}>
        {children}
      </ThemeProvider>
    );

  it('returns the light theme when colorScheme is light', () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: createWrapper('light'),
    });

    expect(result.current.theme).toBe(ledgerLiveThemes.light);
    expect(result.current.colorScheme).toBe('light');
  });

  it('returns the dark theme when colorScheme is dark', () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: createWrapper('dark'),
    });

    expect(result.current.theme).toBe(ledgerLiveThemes.dark);
    expect(result.current.colorScheme).toBe('dark');
  });

  it('returns system-resolved theme when colorScheme is system', () => {
    setupMatchMedia(true);

    const wrapper = ({ children }: { children: ReactNode }) => (
      <ThemeProvider themes={ledgerLiveThemes} colorScheme='system'>
        {children}
      </ThemeProvider>
    );

    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(result.current.theme).toBe(ledgerLiveThemes.dark);
    expect(result.current.colorScheme).toBe('dark');
  });

  it('throws when used outside ThemeProvider', () => {
    expect(() => renderHook(() => useTheme())).toThrow(
      'useTheme must be used within ThemeProvider',
    );
  });
});
