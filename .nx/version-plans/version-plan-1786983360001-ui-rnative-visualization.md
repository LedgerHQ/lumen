---
'@ledgerhq/lumen-ui-rnative-visualization': patch
---

fix(DonutChart):
- size-specific horizontal padding on center title and description, via useStyleSheet rather than mixed lx/style
- pop active segments via SVG matrix so Android does not flicker a View transform before the ring redraws
- skip no-op segment animations on mount instead of starting a timing animation per shared value
- drop the reveal clip path entirely when the reveal is skipped (Android, reduced motion)

