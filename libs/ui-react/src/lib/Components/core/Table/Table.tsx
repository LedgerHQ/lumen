import type { Breakpoint, ResponsiveValue } from '@ledgerhq/lumen-design-core';
import {
  cn,
  createSafeContext,
  useMergedRef,
} from '@ledgerhq/lumen-utils-shared';
import { cva } from 'class-variance-authority';
import type { CSSProperties, UIEvent } from 'react';
import { useRef } from 'react';
import { useCommonTranslation } from '../../../../translations';
import { useScrollOverflow } from '../../../../utils/useScrollOverflow/useScrollOverflow';
import {
  ChevronAscending,
  ChevronDescending,
  ChevronUpDown,
  Information,
} from '../../symbols';
import { InteractiveIcon } from '../InteractiveIcon';
import { Spinner } from '../Spinner';
import { Spot } from '../Spot';
import type {
  TableBodyProps,
  TableCellProps,
  TableColGroupProps,
  TableColProps,
  TableHeaderCellProps,
  TableHeaderRowProps,
  TableHeaderProps,
  TableHorizontalLayout,
  TableProps,
  TableRowProps,
  TableActionBarLeadingProps,
  TableActionBarProps,
  TableActionBarTrailingProps,
  TableCellItemProps,
  TableCellContentProps,
  TableCellContentTitleProps,
  TableCellContentDescriptionProps,
  TableCellContentRowProps,
  TableLoadingRowProps,
  TableRootProps,
  TableInfoIconProps,
  TableSortButtonProps,
  TableGroupHeaderRowProps,
} from './types';
import { useThrottledScrollBottom } from './utils/useThrottledScrollBottom';

const [TableProvider, useTableContext] = createSafeContext<{
  appearance: TableRootProps['appearance'];
  loading: TableRootProps['loading'];
  horizontalLayout: TableRootProps['horizontalLayout'];
}>('Table');

const tableVariants = cva(
  'relative scrollbar-none w-full max-w-full border-collapse overflow-x-auto rounded-lg',
  {
    variants: {
      appearance: {
        'no-background': 'bg-canvas',
        plain: 'bg-surface',
      },
      overflowing: {
        // Keeps trackpad swipes from triggering the browser back navigation.
        true: 'overscroll-x-contain',
        false: '',
      },
    },
  },
);

/**
 * Root table container component. Wraps a scrollable HTML `<div>` around the `Table` element.
 *
 * @example
 * <TableRoot>
 *   <Table>
 *     <TableHeader>
 *       <TableHeaderRow>
 *         <TableHeaderCell>
 *           <TableHeaderCellSort sortDirection={sortDir} onToggleSort={setSortDir}>Name</TableHeaderCellSort>
 *         </TableHeaderCell>
 *       </TableHeaderRow>
 *     </TableHeader>
 *     <TableBody>
 *       <TableRow>
 *         <TableCell>John</TableCell>
 *       </TableRow>
 *     </TableBody>
 *   </Table>
 * </TableRoot>
 */
export const TableRoot = ({
  children,
  appearance = 'no-background',
  horizontalLayout,
  className,
  tabIndex,
  role,
  onScroll,
  onScrollBottom,
  loading,
  ref,
  ...props
}: TableRootProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const mergedRef = useMergedRef(scrollRef, ref);
  const { canScrollLeft, canScrollRight } = useScrollOverflow(scrollRef);
  const handleScrollBottom = useThrottledScrollBottom({
    onScrollBottom,
    loading,
  });

  const overflowing = canScrollLeft || canScrollRight;
  const hasAccessibleName = Boolean(
    props['aria-label'] || props['aria-labelledby'],
  );

  const handleScroll = (event: UIEvent<HTMLDivElement>): void => {
    onScroll?.(event);
    handleScrollBottom?.(event);
  };

  return (
    <TableProvider value={{ appearance, loading, horizontalLayout }}>
      <div
        {...props}
        ref={mergedRef}
        // Keyboard users can only scroll a region they can focus.
        tabIndex={tabIndex ?? (overflowing ? 0 : undefined)}
        role={role ?? (overflowing && hasAccessibleName ? 'region' : undefined)}
        className={tableVariants({ appearance, overflowing, className })}
        onScroll={handleScroll}
      >
        {children}
      </div>
    </TableProvider>
  );
};

