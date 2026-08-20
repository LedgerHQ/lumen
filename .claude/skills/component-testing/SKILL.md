---
name: component-testing
description: >-
  Use when writing or editing component tests in libs/ui-react or
  libs/ui-rnative (and their visualization libs) — shared structure and coverage
  conventions, plus the per-platform runner: Vitest + React Testing Library on
  web, Jest + React Native Testing Library on RN. Load this before writing tests.
paths: libs/ui-react/**/*.test.tsx, libs/ui-react/**/*.test.ts, libs/ui-react-visualization/**/*.test.tsx, libs/ui-rnative/**/*.test.tsx, libs/ui-rnative/**/*.test.ts, libs/ui-rnative-visualization/**/*.test.tsx
---

# Component testing

Same testing philosophy on both platforms; the runner and rendering harness
differ. Read the shared conventions, then the section for the lib you're in
(derive it from the path — see the `Libraries` table in `AGENTS.md`).

## Shared conventions (both platforms)

- **Import test globals explicitly** — do not rely on ambient globals.
- **Prefer callback/handler spies** for interactions and assert with
  `toHaveBeenCalledTimes`, `toHaveBeenCalledWith`, `not.toHaveBeenCalled`.
- **Cover the behaviour, not the implementation**: rendering, interaction,
  controlled state, callbacks, and the disabled state.
- **Structure**: a single top-level `describe('<ComponentName>')`. Use flat
  `it('should …')` cases for simple components; nest `describe` blocks by concern
  (`Rendering`, `Appearances`, `Sizes`, `Interactions`, `States`, `Styling`) for
  richer components, and `it.each([...])` for variant/size matrices.
- **No snapshot tests** unless there's a clear reason.

## React web (`libs/ui-react`, `libs/ui-react-visualization`)

Runner: **Vitest** + React Testing Library.

- Globals: `import { describe, it, expect, vi } from 'vitest';` and
  `import '@testing-library/jest-dom';`.
- Render: `import { render, screen, fireEvent } from '@testing-library/react';` —
  render directly with `render(<Component />)`, **no wrapper**.
- Queries: prefer accessible ones (`getByRole`, `getByLabelText`, `getByText`);
  `data-testid` only when nothing accessible applies.
- Interactions: `fireEvent` for simple click/change; `userEvent` from
  `@testing-library/user-event` for typing / keyboard / focus.
- Spies: `vi.fn()`.

## React Native (`libs/ui-rnative`, `libs/ui-rnative-visualization`)

Runner: **Jest** + React Native Testing Library.

- Globals: `import { describe, it, expect, jest } from '@jest/globals';`.
- Render: `render`, `fireEvent`, `screen`, `waitFor` from
  `@testing-library/react-native`. **Every render must be wrapped in a
  `ThemeProvider`** — components read theme tokens, so an unwrapped render
  throws. Use a small `TestWrapper`:

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

- Queries: target root elements via `testID`; text when `testID` doesn't fit;
  `getByRole` for semantic elements like switches.
- Interactions: `fireEvent.press`, `fireEvent.changeText(input, 'text')`, and the
  low-level `fireEvent(element, '<eventName>')` form for non-press events
  (`longPress`, `onError`). Use `waitFor` for state that updates after an
  interaction.
- Spies: `jest.fn()`.

## Review checks

Rules verifiable from a diff.

| Check | Applies to | Detect | Skip |
| --- | --- | --- | --- |
| Wrong runner API for the lib | both | `jest.fn()`/`@jest/globals` in a `ui-react` test; `vi.fn()`/`vitest` in a `ui-rnative` test | — |
| RN render not wrapped in `ThemeProvider` | rnative | `render(<…/>)` without a themed wrapper | — |
| `data-testid`/`testID` used where an accessible query fits | both | `getByTestId` on a role-bearing element | root nodes with no accessible role |
| Snapshot test with no justification | both | `toMatchSnapshot()` | intentional, commented snapshots |
| Missing coverage of the disabled/controlled path on an interactive component | both | no test touching `disabled`/controlled state | non-interactive components |
