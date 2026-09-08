---
'@ledgerhq/lumen-ui-rnative': patch
---

BREAKING_CHANGE(OptionList): rename OptionList to SelectList and subcomponents accordingly

In an effort to standardise naming and align this component with `ui-react`'s Select, `OptionList` has been renamed to `SelectList`. All subcomponents follow the same pattern (e.g. `OptionListItem` -> `SelectListItem`).

To migrate, replace all imports and usages of `OptionList` with `SelectList`. The API is otherwise unchanged. No prop or behaviour differences.