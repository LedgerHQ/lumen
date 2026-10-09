---
'@ledgerhq/lumen-ui-react': patch
---

fix(ui-react): Popover, Tooltip, Select and Menu now slide out of their trigger

Enter/exit animations were inverted (e.g. content placed below the trigger slid up into place). They now follow the rendered `data-side`, so the content always originates from the trigger, including when it flips sides to avoid a collision.
