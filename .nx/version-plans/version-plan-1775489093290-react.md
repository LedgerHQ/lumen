---
'@ledgerhq/lumen-ui-react': patch
---

BREAKING_CHANGE(ui-react): update InteractiveIcon to take size and icon props

## Migration Guide

`InteractiveIcon` no longer accepts `children`. Use the `icon` and `size` props instead.

### InteractiveIcon

```diff
- <InteractiveIcon iconType="filled" aria-label="Delete">
-   <DeleteCircleFill size={20} />
- </InteractiveIcon>
+ <InteractiveIcon iconType="filled" icon={DeleteCircleFill} size={20} aria-label="Delete" />
```

### Affected consumers

**MediaBanner**

```diff
- <InteractiveIcon iconType="stroked" appearance="white" aria-label="Close" onClick={onClose}>
-   <Close size={16} />
- </InteractiveIcon>
+ <InteractiveIcon iconType="stroked" appearance="white" icon={Close} size={16} aria-label="Close" onClick={onClose} />
```

**MediaCard**

```diff
- <InteractiveIcon iconType="stroked" appearance="white" aria-label="Close" onClick={onClose}>
-   <Close size={20} />
- </InteractiveIcon>
+ <InteractiveIcon iconType="stroked" appearance="white" icon={Close} size={20} aria-label="Close" onClick={onClose} />
```

**ContentBanner**

```diff
- <InteractiveIcon iconType="stroked" aria-label="Close" onClick={onClose}>
-   <Close size={16} />
- </InteractiveIcon>
+ <InteractiveIcon iconType="stroked" icon={Close} size={16} aria-label="Close" onClick={onClose} />
```