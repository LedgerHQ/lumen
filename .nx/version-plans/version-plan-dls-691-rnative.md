---
'@ledgerhq/lumen-ui-rnative': patch
---

- BREAKING_CHANGE(NavBar/BottomSheetHeader): rename `appearance` to `density` on `NavBar` and `BottomSheetHeader`

  ```diff
  - <NavBar appearance="default" />
  + <NavBar density="default" />

  - <BottomSheetHeader appearance="default" />
  + <BottomSheetHeader density="default" />
  ```
