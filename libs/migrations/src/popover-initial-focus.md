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

`PopoverContent` no longer moves focus on open: focus stays on the trigger,
even for content with nothing tabbable (the popup itself used to get focus, so
screen readers announced it). For each `PopoverContent`:

- Content the user acts on right after opening (a field, a search, a list of
  actions): pass `initialFocus` to focus the first tabbable element (the popup
  if there is none), or a ref to focus a specific one.
- Content that only shows information: leave it (the default). Optionally
  pass `initialFocus` to keep it announced on open.

`initialFocus` matches the old behavior for mouse and keyboard only. On touch,
the popup used to get focus; now the first field does and opens the virtual
keyboard. No function form is accepted: if that matters, pass a ref to a
non-field element with `tabIndex={-1}`.

When unsure, leave it.

## Verify

Every `detect` hit reviewed. Open each popover with the keyboard: focus lands
where the user needs it, and Escape returns it to the trigger. Open each one
holding a field by touch on mobile: the keyboard opens only if intended.
