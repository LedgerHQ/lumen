---
'@ledgerhq/lumen-ui-rnative': patch
---

fix(Icon): stop hardcoding strokeWidth on generated icon paths and divide the stroke token by the viewBox render scale so the painted stroke width matches Figma
