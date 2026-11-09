---
changes:
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#PopoverContent.initialFocus'
    signal: silent # opening a popover no longer moves focus into it
    detect:
      - { pattern: '<PopoverContent\b', expect: review }
pr: 644
---

## Before → after

```tsx before
<Popover>
  <PopoverTrigger render={<Button>Rename</Button>} />
  <PopoverContent>
    <TextInput label='Name' />
  </PopoverContent>
</Popover>
```

```tsx after
<Popover>
  <PopoverTrigger render={<Button>Rename</Button>} />
  <PopoverContent initialFocus>
    <TextInput label='Name' />
  </PopoverContent>
</Popover>
```

## Decide

`PopoverContent` no longer moves focus on open: focus stays on the trigger.
For each `PopoverContent`:

- Content the user acts on right after opening (a field, a search, a list of
  actions): pass `initialFocus` to focus the first tabbable element, or a ref
  to focus a specific one.
- Content that only shows information: leave it (the default).

When unsure, leave it.

## Verify

Every `detect` hit reviewed. Open each popover with the keyboard: focus lands where the
user needs it, and Escape returns it to the trigger.
