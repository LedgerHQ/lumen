# .github/copilot-instructions.md

## Function Parameters

Prefer object parameters for functions with 2 or more arguments to improve readability and extensibility.

## Component Architecture

Extract complex logic into custom hooks for better separation of concerns.
Use intermediate components instead of render functions when rendering conditional JSX.
Use React.memo for components that receive stable props to prevent unnecessary re-renders.
Separate styling concerns from layout and content concerns in component variants.
Use safe context patterns with callbacks for parent-child state synchronization.

## React Patterns

Use `React.ComponentPropsWithRef<"element">` for extending HTML element props in React 19.
Pass `ref` as a prop instead of using `forwardRef` in React 19.
Generate stable keys for list items that don't shift position between renders.

## Code Organization

Move reusable animations into a dedicated animations folder.
Move constants to a constants file within the component folder.
Keep production code in `lib` folder and documentation in `.storybook` or `/docs`.
Import from the closest module path available rather than deeply nested paths.

## Styling

Always pass an object when composing styles to follow Open/Closed principle.
Extract complex conditional style logic into named constants for readability.

## Dependencies

Minimize external library usage to reduce bundle size.
Use lodash-es with proper tree-shaking or implement only needed utility methods.
Prefer Reanimated over Animated API for React Native animations to run on UI thread.

## Naming

Name parent components to reflect their relationship to child components in the hierarchy.
Avoid unnecessary name aliasing in imports and exports.

## Stories and Documentation

Combine related stories instead of creating separate stories for minor variations.
Demonstrate controlled and uncontrolled component patterns in separate stories.
# .github/instructions/react-components.instructions.md
---
applyTo: "**/*.tsx,**/*.ts"
---

## Component Props

Use object parameters with named properties for component props with multiple values.
Extend HTML element props using `React.ComponentPropsWithRef<"element">` syntax.
Move ref and type definitions to dedicated type blocks for clarity.

## Hooks

Extract layout calculations and side effects into dedicated hooks.
Return structured objects from hooks with descriptive property names.

## Performance

Wrap expensive computations in useMemo to prevent unnecessary recalculations.
Use React.memo for components that render lists or receive primitive props.
Compute derived values outside render when dependencies are stable.

## Lists and Keys

Use index-based keys only when list order never changes.
Ensure keys remain stable across re-renders to prevent React reconciliation issues.
# .github/instructions/react-native.instructions.md
---
applyTo: "apps/ui-react-native/**/*.tsx,apps/ui-react-native/**/*.ts"
---

## Animations

Use Reanimated instead of Animated API for UI thread performance.
Extract animation logic into reusable hooks.

## Font Handling

Document font weight mappings explicitly to handle future design token changes.
Avoid tightly coupling font resolution to specific numeric weight values.
# .github/instructions/storybook.instructions.md
---
applyTo: "**/*.stories.tsx,**/*.stories.ts,**/*.mdx"
---

## Story Organization

Combine variant demonstrations into single stories instead of creating many separate stories.
Show controlled patterns with state and callbacks in dedicated controlled examples.
Use uncontrolled patterns with built-in close mechanisms for default examples.

## Documentation

Keep MDX documentation outside the lib folder in .storybook or docs directories.
Remove unused imports from MDX files.
