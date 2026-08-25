---
'@ledgerhq/lumen-ui-rnative': patch
---

refactor(BaseInput): split the label, helper text and counter into their own files and extract the value/clear logic into useBaseInputValue

fix(TextInput): call onChangeText('') on uncontrolled clear so RN matches web.