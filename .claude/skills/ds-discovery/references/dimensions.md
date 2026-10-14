# Dimensions per question type

Use the set for the request's main type, and borrow from another set when the
question mixes them. These dimensions become the comparison-table columns, so
keep each finding to one line.

## New component

| Dimension | What to look for | For |
|---|---|---|
| Purpose | When to use it, when not to, which alternatives the system points to | Design |
| Anatomy | Parts and what each is called | Both |
| Variants & sizes | Names and how many | Both |
| States | Hover, focus, disabled, loading, error, selected, read-only | Both |
| API | Props (name, type, default), controlled/uncontrolled pairs, event naming | Engineering |
| Composition | Compound parts vs props, slots, element override (`render` / `asChild`) | Engineering |
| Behaviour | Keyboard, focus management, dismissal, selection model | Both |
| Accessibility | APG pattern, labelling, live announcements | Both |
| Responsiveness | Changes per breakpoint, overflow handling, touch-target size | Both |
| Motion | Transitions, durations, reduced-motion handling | Both |
| Content | Label length, casing, truncation, i18n and RTL | Design |
| Platforms | React Native equivalent, and how it differs from web | Engineering |
| Maturity | Stable, beta, pre-1.0, preview or draft spec: how much weight the finding deserves | Both |

## Naming (component, prop or token)

- **Term per system**: the name, plus the concept it covers. Check that the
  concepts really match, not only the words.
- **Consensus vs outliers**.
- **Lumen fit**:
  - conflicts with names already in `libs/`;
  - the prop-naming rules in the `component-architecture` skill;
  - whether the name works on both platforms.
- **Recommendation**: one name, plus the rejected alternatives and why.

## Pattern (composition, when to split, a11y, responsiveness, motion)

- **Rule**: what each system states, with the link.
- **Criteria**: what drives the decision, e.g. parts reused on their own, shared
  state, how independently consumers need to style them.
- **Examples** from their catalogue.
- **Anti-patterns** they call out.
- **Lumen today**: where it already follows or breaks the pattern.

## Token

- **Tiers**: primitive, semantic, component. Which tier do consumers use?
- **Naming grammar** (e.g. `category-property-variant-state`), with real examples.
- **Scales**: the steps and their values (spacing, radius, type, motion).
- **Theming**: which modes exist (light/dark, brands) and how they switch.
- **Outputs**: CSS variables, JS, native, each mapped to `libs/design-core`.
