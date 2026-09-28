# Timeline API

- **Date:** 2026-09-27
- **References:**
  - [Figma — Timeline](https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7/2.-Components-Library?node-id=21938-58196)
  - [ReUI Timeline](https://reui.io/docs/components/base/timeline)

## Usage

Neutral timeline. Omit both step props: filled dot, base title, plain line.

```tsx
<Timeline>
  <TimelineItem>
    <TimelineItemHeader>
      <TimelineItemContent>
        <TimelineItemDate>12 Mar 2024</TimelineItemDate>
        <TimelineItemContentRow>
          <TimelineItemTitle>Payment confirmed</TimelineItemTitle>
          <Tag appearance="success" size="sm" label="Confirmed" />
        </TimelineItemContentRow>
        <TimelineItemDescription>Confirmed on device</TimelineItemDescription>
      </TimelineItemContent>
      <TimelineItemTrailing>
        <AmountDisplay value="0.42" currency="ETH" />
      </TimelineItemTrailing>
    </TimelineItemHeader>
    <TimelineItemDetails>Viewed in Ledger Live.</TimelineItemDetails>
  </TimelineItem>
</Timeline>
```

Progress track. An item is completed when `step <= currentStep`.

```tsx
<Timeline currentStep={step} onCurrentStepChange={setStep}>
  <TimelineItem step={1}>
    <TimelineItemHeader>
      <TimelineItemContent>
        <TimelineItemTitle>Payment confirmed</TimelineItemTitle>
      </TimelineItemContent>
    </TimelineItemHeader>
  </TimelineItem>

  <TimelineItem step={2} expandable expanded={open} onExpandedChange={setOpen}>
    <TimelineItemHeader>
      <TimelineItemContent>
        <TimelineItemTitle>Broadcasting</TimelineItemTitle>
      </TimelineItemContent>
    </TimelineItemHeader>
    <TimelineItemDetails>Waiting for the network.</TimelineItemDetails>
  </TimelineItem>

  <TimelineItem step={3} status="error">
    <TimelineItemHeader>
      <TimelineItemContent>
        <TimelineItemTitle>Rejected</TimelineItemTitle>
      </TimelineItemContent>
    </TimelineItemHeader>
  </TimelineItem>
</Timeline>
```

`defaultCurrentStep` is the uncontrolled form. The timeline holds the step and reports changes through `onCurrentStepChange`.

```tsx
<Timeline defaultCurrentStep={2}>
  <TimelineItem step={1}>...</TimelineItem>
  <TimelineItem step={2}>...</TimelineItem>
</Timeline>
```

## Timeline

| Prop | Type | Default |
| --- | --- | --- |
| `currentStep` | `number` | — |
| `defaultCurrentStep` | `number` | — |
| `onCurrentStepChange` | `(currentStep: number) => void` | — |
| `children` | `ReactNode` | required |

Omit `currentStep` and `defaultCurrentStep` for the neutral timeline. Pass `currentStep` when the parent owns the step. Pass `defaultCurrentStep` for the initial step when the timeline owns it.

A completed item uses the success icon, the base title, and a done line leading into it. Later items use the empty circle, a muted title, and a muted line. `currentStep={0}` is a progress track with nothing completed.

## TimelineItem

| Prop | Type | Default |
| --- | --- | --- |
| `step` | `number` | — |
| `status` | `'todo' \| 'success' \| 'error' \| 'pending' \| 'loading'` | — |
| `expandable` | `boolean` | `false` |
| `expanded` | `boolean` | — |
| `defaultExpanded` | `boolean` | `false` |
| `onExpandedChange` | `(expanded: boolean) => void` | — |
| `children` | `ReactNode` | required |

`step` is required when the timeline has a current step. `status` replaces the derived icon for error, pending, and loading. The line still follows `currentStep`.

`expandable` adds a chevron at the end of the header, after the trailing slot. That header shows and hides `TimelineItemDetails`. Closed is `ChevronDown`. Open is `ChevronUp`. Without `expandable`, any `TimelineItemDetails` stays visible and the header has no chevron. `expandable` is the mode. `expanded` is the open state. Details can also be permanently visible, so `expanded={false}` alone cannot mean both.

## Parts

Omit a part to hide it. A `Tag` goes in a `TimelineItemContentRow` beside the title or the description.

| Part | Role |
| --- | --- |
| `TimelineItemHeader` | Row beside the icon. Press target when `expandable`. |
| `TimelineItemContent` | Date, title, and description column. |
| `TimelineItemContentRow` | Title or description beside an optional `Tag`. |
| `TimelineItemDate` | Overline. |
| `TimelineItemTitle` | Title. |
| `TimelineItemDescription` | Description. |
| `TimelineItemTrailing` | End-aligned slot in the header. Amount, tag, or text. |
| `TimelineItemDetails` | Content under the header, indented past the icon. |

## Decisions

- **The indicator and the line are drawn by TimelineItem**. They are not public parts.
- **No `type` prop.** Figma splits progress and display into two components. The public API uses one. The neutral timeline is the absence of a current step.
- **The line is derived from `currentStep`.** ReUI does the same: a separator turns done when the next item is completed (`step <= activeStep`). There is no per-item connector prop. The line above an item continues from the previous item's completion.
- **The indicator is not a slot.** `TimelineItem` picks it. Neutral dot when there is no current step. Success or empty circle from `currentStep`. `status` covers error, pending, and loading, which a single step number cannot describe.
- **Step props keep the controlled trio, with `Stepper`'s name.** `currentStep`, `defaultCurrentStep`, and `onCurrentStepChange` are `value`, `defaultValue`, and `onValueChange`.
- **`TimelineItemTrailing` is a free slot.** Figma draws a primary line and an optional secondary line. The slot also has to hold an `AmountDisplay`, a `Tag`, or a single line of text, same as `ListItemTrailing`.
- **Vertical only.** Figma has no horizontal orientation.