type BreakpointKey = 'base' | Breakpoint;

// Each breakpoint reads its own variable, so `minWidth` can differ per breakpoint.
const tableLayoutVariants = cva('w-full table-fixed', {
  variants: {
    base: {
      shrink: 'max-w-full min-w-0',
      scroll: 'max-w-none min-w-(--table-min-width-base)',
    },
    xs: {
      shrink: 'xs:max-w-full xs:min-w-0',
      scroll: 'xs:max-w-none xs:min-w-(--table-min-width-xs)',
    },
    sm: {
      shrink: 'sm:max-w-full sm:min-w-0',
      scroll: 'sm:max-w-none sm:min-w-(--table-min-width-sm)',
    },
    md: {
      shrink: 'md:max-w-full md:min-w-0',
      scroll: 'md:max-w-none md:min-w-(--table-min-width-md)',
    },
    lg: {
      shrink: 'lg:max-w-full lg:min-w-0',
      scroll: 'lg:max-w-none lg:min-w-(--table-min-width-lg)',
    },
    xl: {
      shrink: 'xl:max-w-full xl:min-w-0',
      scroll: 'xl:max-w-none xl:min-w-(--table-min-width-xl)',
    },
    '2xl': {
      shrink: '2xl:max-w-full 2xl:min-w-0',
      scroll: '2xl:max-w-none 2xl:min-w-(--table-min-width-2xl)',
    },
  },
  defaultVariants: {
    base: 'shrink',
  },
});

const DEFAULT_HORIZONTAL_LAYOUT: TableHorizontalLayout = { type: 'shrink' };

const resolveHorizontalLayout = (
  value: ResponsiveValue<TableHorizontalLayout>,
): {
  variants: Partial<Record<BreakpointKey, TableHorizontalLayout['type']>>;
  style: CSSProperties;
} => {
  const byBreakpoint = 'type' in value ? { base: value } : value;
  const variants: Partial<
    Record<BreakpointKey, TableHorizontalLayout['type']>
  > = {};
  const style: Record<string, string> = {};

  for (const [breakpoint, layout] of Object.entries(byBreakpoint)) {
    if (!layout) {
      continue;
    }
    variants[breakpoint as BreakpointKey] = layout.type;
    // Without minWidth, the variable stays unset so min-width falls back to auto
    // and the fixed layout sizes the table from its column widths.
    if (layout.type === 'scroll' && layout.minWidth !== undefined) {
      style[`--table-min-width-${breakpoint}`] = `${layout.minWidth}px`;
    }
  }

  return { variants, style: style as CSSProperties };
};

export const Table = ({
  children,
  className,
  style,
  ref,
  ...props
}: TableProps) => {
  const { horizontalLayout = DEFAULT_HORIZONTAL_LAYOUT } = useTableContext({
    consumerName: 'Table',
    contextRequired: false,
  });
  const layout = resolveHorizontalLayout(horizontalLayout);

  return (
    <table
      {...props}
      className={tableLayoutVariants({ ...layout.variants, className })}
      style={{ ...layout.style, ...style }}
      ref={ref}
    >
      {children}
    </table>
  );
};

/**
 * Column group component. Wraps the HTML `<colgroup>` element.
 * Use with `TableCol` to define column widths.
 *
 * @example
 * <TableColGroup>
 *   <TableCol className="w-40" />
 *   <TableCol className="w-144" />
 * </TableColGroup>
 */
export const TableColGroup = ({
  children,
  className,
  ref,
  ...props
}: TableColGroupProps) => {
  return (
    <colgroup ref={ref} className={className} {...props}>
      {children}
    </colgroup>
  );
};

const colVariants = cva('', {
  variants: {
    hideBelow: {
      xs: 'hidden xs:table-column',
      sm: 'hidden sm:table-column',
      md: 'hidden md:table-column',
      lg: 'hidden lg:table-column',
      xl: 'hidden xl:table-column',
      '2xl': 'hidden 2xl:table-column',
    },
  },
});

/**
 * Column component. Wraps the HTML `<col>` element.
 * Use to define column widths within a `TableColGroup`.
 */
