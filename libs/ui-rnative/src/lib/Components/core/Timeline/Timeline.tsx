import {
  createSafeContext,
  isTextChildren,
} from '@ledgerhq/lumen-utils-shared';
import type { Key, ReactElement, ReactNode } from 'react';
import { Children, Fragment, isValidElement } from 'react';
import { StyleSheet } from 'react-native';
import { useStyleSheet } from '../../../../styles';
import { Box, Text } from '../../primitives';
import {
  CheckmarkCircleFill,
  ClockFill,
  DeleteCircleFill,
} from '../../symbols';
import { Spinner } from '../Spinner';
import type {
  TimelineItemBodyProps,
  TimelineItemCaptionProps,
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

type TimelinePosition = {
  isFirst: boolean;
  isLast: boolean;
};

type TimelineChild = {
  key: Key;
  node: ReactNode;
};

const flattenTimelineChildren = (
  children: ReactNode,
  keyPrefix = '',
): TimelineChild[] =>
  Children.toArray(children).flatMap((child, index) => {
    const key = `${keyPrefix}${isValidElement(child) ? (child.key ?? index) : index}`;

    if (
      isValidElement<{ children?: ReactNode }>(child) &&
      child.type === Fragment
    ) {
      return flattenTimelineChildren(child.props.children, `${key}/`);
    }

    return [{ key, node: child }];
  });

const [TimelineItemProvider, useTimelineItemContext] =
  createSafeContext<TimelineItemContextValue>('TimelineItem');

const [TimelinePositionProvider, useTimelinePosition] =
  createSafeContext<TimelinePosition>('Timeline', {
    isFirst: true,
    isLast: true,
  });

const useTimelineStyles = () =>
  useStyleSheet(
    (t) => ({
      root: {
        width: t.sizes.full,
        minWidth: 0,
        flexDirection: 'column',
      },
      item: {
        width: t.sizes.full,
        minWidth: 0,
        flexDirection: 'column',
        position: 'relative',
      },
      rail: {
        width: t.sizes.s20,
        flexShrink: 0,
        alignSelf: 'stretch',
        flexDirection: 'column',
        alignItems: 'center',
        marginVertical: -t.spacings.s8,
      },
      line: {
        flex: 1,
        width: t.borderWidth.s2,
        backgroundColor: t.colors.border.mutedSubtleHover,
      },
      lineHidden: {
        opacity: 0,
      },
      indicator: {
        marginVertical: t.spacings.s4,
        width: t.sizes.s20,
        height: t.sizes.s20,
        flexShrink: 0,
        alignItems: 'center',
        justifyContent: 'center',
      },
      neutralDot: {
        width: t.sizes.s12,
        height: t.sizes.s12,
        borderRadius: t.borderRadius.full,
        backgroundColor: t.colors.bg.mutedPressed,
      },
      idleRing: {
        width: t.sizes.s20,
        height: t.sizes.s20,
        borderRadius: t.borderRadius.full,
        borderWidth: t.borderWidth.s2,
        borderColor: t.colors.border.mutedSubtleHover,
      },
      header: {
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: t.sizes.s48,
        minWidth: 0,
        paddingVertical: t.spacings.s8,
        gap: t.spacings.s8,
      },
      leading: {
        flex: 1,
        minWidth: 0,
        flexDirection: 'column',
        gap: t.spacings.s2,
      },
      leadingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        minWidth: 0,
        gap: t.spacings.s4,
      },
      caption: StyleSheet.flatten([
        t.typographies.body4,
        {
          minWidth: 0,
          flexShrink: 1,
          color: t.colors.text.muted,
        },
      ]),
      description: StyleSheet.flatten([
        t.typographies.body3,
        {
          minWidth: 0,
          flexShrink: 1,
          color: t.colors.text.muted,
        },
      ]),
      trailing: {
        marginStart: 'auto',
        flexShrink: 0,
        flexDirection: 'column',
        alignItems: 'flex-end',
      },
      body: {
        flexDirection: 'row',
        gap: t.spacings.s8,
      },
      bodyLine: {
        width: t.sizes.s20,
        flexShrink: 0,
        alignItems: 'center',
      },
      bodyContent: {
        flex: 1,
        minWidth: 0,
        paddingBottom: t.spacings.s8,
      },
    }),
    [],
  );

