---
'@ledgerhq/lumen-ui-rnative': patch
---

fix(BaseInput): lay multiline text out on the token line height on iOS so minLines and maxLines stop being a few pixels off per line, recentre the row now that iOS puts that line height's leading above the letters.
