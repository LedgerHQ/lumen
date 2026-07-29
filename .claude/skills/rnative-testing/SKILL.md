---
name: rnative-testing
description: >-
  Use when writing or editing React Native tests in libs/ui-rnative (and
  ui-rnative-visualization) — Jest + React Native Testing Library conventions
  (testID targeting, imports, interactions, mocking, structure).
paths: libs/ui-rnative/**/*.test.ts, libs/ui-rnative/**/*.test.tsx, libs/ui-rnative-visualization/**/*.test.ts, libs/ui-rnative-visualization/**/*.test.tsx
---

# React Native testing (`libs/ui-rnative`)

## Testing target elements
- Target root elements using `testID`
- Target content / text when it makes no sense to use `testID`
- Use `getByRole` for semantic elements like switches

## Test runner
- Uses Jest
- Do not expose globals, instead import explicitly:
```ts
import { describe, it, expect, jest } from '@jest/globals';
```

## Rendering
- Every render must be wrapped in `ThemeProvider` — components read theme tokens, so an unwrapped render throws. Use a small `TestWrapper`:
```tsx
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { ThemeProvider } from '../ThemeProvider/ThemeProvider';

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider themes={ledgerLiveThemes} colorScheme='dark' locale='en'>
    {children}
  </ThemeProvider>
);
```
- Import `render`, `fireEvent`, `screen`, `waitFor` from `@testing-library/react-native`.
- Use `waitFor` to assert state that updates after an interaction (e.g. checked state after a press).

## Interactions
- Use `fireEvent.press` for press events
- Use `fireEvent.changeText(input, 'text')` for text inputs
- Use the low-level `fireEvent(element, '<eventName>')` form for non-press events (e.g. `longPress`, `onError`)

## Mocking
- Use `jest.fn()` for callback/handler spies
- Assert with `toHaveBeenCalledTimes`, `toHaveBeenCalledWith`, `not.toHaveBeenCalled`

## Structure
- Top-level `describe('<ComponentName>', () => { ... })`
- Nested `describe` blocks for concern areas: `Rendering`, `Appearances`, `Sizes`, `Interactions`, `States`, `Styling`
- Use `it.each([...])` for parameterized variant/size tests
