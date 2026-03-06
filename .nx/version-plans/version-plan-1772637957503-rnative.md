---
'@ledgerhq/lumen-ui-rnative': patch
---

chore(ui-rnative): remove SubheaderAction

BREAKING CHANGE: SubheaderAction has been removed from both @ledgerhq/lumen-ui-react and @ledgerhq/lumen-ui-rnative.

Migration: To add a trailing action (e.g. "View all"), compose the Subheader with a flex layout and place a Link or Button beside the SubheaderRow instead of using the removed SubheaderAction slot. See the "With action (layout pattern)" section in the Subheader docs for examples.
