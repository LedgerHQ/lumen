import { cn, createSafeContext } from '@ledgerhq/lumen-utils-shared';
import { cva } from 'class-variance-authority';
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
  TableHeaderProps,
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
  TableGroupHeaderRowProps,
} from './types';
import { useThrottledScrollBottom } from './utils/useThrottledScrollBottom';

const [TableProvider, useTableContext] = createSafeContext<{
  appearance: TableRootProps['appearance'];
  loading: TableRootProps['loading'];
}>('Table');

const tableVariants = cva(
  'relative scrollbar-none w-full max-w-full border-collapse overflow-x-auto rounded-lg',
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
  className,
  onScrollBottom,
  loading,
  ref,
  ...props
}: TableRootProps) => {
  const handleScroll = useThrottledScrollBottom({
    onScrollBottom,
    loading,
  });

  return (
    <TableProvider value={{ appearance, loading }}>
      <div
        {...props}
        ref={ref}
        className={tableVariants({ appearance, className })}
        onScroll={handleScroll}
      >
        {children}
      </div>
    </TableProvider>
  );
};
TableRoot.displayName = 'TableRoot';

export const Table = ({ children, className, ref, ...props }: TableProps) => {
  return (
    <table
      {...props}
      className={cn('w-full max-w-full table-fixed', className)}
      ref={ref}
    >
      {children}
    </table>
  );
};
Table.displayName = 'Table';

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
TableHeader.displayName = 'TableHeader';

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
TableBody.displayName = 'TableBody';

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
export const TableHeaderRow = ({
  children,
  className,
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
      className={headerRowVariants({ appearance, className })}
      {...props}
    >
      {children}
    </tr>
  );
};
TableHeaderRow.displayName = 'TableHeaderRow';

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
          {children}
        </div>
      </td>
    </tr>
  );
};
TableGroupHeaderRow.displayName = 'TableGroupHeaderRow';

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
        },
      },
    },
  ),
  inner: cva('flex flex-1 justify-end', {
    variants: {
      align: {
        start: 'text-start justify-start',
        end: 'text-end justify-end',
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
TableCell.displayName = 'TableCell';

const cellContentVariants = cva('flex items-center gap-12 truncate', {
  variants: {
    align: {
      start: 'text-start',
      end: 'text-end',
    },
  },
});

/**
 * Cell content component. To be used inside a TableCell or inside tanstack column render.
 */
export const TableCellContent = ({
  className,
  align = 'start',
  leadingContent,
  title,
  description,
  ref,
  ...props
}: TableCellContentProps) => {
  return (
    <div
      ref={ref}
      className={cellContentVariants({ align, className })}
      {...props}
    >
      <div>{leadingContent}</div>
      <div className='flex flex-col gap-4 truncate'>
        <div className='truncate body-2 text-base'>{title}</div>
        <div className='truncate body-3 text-muted'>{description}</div>
      </div>
    </div>
  );
};
TableCellContent.displayName = 'TableCellContent';

const headerCellVariants = {
  root: cva('group/header-cell h-40 truncate p-12 body-3 text-base', {
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
  content: cva('flex min-w-0 items-center gap-4 truncate', {
    variants: {
      align: {
        start: 'text-start justify-start',
        end: 'text-end justify-end',
      },
    },
  }),
  trailingContent: cva(
    'flex items-center justify-center opacity-0 group-hover/header-cell:opacity-100',
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
          <div className='flex items-center justify-center opacity-0 group-hover/header-cell:opacity-100'>
            {trailingContent}
          </div>
        </div>
      </div>
    </th>
  );
};
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
TableActionBar.displayName = 'TableActionBar';

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
TableActionBarLeading.displayName = 'TableActionBarLeading';

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
TableActionBarTrailing.displayName = 'TableActionBarTrailing';

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
        'flex h-80 w-full items-center justify-center p-12',
        className,
      )}
    >
      <Spot appearance='loader' size={48} />
    </div>
  );
};
TableLoadingRow.displayName = 'TableLoadingRow';

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
      className={className}
      ref={ref}
    >
      <Information size={20} />
    </InteractiveIcon>
  );
};
TableInfoIcon.displayName = 'TableInfoIcon';

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
        false: 'opacity-0 group-hover/header-cell:opacity-100',
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

      <Icon
        size={20}
        className={tableSortButtonVariants.icon({
          active: Boolean(sortDirection),
        })}
      />
    </button>
  );
};
TableSortButton.displayName = 'TableSortButton';
