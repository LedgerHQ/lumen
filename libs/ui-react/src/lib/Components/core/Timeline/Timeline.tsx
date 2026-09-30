import { cn, createSafeContext } from '@ledgerhq/lumen-utils-shared';
import { cva } from 'class-variance-authority';
import {
  CheckmarkCircleFill,
  ClockFill,
  DeleteCircleFill,
} from '../../symbols';
import { Spinner } from '../Spinner';
import type {
  TimelineItemCaptionProps,
  TimelineItemBodyProps,
  TimelineItemDescriptionProps,
  TimelineItemHeaderProps,
  TimelineItemLeadingProps,
  TimelineItemLeadingRowProps,
  TimelineItemProps,
  TimelineItemStatus,
  TimelineItemTitleProps,
  TimelineItemTrailingProps,
  TimelineProps,
} from './types';

type TimelineItemContextValue = {
  status?: TimelineItemStatus;
};

const [TimelineItemProvider, useTimelineItemContext] =
  createSafeContext<TimelineItemContextValue>('TimelineItem');

const titleVariants = cva('min-w-0 truncate body-2-semi-bold', {
  variants: {
    muted: {
      true: 'text-muted',
      false: 'text-base',
    },
  },
});

const TimelineIndicator = ({ status }: { status?: TimelineItemStatus }) => {
  const indicator = () => {
    switch (status) {
      case 'success':
        return (
          <CheckmarkCircleFill aria-hidden className='text-success' size={24} />
        );
      case 'error':
        return (
          <DeleteCircleFill aria-hidden className='text-error' size={24} />
        );
      case 'pending':
        return <ClockFill aria-hidden className='text-muted' size={24} />;
      case 'loading':
        return <Spinner className='text-muted' size={24} />;
      case 'todo':
        return (
          <span
            aria-hidden
            className='size-20 rounded-full border-2 border-muted-subtle-hover'
          />
        );
      case undefined:
        return (
          <span aria-hidden className='size-12 rounded-full bg-muted-pressed' />
        );
    }
  };
  return (
    <span
      className='mt-16 flex size-32 shrink-0 items-center justify-center self-start'
      data-indicator={status ?? 'neutral'}
    >
      {indicator()}
    </span>
  );
};

const TimelineRail = () => {
  return (
    <div
      aria-hidden
      className='pointer-events-none absolute inset-y-0 start-0 flex w-32 flex-col items-center'
    >
      <span
        className='h-16 w-0 shrink-0 border-l-2 border-muted-subtle-hover group-first/item:invisible'
        data-line='in'
      />
      <span className='h-32 shrink-0' />
      <span
        className='w-0 flex-1 border-l-2 border-muted-subtle-hover group-last/item:hidden'
        data-line='out'
      />
    </div>
  );
};

/**
 * Vertical timeline. Lays out its items and holds no state of its own.
 *
 * @example
 * <Timeline>
 *   <TimelineItem>
 *     <TimelineItemHeader>
 *       <TimelineItemLeading>
 *         <TimelineItemTitle>Payment confirmed</TimelineItemTitle>
 *       </TimelineItemLeading>
 *     </TimelineItemHeader>
 *   </TimelineItem>
 * </Timeline>
 */
export const Timeline = ({
  ref,
  children,
  className,
  ...props
}: TimelineProps) => {
  return (
    <div ref={ref} className={cn('flex w-full flex-col', className)} {...props}>
      {children}
    </div>
  );
};

/**
 * One row of a timeline. Draws the indicator from `status` and the connector
 * to the neighbouring items.
 */
export const TimelineItem = ({
  ref,
  status,
  children,
  className,
  ...props
}: TimelineItemProps) => {
  return (
    <TimelineItemProvider value={{ status }}>
      <div
        ref={ref}
        data-status={status ?? 'neutral'}
        className={cn('group/item relative flex w-full flex-col', className)}
        {...props}
      >
        <TimelineRail />
        {children}
      </div>
    </TimelineItemProvider>
  );
};

/**
 * Row beside the indicator. Holds the leading column and the trailing slot.
 */
export const TimelineItemHeader = ({
  ref,
  children,
  className,
  ...props
}: TimelineItemHeaderProps) => {
  const { status } = useTimelineItemContext({
    consumerName: 'TimelineItemHeader',
    contextRequired: true,
  });

  return (
    <div
      ref={ref}
      className={cn('flex min-h-64 items-center gap-8', className)}
      {...props}
    >
      <TimelineIndicator status={status} />
      {children}
    </div>
  );
};

/**
 * Caption, title, and description column.
 */
export const TimelineItemLeading = ({
  ref,
  children,
  className,
  ...props
}: TimelineItemLeadingProps) => {
  return (
    <div
      ref={ref}
      className={cn('flex min-w-0 flex-1 flex-col gap-2', className)}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * Horizontal row for a title or description beside a tag.
 */
export const TimelineItemLeadingRow = ({
  ref,
  children,
  className,
  ...props
}: TimelineItemLeadingRowProps) => {
  return (
    <div
      ref={ref}
      className={cn('flex min-w-0 items-center gap-4', className)}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * Overline above the title.
 */
export const TimelineItemCaption = ({
  ref,
  children,
  className,
  ...props
}: TimelineItemCaptionProps) => {
  return (
    <div
      ref={ref}
      className={cn('truncate body-4 text-muted', className)}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * Title. A `todo` item uses the muted tone.
 */
export const TimelineItemTitle = ({
  ref,
  children,
  className,
  ...props
}: TimelineItemTitleProps) => {
  const { status } = useTimelineItemContext({
    consumerName: 'TimelineItemTitle',
    contextRequired: true,
  });

  return (
    <div
      ref={ref}
      className={cn(titleVariants({ muted: status === 'todo' }), className)}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * Description under the title.
 */
export const TimelineItemDescription = ({
  ref,
  children,
  className,
  ...props
}: TimelineItemDescriptionProps) => {
  return (
    <div
      ref={ref}
      className={cn('min-w-0 truncate body-3 text-muted', className)}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * End-aligned slot in the header.
 */
export const TimelineItemTrailing = ({
  ref,
  children,
  className,
  ...props
}: TimelineItemTrailingProps) => {
  return (
    <div
      ref={ref}
      className={cn(
        'ms-auto flex shrink-0 flex-col items-end text-end body-2-semi-bold text-base',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * Block under the header, indented past the indicator.
 */
export const TimelineItemBody = ({
  ref,
  children,
  className,
  ...props
}: TimelineItemBodyProps) => {
  return (
    <div
      ref={ref}
      className={cn('ms-40 pt-8 pb-12 body-3 text-muted', className)}
      {...props}
    >
      {children}
    </div>
  );
};
