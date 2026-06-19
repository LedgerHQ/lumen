---
'@ledgerhq/lumen-ui-react': patch
---

feat(ui-react): add type-safety for compound components

Note: the generics on `Select` components now take the value union `T` as the first parameter, followed by `TMeta` (previously `TMeta` was the only parameter).

This enables type-safe `value` inference across the compound components. Normal usage (no explicit type arguments) and the new `createSelect` factory are unaffected.

If you previously passed the meta type explicitly, e.g. `SelectItemData<MyMeta>`, move it to the second slot: `SelectItemData<string, MyMeta>`.
