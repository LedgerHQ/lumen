import { cn, useMergedRef } from '@ledgerhq/lumen-utils-shared';
import { cva } from 'class-variance-authority';
import type { ChangeEvent } from 'react';
import type { BaseInputMultilineProps } from './types';
import { useAutosizeTextarea } from './useAutosizeTextarea';

const textareaVariants = cva(
  [
    'w-full flex-1 resize-none bg-transparent body-1 wrap-break-word whitespace-pre-wrap text-base caret-active outline-hidden transition-colors',
    'group-has-disabled:cursor-not-allowed group-has-disabled:text-disabled',
    'placeholder:text-muted group-has-disabled:placeholder:text-disabled',
  ],
  {
    variants: {
      hasLabel: {
        true: 'body-2',
        false: '',
      },
      scrollbarWidth: {
        auto: 'scrollbar-custom pe-8',
        none: 'scrollbar-none',
      },
    },
    defaultVariants: {
      hasLabel: false,
      scrollbarWidth: 'auto',
    },
  },
);

/**
 * The auto-growing multi-line control rendered inside `BaseInput`, paired with the
 * hidden clone it is measured against.
 *
 * @internal
 */
export const BaseInputMultiline = ({
  ref,
  className,
  hasLabel = false,
  minLines = 1,
  maxLines,
  scrollbarWidth = 'auto',
  onChange,
  ...props
}: BaseInputMultilineProps) => {
  const { textareaRef, shadowRef } = useAutosizeTextarea({
    minLines,
    maxLines,
  });
  const composedRef = useMergedRef(ref, textareaRef);

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>): void => {
    const textarea = event.target;
    const { length } = textarea.value;

    // Browsers park the caret before a trailing newline, scrolling the new line out of view.
    if (textarea.value.endsWith('\n') && textarea.selectionStart === length) {
      textarea.setSelectionRange(length, length);
    }

    onChange?.(event);
  };

  return (
    <>
      <textarea
        ref={composedRef}
        rows={minLines}
        className={cn(
          'peer',
          textareaVariants({ hasLabel, scrollbarWidth }),
          hasLabel && 'mt-16',
          className,
        )}
        onChange={handleChange}
        {...props}
      />
      {/*
        Wraps text like the visible field but without `peer`, which would drive the
        floating label from a second sibling. `py-0` makes scrollHeight the pure content
        height, and `overflow-hidden` keeps the scrollbar out of the measurement.
      */}
      <textarea
        ref={shadowRef}
        aria-hidden
        readOnly
        tabIndex={-1}
        className={cn(
          textareaVariants({ hasLabel, scrollbarWidth: null }),
          className,
          'invisible absolute top-0 left-0 h-0 transform-gpu overflow-hidden py-0',
        )}
      />
    </>
  );
};