const useTitleStyles = (muted: boolean) =>
  useStyleSheet(
    (t) => ({
      title: StyleSheet.flatten([
        t.typographies.body2SemiBold,
        {
          minWidth: 0,
          flexShrink: 1,
          color: muted ? t.colors.text.muted : t.colors.text.base,
        },
      ]),
    }),
    [muted],
  );

// Spans the header's vertical padding so the connector stays continuous
// between items, while the indicator stays centered on the header content.
const TimelineRail = ({ status }: { status?: TimelineItemStatus }) => {
  const styles = useTimelineStyles();
  const { isFirst, isLast } = useTimelinePosition({
    consumerName: 'TimelineItem',
    contextRequired: false,
  });
  const decorative = status !== 'loading';
  const indicatorByStatus = {
    success: (
      <CheckmarkCircleFill
        accessible={false}
        color='success'
        size={20}
        testID='timeline-indicator-success'
      />
    ),
    error: (
      <DeleteCircleFill
        accessible={false}
        color='error'
        size={20}
        testID='timeline-indicator-error'
      />
    ),
    pending: (
      <ClockFill
        accessible={false}
        color='muted'
        size={20}
        testID='timeline-indicator-pending'
      />
    ),
    loading: (
      <Spinner color='muted' size={20} testID='timeline-indicator-loading' />
    ),
    idle: (
      <Box
        accessible={false}
        style={styles.idleRing}
        testID='timeline-indicator-idle'
      />
    ),
  } satisfies Record<TimelineItemStatus, ReactElement>;

  return (
    <Box style={styles.rail}>
      <Box
        accessibilityElementsHidden
        importantForAccessibility='no-hide-descendants'
        style={StyleSheet.flatten([styles.line, isFirst && styles.lineHidden])}
        testID='timeline-line-in'
      />
      <Box
        accessibilityElementsHidden={decorative}
        importantForAccessibility={decorative ? 'no-hide-descendants' : 'auto'}
        style={styles.indicator}
      >
        {status ? (
          indicatorByStatus[status]
        ) : (
          <Box
            accessible={false}
            style={styles.neutralDot}
            testID='timeline-indicator-neutral'
          />
        )}
      </Box>
      <Box
        accessibilityElementsHidden
        importantForAccessibility='no-hide-descendants'
        style={StyleSheet.flatten([styles.line, isLast && styles.lineHidden])}
        testID='timeline-line-out'
      />
    </Box>
  );
};

/**
 * Vertical timeline. Lays out its items and holds no state of its own.
 *
 * @see {@link https://ldls-react-native.vercel.app/?path=/docs/rnative-timeline--docs Storybook}
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
  lx,
  style,
  ...props
}: TimelineProps) => {
  const styles = useTimelineStyles();
  const items = flattenTimelineChildren(children);

  return (
    <Box
      ref={ref}
      lx={lx}
      style={StyleSheet.flatten([styles.root, style])}
      {...props}
    >
      {items.map(({ key, node }, index) => (
        <TimelinePositionProvider
          key={key}
          value={{
            isFirst: index === 0,
            isLast: index === items.length - 1,
          }}
        >
          {node}
        </TimelinePositionProvider>
      ))}
    </Box>
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
  lx,
  style,
  ...props
}: TimelineItemProps) => {
  const styles = useTimelineStyles();

  return (
    <TimelineItemProvider value={{ status }}>
      <Box
        ref={ref}
        lx={lx}
        style={StyleSheet.flatten([styles.item, style])}
        testID='timeline-item'
        {...props}
      >
        {children}
      </Box>
    </TimelineItemProvider>
  );
};

/**
 * Row beside the indicator. Holds the leading column and the trailing slot.
 */
export const TimelineItemHeader = ({
  ref,
  children,
  lx,
  style,
  ...props
}: TimelineItemHeaderProps) => {
  const styles = useTimelineStyles();
  const { status } = useTimelineItemContext({
    consumerName: 'TimelineItemHeader',
    contextRequired: true,
  });

  return (
    <Box
      ref={ref}
      lx={lx}
      style={StyleSheet.flatten([styles.header, style])}
      {...props}
    >
      <TimelineRail status={status} />
      {children}
    </Box>
  );
};

