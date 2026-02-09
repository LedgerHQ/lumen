import { cn, createSafeContext } from '@ledgerhq/lumen-utils-shared';
import { cva } from 'class-variance-authority';
import { forwardRef } from 'react';
import { useCommonTranslation } from '../../../i18n';
import {
  ChevronAscending,
  ChevronDescending,
  ChevronUpDown,
  Information,
} from '../../Symbols';
import { InteractiveIcon } from '../InteractiveIcon';
import { Spot } from '../Spot';
import {
  TableBodyProps,
  TableCellProps,
  TableHeaderCellProps,
  TableHeaderRowProps,
  TableHeadProps,
  TableProps,
  TableRowProps,
  TableActionBarLeadingProps,
  TableActionBarProps,
  TableActionBarTrailingProps,
  TableCellContentProps,
  TableLoadingRowProps,
  TableRootProps,
  TableInfoIconProps,
  TableSortButtonProps,
} from './types';
import { useThrottledScrollBottom } from './utils/useThrottledScrollBottom';

const [TableProvider, useTableContext] = createSafeContext<{
  appearance: TableRootProps['appearance'];
  isLoading: TableRootProps['isLoading'];
}>('Table');

const tableVariants = cva(
  'relative w-full max-w-full border-collapse overflow-x-auto rounded-lg',
  {
    variants: {
      appearance: {
        'no-background': 'bg-canvas',
        plain: 'bg-surface',
      },
    },
  },
);

/**
 * Root table component. Wraps the HTML `<table>` element.
 *
 * @example
 * <Table>
 *   <TableHead>
 *     <TableHeaderRow>
 *       <TableHeaderCell>
 *         <TableHeaderCellSort sortDirection={sortDir} onToggleSort={setSortDir}>Name</TableHeaderCellSort>
 *       </TableHeaderCell>
 *     </TableHeaderRow>
 *   </TableHead>
 *   <TableBody>
 *     <TableRow>
 *       <TableCell>John</TableCell>
 *     </TableRow>
 *   </TableBody>
 * </Table>
 */
export const TableRoot = forwardRef<HTMLTableElement, TableRootProps>(
  (
    {
      children,
      appearance = 'no-background',
      className,
      onScrollBottom,
      isLoading,
      ...props
    },
    ref,
  ) => {
    const handleScroll = useThrottledScrollBottom({
      onScrollBottom,
      isLoading,
    });

    return (
      <TableProvider value={{ appearance, isLoading }}>
        <div
          {...props}
          ref={ref}
          style={{ scrollbarWidth: 'none' }}
          className={tableVariants({ appearance, className })}
          onScroll={handleScroll}
        >
          {children}
        </div>
      </TableProvider>
    );
  },
);
TableRoot.displayName = 'TableRoot';

export const Table = forwardRef<HTMLTableElement, TableProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <table
        {...props}
        className={cn('w-full max-w-full table-fixed', className)}
        ref={ref}
      >
        {children}
      </table>
    );
  },
);
TableRoot.displayName = 'TableRoot';

/**
 * Table head component. Wraps the HTML `<thead>` element.
 */
export const TableHead = forwardRef<HTMLTableSectionElement, TableHeadProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <thead ref={ref} className={className} {...props}>
        {children}
      </thead>
    );
  },
);
TableHead.displayName = 'TableHead';

/**
 * Table body component. Wraps the HTML `<tbody>` element.
 */
export const TableBody = forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <tbody ref={ref} className={cn('', className)} {...props}>
        {children}
      </tbody>
    );
  },
);
TableBody.displayName = 'TableBody';

/**
 * Table row component for body rows. Wraps the HTML `<tr>` element.
 */
export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ children, className, clickable = false, onClick, ...props }, ref) => {
    return (
      <tr
        ref={ref}
        role={clickable ? 'button' : undefined}
        className={cn(
          clickable &&
            'cursor-pointer outline-none hover:bg-base-transparent-hover active:bg-base-transparent-pressed',
          className,
        )}
        {...props}
      >
        {children}
      </tr>
    );
  },
);
TableRow.displayName = 'TableRow';

const headerRowVariants = cva('sticky top-0', {
  variants: {
    appearance: {
      'no-background': 'bg-canvas',
      plain: 'bg-surface',
    },
  },
});

/**
 * Table header row component. Wraps the HTML `<tr>` element with header-specific styles.
 */
export const TableHeaderRow = forwardRef<
  HTMLTableRowElement,
  TableHeaderRowProps
>(({ children, className, ...props }, ref) => {
  const { appearance } = useTableContext({
    consumerName: 'TableHeaderRow',
    contextRequired: true,
  });
  return (
    <tr
      ref={ref}
      className={headerRowVariants({ appearance, className })}
      {...props}
    >
      {children}
    </tr>
  );
});
TableHeaderRow.displayName = 'TableHeaderRow';

const cellVariants = {
  root: cva('h-64 truncate p-12 body-3 text-base', {
    variants: {
      hideBelow: {
        xs: 'hidden xs:table-cell',
        sm: 'hidden sm:table-cell',
        md: 'hidden md:table-cell',
        lg: 'hidden lg:table-cell',
        xl: 'hidden xl:table-cell',
      },
    },
  }),
  inner: cva('flex flex-1 justify-end', {
    variants: {
      align: {
        left: 'text-left justify-start',
        right: 'text-right justify-end',
      },
    },
  }),
};

/**
 * Table data cell component. Wraps the HTML `<td>` element.
 */
