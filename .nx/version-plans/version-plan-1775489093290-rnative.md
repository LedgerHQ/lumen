---
'@ledgerhq/lumen-ui-rnative': patch
---

BREAKING_CHANGE(ui-rnative): update InteractiveIcon to take size and icon props

## Migration Guide

`InteractiveIcon` no longer accepts `children`. Use the `icon` and `size` props instead. The `hitSlopType` prop now uses the `size` prop directly instead of parsing the children tree.

### InteractiveIcon

```diff
- <InteractiveIcon iconType="filled" accessibilityLabel="Delete" onPress={handleDelete}>
-   <DeleteCircleFill size={20} />
- </InteractiveIcon>
+ <InteractiveIcon iconType="filled" icon={DeleteCircleFill} size={20} accessibilityLabel="Delete" onPress={handleDelete} />
```

### Affected consumers

**MediaBanner**

```diff
- <InteractiveIcon iconType="stroked" appearance="white" accessibilityLabel="Close" onPress={onClose}>
-   <Close size={16} />
- </InteractiveIcon>
+ <InteractiveIcon iconType="stroked" appearance="white" icon={Close} size={16} accessibilityLabel="Close" onPress={onClose} />
```

**MediaCard**

```diff
- <InteractiveIcon iconType="stroked" appearance="white" accessibilityLabel="Close" onPress={onClose}>
-   <Close size={20} />
- </InteractiveIcon>
+ <InteractiveIcon iconType="stroked" appearance="white" icon={Close} size={20} accessibilityLabel="Close" onPress={onClose} />
```

**ContentBanner**

```diff
- <InteractiveIcon iconType="stroked" accessibilityLabel="Close" onPress={onClose}>
-   <Close size={16} />
- </InteractiveIcon>
+ <InteractiveIcon iconType="stroked" icon={Close} size={16} accessibilityLabel="Close" onPress={onClose} />
```