---
'@ledgerhq/lumen-ui-rnative': patch
---

BREAKING_CHANGE(ui-rnative): add type-safety for compound components

The generics on `OptionList` components now take the value union `T` as the first parameter, followed by `TMeta` (previously `TMeta` was the only parameter).

This enables type-safe `value` inference across the compound components. Normal usage (no explicit type arguments) and the new `createOptionList` factory are unaffected. 

If you previously passed the meta type explicitly, e.g. `OptionListItemData<MyMeta>`, move it to the second slot: `OptionListItemData<string, MyMeta>`.
