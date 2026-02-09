# Lumen AI Rules for Consumers

AI assistant rules to help you use `@ledgerhq/lumen-ui-rnative` correctly in your projects.

## What These Rules Do

These rules help AI assistants:

✅ **Correct imports** - Suggest proper import paths (e.g., `/symbols` for icons)  
✅ **Design tokens** - Use Lumen tokens via the `lx` style system  
✅ **Component catalog** - Know which React Native components are available  
✅ **Style system** - Use the `lx` prop with type-safe design tokens  
✅ **Dark mode** - Understand automatic theme support

## Usage by AI Tool

### Cursor

Add to your project's `.cursorrules` file:

```
@node_modules/@ledgerhq/lumen-ui-rnative/ai-rules/RULES.md
```

Or create `.cursor/rules/lumen-rnative.mdc`:

```markdown
---
description: Lumen UI React Native design system rules
globs:
alwaysApply: true
---

@node_modules/@ledgerhq/lumen-ui-rnative/ai-rules/RULES.md
```

### Claude / Claude Code

Reference the rules file in your conversation:

```
Use the design system rules from: node_modules/@ledgerhq/lumen-ui-rnative/ai-rules/RULES.md
```

Or copy the content from `node_modules/@ledgerhq/lumen-ui-rnative/ai-rules/RULES.md` into your custom instructions.

### VS Code / GitHub Copilot

Add to your workspace settings (`.vscode/settings.json`):

```json
{
  "github.copilot.advanced": {
    "contextFiles": ["node_modules/@ledgerhq/lumen-ui-rnative/ai-rules/RULES.md"]
  }
}
```

### WebStorm / JetBrains AI

Add the file `node_modules/@ledgerhq/lumen-ui-rnative/ai-rules/RULES.md` to your AI Assistant settings under "Additional Context".

### Manual Setup

Copy the rules from `node_modules/@ledgerhq/lumen-ui-rnative/ai-rules/RULES.md` into your preferred AI assistant's configuration.

## Example Results

With these rules, AI assistants will suggest:

```tsx
// ❌ Without rules
import { ArrowRight } from '@ledgerhq/lumen-ui-rnative';
<View style={{ backgroundColor: '#f5f5f5', padding: 16 }}>
  <Text style={{ color: '#666', fontWeight: 'bold' }}>Text</Text>
</View>;

// ✅ With rules
import { ArrowRight } from '@ledgerhq/lumen-ui-rnative/symbols';
<Box lx={{ backgroundColor: 'muted', padding: 16 }}>
  <Text lx={{ color: 'muted', fontSize: 'heading-3' }}>Text</Text>
</Box>;
```

## Auto-Sync Benefits

By referencing the file from node_modules instead of copying:

- ✅ Always get the latest rules when you update the package
- ✅ No manual copy/paste needed
- ✅ Consistent across your team
- ✅ Rules are version-locked with your package version

## Learn More

- [Lumen Documentation](https://ldls.vercel.app)
- [Package README](../README.md)
- [Main Repository](https://github.com/LedgerHQ/lumen)
