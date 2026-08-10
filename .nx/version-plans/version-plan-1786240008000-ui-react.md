---
'@ledgerhq/lumen-ui-react': patch
---

fix(Button): default native buttons (`BaseButton`, `MediaButton`, `CardButton`) to `type="button"` so they no longer accidentally submit a surrounding `<form>`; callers can still opt into `type="submit"`/`"reset"`, and `asChild` renders are left untouched
