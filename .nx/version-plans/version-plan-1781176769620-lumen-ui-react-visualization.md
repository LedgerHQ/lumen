---
'@ledgerhq/lumen-ui-react-visualization': patch
---

fix(RevealAnimation): reveal points via opacity fade instead of clip-path, it fixes the overflow issue
refactor(charts): remove the overflow_buffer

Rename RevealClip to RevealAnimationProvider with usePathReveal and usePointReveal hooks. Line keeps the clip-path wipe; Point and labels fade in without clipping so edge content stays visible after the enter animation.