export const TableCol = ({
  className,
  hideBelow,
  ref,
  ...props
}: TableColProps) => {
  return (
    <col
      ref={ref}
      className={colVariants({ hideBelow, className })}
      {...props}
    />
  );
};

/**
 * Table head component. Wraps the HTML `<thead>` element.
 */
export const TableHeader = ({
  children,
  className,
  ref,
  ...props
}: TableHeaderProps) => {
  return (
    <thead ref={ref} className={className} {...props}>
      {children}
    </thead>
  );
};

/**
 * Table body component. Wraps the HTML `<tbody>` element.
 */
export const TableBody = ({
  children,
  className,
  ref,
  ...props
}: TableBodyProps) => {
  return (
    <tbody ref={ref} className={className} {...props}>
      {children}
    </tbody>
  );
};

/**
 * Table row component for body rows. Wraps the HTML `<tr>` element.
 */
export const TableRow = ({
  children,
  className,
  clickable = false,
  onClick,
  ref,
  ...props
}: TableRowProps) => {
  return (
    <tr
      ref={ref}
      onClick={onClick}
      role={clickable ? 'button' : undefined}
      className={cn(
        clickable &&
          'cursor-pointer outline-none select-none hover:bg-base-transparent-hover active:bg-base-transparent-pressed',
        className,
      )}
      {...props}
    >
      {children}
    </tr>
  );
};

const headerRowVariants = cva('', {
  variants: {
    appearance: {
      'no-background': 'bg-canvas',
      plain: 'bg-surface',
    },
    stickyHeader: {
      true: 'sticky top-0 z-table-header',
      false: '',
    },
  },
});

/**
 * Table header row component. Wraps the HTML `<tr>` element with header-specific styles.
 */
export const TableHeaderRow = ({
  children,
  className,
  stickyHeader = true,
  ref,
  ...props
}: TableHeaderRowProps) => {
  const { appearance } = useTableContext({
    consumerName: 'TableHeaderRow',
    contextRequired: true,
  });
  return (
    <tr
      ref={ref}
      className={headerRowVariants({ appearance, stickyHeader, className })}
      {...props}
    >
      {children}
    </tr>
  );
};

/**
 * Table Group Header row component. Wraps the HTML `<tr> + <td>` element with header sub-section for a table.
 */
export const TableGroupHeaderRow = ({
  children,
  className,
  colSpan = 1,
  ref,
  ...props
}: TableGroupHeaderRowProps) => {
  const { appearance } = useTableContext({
    consumerName: 'TableGroupHeaderRow',
    contextRequired: true,
  });
  return (
    <tr ref={ref} className={cn('h-40', className)} {...props}>
      <td colSpan={colSpan}>
        <div
          className={cn(
            'flex h-32 w-full items-center bg-muted px-12 body-3 text-base',
            appearance === 'no-background' && 'rounded-sm',
          )}
        >
          {/* Keeps the label in view when the table scrolls horizontally. */}
          <span className='sticky start-12'>{children}</span>
        </div>
      </td>
    </tr>
  );
};

const cellVariants = {
  root: cva(
    'h-64 truncate p-12 body-3 text-base first:rounded-l-md last:rounded-r-md',
    {
      variants: {
        hideBelow: {
          xs: 'hidden xs:table-cell',
          sm: 'hidden sm:table-cell',
          md: 'hidden md:table-cell',
          lg: 'hidden lg:table-cell',
          xl: 'hidden xl:table-cell',
          '2xl': 'hidden 2xl:table-cell',
        },
      },
    },
  ),
  inner: cva('flex flex-1', {
    variants: {
      align: {
        start: 'justify-start text-start',
        end: 'justify-end text-end',
      },
    },
  }),
};

/**
 * Table data cell component. Wraps the HTML `<td>` element.
 */
export const TableCell = ({
  children,
  className,
  hideBelow,
  align = 'start',
  ref,
  ...props
}: TableCellProps) => {
  return (
    <td
      ref={ref}
      className={cellVariants.root({ hideBelow, className })}
      {...props}
    >
      <div className={cellVariants.inner({ align })}>{children}</div>
    </td>
  );
};