export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ children, className, hideBelow, align = 'left', ...props }, ref) => {
    return (
      <td
        ref={ref}
        className={cellVariants.root({ hideBelow, className })}
        {...props}
      >
        <div className={cellVariants.inner({ align })}>{children}</div>
      </td>
    );
  },
);
TableCell.displayName = 'TableCell';

const cellContentVariants = cva('flex items-center gap-12 truncate', {
  variants: {
    align: {
      left: 'text-left',
      right: 'text-right',
    },
  },
});

/**
 * Cell content component. To be used inside a TableCell or inside tanstack column render.
 */
export const TableCellContent = forwardRef<
  HTMLDivElement,
  TableCellContentProps
>(
  (
    {
      children,
      className,
      align = 'left',
      leading,
      title,
      description,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cellContentVariants({ align, className })}
        {...props}
      >
        <div>{leading}</div>
        <div className='flex flex-col gap-4 truncate'>
          <div className='truncate body-2 text-base'>{title}</div>
          <div className='truncate body-3 text-muted'>{description}</div>
        </div>
      </div>
    );
  },
);
TableCellContent.displayName = 'TableCellContent';

const headerCellVariants = {
  root: cva('h-40 truncate p-12 body-3 text-base', {
    variants: {
      hideBelow: {
        xs: 'hidden xs:table-cell',
        sm: 'hidden sm:table-cell',
        md: 'hidden md:table-cell',
        lg: 'hidden lg:table-cell',
        xl: 'hidden xl:table-cell',
      },
    },
  }),
  content: cva('flex min-w-0 items-center gap-4', {
    variants: {
      align: {
        left: 'text-left justify-start',
        right: 'text-right justify-end',
      },
    },
  }),
};

/**
 * Table header cell component. Wraps the HTML `<th>` element.
 * Use TableSortButton for sortable columns; other children are trailing content.
 */
export const TableHeaderCell = forwardRef<
  HTMLTableCellElement,
  TableHeaderCellProps
>(({ children, className, hideBelow, align = 'left', ...props }, ref) => {
  return (
    <th
      ref={ref}
      className={headerCellVariants.root({ hideBelow, className })}
      {...props}
    >
      <div className='min-w-0'>
        <div className={headerCellVariants.content({ align })}>{children}</div>
      </div>
    </th>
  );
});
TableHeaderCell.displayName = 'TableHeaderCell';

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
export const TableActionBar = forwardRef<HTMLDivElement, TableActionBarProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex items-center gap-8 py-12', className)}
        {...props}
      >
        {children}
      </div>
    );
  },
);
TableActionBar.displayName = 'TableActionBar';

/**
 * Leading section of the action bar. Contains left-aligned actions.
 */
export const TableActionBarLeading = forwardRef<
  HTMLDivElement,
  TableActionBarLeadingProps
>(({ children, className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('flex items-center gap-8', className)}
      {...props}
    >
      {children}
    </div>
  );
});
TableActionBarLeading.displayName = 'TableActionBarLeading';

/**
 * Trailing section of the action bar. Contains right-aligned actions.
 */
export const TableActionBarTrailing = forwardRef<
  HTMLDivElement,
  TableActionBarTrailingProps
>(({ children, className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('ml-auto flex items-center gap-8', className)}
      {...props}
    >
      {children}
    </div>
  );
});
TableActionBarTrailing.displayName = 'TableActionBarTrailing';

/**
 * Loading row component displayed at the bottom of the table during infinite scroll loading.
 */
export const TableLoadingRow = forwardRef<HTMLDivElement, TableLoadingRowProps>(
  ({ children, className, ...props }, ref) => {
    const { isLoading } = useTableContext({
      consumerName: 'TableLoadingRow',
      contextRequired: true,
    });

    if (!isLoading) {
      return null;
    }

    return (
      <div
        {...props}
        ref={ref}
        className='flex h-80 w-full items-center justify-center p-12'
      >
        <Spot appearance='loader' size={48} />
      </div>
    );
  },
);
TableLoadingRow.displayName = 'TableLoadingRow';

/**
 * Clickable sort control for table header columns.
 * Displays the current sort state (asc/desc/idle) and triggers sort changes on click.
 */
export const TableInfoIcon = forwardRef<HTMLButtonElement, TableInfoIconProps>(
  ({ className, ...props }, ref) => {
    return (
      <InteractiveIcon {...props} iconType='filled' ref={ref}>
        <Information size={20} />
      </InteractiveIcon>
    );
  },
);
TableInfoIcon.displayName = 'TableInfoIcon';

const sortControlIconMap = {
  asc: ChevronAscending,
  desc: ChevronDescending,
  idle: ChevronUpDown,
};

const tableSortButtonVariants = {
  root: cva(
    [
      'group flex min-w-0 cursor-pointer items-center gap-4',
      'rounded-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
    ],
    {
      variants: {
        align: {
          right: 'flex-row-reverse',
          left: '',
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
export const TableSortButton = forwardRef<
  HTMLButtonElement,
  TableSortButtonProps
>(
  (
    {
      children,
      sortDirection,
      align = 'left',
      onToggleSort,
      className,
      onClick,
      ...props
    },
    ref,
  ) => {
    const { t } = useCommonTranslation();
    const Icon = sortControlIconMap[sortDirection || 'idle'];
    const ariaLabelMap = {
      asc: t('table.ascAriaLabel'),
      desc: t('table.descAriaLabel'),
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
        <InteractiveIcon
          tabIndex={-1}
          iconType='filled'
          ref={ref}
          className={tableSortButtonVariants.icon({
            active: Boolean(sortDirection),
          })}
        >
          <Icon size={20} />
        </InteractiveIcon>
      </button>
    );
  },
);
TableSortButton.displayName = 'TableSortButton';
