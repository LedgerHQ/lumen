---
'@ledgerhq/lumen-ui-rnative-visualization': patch
---

fix(DonutChart):
- size-specific horizontal padding on center title and description
- pop active segments via SVG matrix so Android does not flicker a View transform before the ring redraws

