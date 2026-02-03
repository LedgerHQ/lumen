import { cn, createSafeContext } from '@ledgerhq/lumen-utils-shared';
import { forwardRef } from 'react';
import {
  TableActionBarLeadingProps,
  TableActionBarProps,
  TableActionBarTrailingProps,
  TableBodyProps,
  TableCellProps,
  TableHeaderCellProps,
  TableHeaderRowProps,
  TableHeadProps,
  TableCoreProps,
  TableRowProps,
} from './types';

const [TableCoreProvider, useTableCoreContext] = createSafeContext<{
  appearance: TableCoreProps['appearance'];
}>('TableCore');

/**
 * Root table component. Wraps the HTML `<table>` element.
 *
 * @example
 * <TableCore>
 *   <TableHead>
 *     <TableHeaderRow>
 *       <TableHeaderCell>Name</TableHeaderCell>
 *     </TableHeaderRow>
 *   </TableHead>
 *   <TableBody>
 *     <TableRow>
 *       <TableCell>John</TableCell>
 *     </TableRow>
 *   </TableBody>
 * </TableCore>
 */
export const TableCore = forwardRef<HTMLTableElement, TableCoreProps>(
  ({ children, appearance = 'no-background', className, ...props }, ref) => {
    return (
      <TableCoreProvider value={{ appearance }}>
        <div
          style={{ scrollbarWidth: 'none' }}
          className={cn(
            'h-320 w-full border-collapse overflow-auto rounded-lg',
            {
              'bg-canvas': appearance === 'no-background',
              'bg-surface': appearance === 'plain',
            },
            className,
          )}
          {...props}
        >
          <table className='w-full' ref={ref}>
            {children}
          </table>
        </div>
      </TableCoreProvider>
    );
  },
);
TableCore.displayName = 'TableCore';

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

/**
 * Table header row component. Wraps the HTML `<tr>` element with header-specific styles.
 */
export const TableHeaderRow = forwardRef<
  HTMLTableRowElement,
  TableHeaderRowProps
>(({ children, className, ...props }, ref) => {
  const { appearance } = useTableCoreContext({
    consumerName: 'TableHeaderRow',
    contextRequired: true,
  });
  return (
    <tr
      ref={ref}
      className={cn(
        'sticky top-0',
        {
          'bg-canvas': appearance === 'no-background',
          'bg-surface': appearance === 'plain',
        },
        className,
      )}
      {...props}
    >
      {children}
    </tr>
  );
});
TableHeaderRow.displayName = 'TableHeaderRow';

const cellAlignmentClasses = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
} as const;

/**
 * Table data cell component. Wraps the HTML `<td>` element.
 */
export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ children, className, align = 'left', ...props }, ref) => {
    return (
      <td
        ref={ref}
        className={cn(
          'p-12 body-3 text-base',
          cellAlignmentClasses[align],
          className,
        )}
        {...props}
      >
        {children}
      </td>
    );
  },
);
TableCell.displayName = 'TableCell';

/**
 * Table header cell component. Wraps the HTML `<th>` element.
 */
export const TableHeaderCell = forwardRef<
  HTMLTableCellElement,
  TableHeaderCellProps
>(({ children, className, align = 'left', scope = 'col', ...props }, ref) => {
  return (
    <th
      ref={ref}
      scope={scope}
      className={cn(
        'p-12 body-3 text-base',
        cellAlignmentClasses[align],
        className,
      )}
      {...props}
    >
      {children}
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
