---
'@ledgerhq/lumen-ui-react': patch
---

- BREAKING_CHANGE(DialogHeader): rename `appearance` to `density` on `DialogHeader`

  ```diff
  - <DialogHeader appearance="default" />
  + <DialogHeader density="default" />
  ```