/**
 * Caption, title, and description column.
 */
export const TimelineItemLeading = ({
  ref,
  children,
  lx,
  style,
  ...props
}: TimelineItemLeadingProps) => {
  const styles = useTimelineStyles();

  return (
    <Box
      ref={ref}
      lx={lx}
      style={StyleSheet.flatten([styles.leading, style])}
      {...props}
    >
      {children}
    </Box>
  );
};

/**
 * Horizontal row for a title or description beside a tag.
 */
export const TimelineItemLeadingRow = ({
  ref,
  children,
  lx,
  style,
  ...props
}: TimelineItemLeadingRowProps) => {
  const styles = useTimelineStyles();

  return (
    <Box
      ref={ref}
      lx={lx}
      style={StyleSheet.flatten([styles.leadingRow, style])}
      {...props}
    >
      {children}
    </Box>
  );
};

/**
 * Overline above the title.
 */
export const TimelineItemCaption = ({
  ref,
  children,
  lx,
  style,
  ...props
}: TimelineItemCaptionProps) => {
  const styles = useTimelineStyles();

  return (
    <Text
      ref={ref}
      allowFontScaling={false}
      ellipsizeMode='tail'
      lx={lx}
      numberOfLines={1}
      style={StyleSheet.flatten([styles.caption, style])}
      {...props}
    >
      {children}
    </Text>
  );
};

/**
 * Title. An `idle` item uses the muted tone.
 */
export const TimelineItemTitle = ({
  ref,
  children,
  lx,
  style,
  ...props
}: TimelineItemTitleProps) => {
  const { status } = useTimelineItemContext({
    consumerName: 'TimelineItemTitle',
    contextRequired: true,
  });
  const styles = useTitleStyles(status === 'idle');

  return (
    <Text
      ref={ref}
      allowFontScaling={false}
      ellipsizeMode='tail'
      lx={lx}
      numberOfLines={1}
      style={StyleSheet.flatten([styles.title, style])}
      {...props}
    >
      {children}
    </Text>
  );
};

/**
 * Description under the title.
 */
export const TimelineItemDescription = ({
  ref,
  children,
  lx,
  style,
  ...props
}: TimelineItemDescriptionProps) => {
  const styles = useTimelineStyles();

  return (
    <Text
      ref={ref}
      allowFontScaling={false}
      ellipsizeMode='tail'
      lx={lx}
      numberOfLines={1}
      style={StyleSheet.flatten([styles.description, style])}
      {...props}
    >
      {children}
    </Text>
  );
};

/**
 * End-aligned slot in the header.
 */
export const TimelineItemTrailing = ({
  ref,
  children,
  lx,
  style,
  ...props
}: TimelineItemTrailingProps) => {
  const styles = useTimelineStyles();

  return (
    <Box
      ref={ref}
      lx={lx}
      style={StyleSheet.flatten([styles.trailing, style])}
      {...props}
    >
      {isTextChildren(children) ? <Text>{children}</Text> : children}
    </Box>
  );
};

/**
 * Block under the header, aligned with the header text.
 */
export const TimelineItemBody = ({
  ref,
  children,
  lx,
  style,
  ...props
}: TimelineItemBodyProps) => {
  const styles = useTimelineStyles();
  const { isLast } = useTimelinePosition({
    consumerName: 'TimelineItem',
    contextRequired: false,
  });

  return (
    <Box
      ref={ref}
      lx={lx}
      style={StyleSheet.flatten([styles.body, style])}
      {...props}
    >
      <Box
        accessibilityElementsHidden
        importantForAccessibility='no-hide-descendants'
        pointerEvents='none'
        style={styles.bodyLine}
      >
        {!isLast && <Box style={styles.line} />}
      </Box>
      <Box style={styles.bodyContent}>
        {isTextChildren(children) ? <Text>{children}</Text> : children}
      </Box>
    </Box>
  );
};