const [TableCellAlignProvider, useTableCellAlignContext] = createSafeContext<{
  align: TableCellProps['align'];
}>('TableCellItem', { align: 'start' });

const cellItemVariants = cva('flex min-w-0 items-center gap-12', {
  variants: {
    align: {
      start: 'text-start',
      end: 'text-end',
    },
  },
});

/**
 * Cell item component. Root of the cell content composition.
 * To be used inside a TableCell or inside a tanstack column render.
 * Typically wraps a leading element (spot, icon or crypto-icon) followed by a
 * TableCellContent.
 */
export const TableCellItem = ({
  className,
  align = 'start',
  children,
  ref,
  ...props
}: TableCellItemProps) => {
  return (
    <TableCellAlignProvider value={{ align }}>
      <div
        ref={ref}
        className={cellItemVariants({ align, className })}
        {...props}
      >
        {children}
      </div>
    </TableCellAlignProvider>
  );
};

/**
 * Cell content column. Stacks a TableCellContentTitle, TableCellContentDescription
 * and/or TableCellContentRow.
 */
export const TableCellContent = ({
  className,
  children,
  ref,
  ...props
}: TableCellContentProps) => {
  const { align } = useTableCellAlignContext({
    consumerName: 'TableCellContent',
    contextRequired: false,
  });

  return (
    <div
      ref={ref}
      className={cn(
        'flex min-w-0 flex-col gap-4',
        align === 'end' && 'items-end text-end',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * Cell content title.
 */
export const TableCellContentTitle = ({
  className,
  children,
  ref,
  ...props
}: TableCellContentTitleProps) => {
  const { align } = useTableCellAlignContext({
    consumerName: 'TableCellContentTitle',
    contextRequired: false,
  });

  return (
    <div
      ref={ref}
      className={cn(
        'shrink-0 body-2 text-base',
        align === 'end' && 'text-end',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * Cell content description.
 */
export const TableCellContentDescription = ({
  className,
  children,
  ref,
  ...props
}: TableCellContentDescriptionProps) => {
  const { align } = useTableCellAlignContext({
    consumerName: 'TableCellContentDescription',
    contextRequired: false,
  });

  return (
    <div
      ref={ref}
      className={cn(
        'truncate body-3 text-muted',
        align === 'end' && 'text-end',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * Cell content row. Use for more complex composition, e.g. a description
 * alongside a Tag.
 */
export const TableCellContentRow = ({
  className,
  children,
  ref,
  ...props
}: TableCellContentRowProps) => {
  const { align } = useTableCellAlignContext({
    consumerName: 'TableCellContentRow',
    contextRequired: false,
  });

  return (
    <div
      ref={ref}
      className={cn(
        'flex min-w-0 items-center gap-8',
        align === 'end' && 'justify-end',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

const headerCellVariants = {
  root: cva('group h-40 truncate p-12 body-3 text-base', {
    variants: {
      hideBelow: {
        xs: 'hidden xs:table-cell',
        sm: 'hidden sm:table-cell',
        md: 'hidden md:table-cell',
        lg: 'hidden lg:table-cell',
        xl: 'hidden xl:table-cell',
        '2xl': 'hidden 2xl:table-cell',
      },
    },
  }),
  content: cva('flex min-w-0 items-center gap-4 truncate', {
    variants: {
      align: {
        start: 'justify-start text-start',
        end: 'justify-end text-end',
      },
    },
  }),
  trailingContent: cva(
    'flex items-center justify-center opacity-0 group-hover:opacity-100',
  ),
};

/**
 * Table header cell component. Wraps the HTML `<th>` element.
 * Use TableSortButton for sortable columns; other children are trailing content.
 */
export const TableHeaderCell = ({
  children,
  className,
  scope = 'col',
  hideBelow,
  align = 'start',
  trailingContent,
  ref,
  ...props
}: TableHeaderCellProps) => {
  return (
    <th
      ref={ref}
      scope={scope}
      className={headerCellVariants.root({ hideBelow, className })}
      {...props}
    >
      <div className='min-w-0'>
        <div className={headerCellVariants.content({ align })}>
          <span className={cn('truncate', align === 'end' && 'order-1')}>
            {children}
          </span>
          <div className='flex items-center justify-center opacity-0 group-hover:opacity-100'>
            {trailingContent}
          </div>
        </div>
      </div>
    </th>
  );
};

/**
 * Action bar component for table controls. Positioned above the table.
 *
 * @example
 * <TableActionBar>
 *   <TableActionBarLeading>
 *     <SearchInput />
 *   </TableActionBarLeading>
 *   <TableActionBarTrailing>
 *     <Button>Export</Button>
 *   </TableActionBarTrailing>
 * </TableActionBar>
 */
export const TableActionBar = ({
  children,
  className,
  ref,
  ...props
}: TableActionBarProps) => {
  return (
    <div
      ref={ref}
      className={cn('flex items-center gap-8 py-12', className)}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * Leading section of the action bar. Contains left-aligned actions.
 */
export const TableActionBarLeading = ({
  children,
  className,
  ref,
  ...props
}: TableActionBarLeadingProps) => {
  return (
    <div
      ref={ref}
      className={cn('flex items-center gap-8', className)}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * Trailing section of the action bar. Contains right-aligned actions.
 */
export const TableActionBarTrailing = ({
  children,
  className,
  ref,
  ...props
}: TableActionBarTrailingProps) => {
  return (
    <div
      ref={ref}
      className={cn('ml-auto flex items-center gap-8', className)}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * Loading row component displayed at the bottom of the table during infinite scroll loading.
 */
export const TableLoadingRow = ({
  className,
  ref,
  ...props
}: TableLoadingRowProps) => {
  const { loading } = useTableContext({
    consumerName: 'TableLoadingRow',
    contextRequired: true,
  });

  if (!loading) {
    return null;
  }

  return (
    <div
      {...props}
      ref={ref}
      className={cn(
        // Sticky so the loader stays centered in view when the table scrolls horizontally.
        'sticky start-0 flex h-80 w-full items-center justify-center p-12',
        className,
      )}
    >
      <Spot icon={Spinner} size={48} />
    </div>
  );
};

/**
 * Clickable sort control for table header columns.
 * Displays the current sort state (asc/desc/idle) and triggers sort changes on click.
 */
export const TableInfoIcon = ({
  className,
  ref,
  ...props
}: TableInfoIconProps) => {
  return (
    <InteractiveIcon
      {...props}
      iconType='filled'
      icon={Information}
      size={20}
      className={className}
      ref={ref}
    />
  );
};

const sortControlIconMap = {
  asc: ChevronAscending,
  desc: ChevronDescending,
  idle: ChevronUpDown,
};

const tableSortButtonVariants = {
  root: cva(
    [
      'flex min-w-0 cursor-pointer items-center gap-4',
      'rounded-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
    ],
    {
      variants: {
        align: {
          end: 'flex-row-reverse',
          start: '',
        },
      },
    },
  ),
  icon: cva('', {
    variants: {
      active: {
        true: 'opacity-100',
        false: 'opacity-0 group-hover:opacity-100',
      },
    },
  }),
};

/**
 * Sortable header label + icon. Renders a single button (label + sort icon) for accessibility.
 * Use as the first child of TableHeaderCell; other children are trailing content.
 */
export const TableSortButton = ({
  children,
  sortDirection,
  align = 'start',
  onToggleSort,
  className,
  onClick,
  ref,
  ...props
}: TableSortButtonProps) => {
  const { t } = useCommonTranslation();
  const Icon = sortControlIconMap[sortDirection || 'idle'];
  const ariaLabelMap = {
    asc: t('components.table.ascAriaLabel'),
    desc: t('components.table.descAriaLabel'),
  };

  return (
    <button
      {...props}
      ref={ref}
      type='button'
      className={tableSortButtonVariants.root({ align, className })}
      aria-label={sortDirection ? ariaLabelMap[sortDirection] : undefined}
      onClick={(e) => {
        onClick?.(e);
        onToggleSort?.(sortDirection === 'asc' ? 'desc' : 'asc');
      }}
    >
      <span className='min-w-0 truncate'>{children}</span>

      <Icon
        size={20}
        className={tableSortButtonVariants.icon({
          active: Boolean(sortDirection),
        })}
      />
    </button>
  );
};
