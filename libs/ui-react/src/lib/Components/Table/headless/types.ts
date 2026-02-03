import {
  HTMLAttributes,
  TableHTMLAttributes,
  TdHTMLAttributes,
  ThHTMLAttributes,
} from 'react';

/**
 * Props for the TableCore root component
 */
export type TableCoreProps = {
  /**
   * The appearance of the body
   * @default 'no-background'
   */
  appearance?: 'no-background' | 'plain';
  /**
   * The table content (TableHead, TableBody)
   */
  children: React.ReactNode;
  /**
   * Custom classname
   */
  className?: string;
} & TableHTMLAttributes<HTMLTableElement>;

/**
 * Props for the TableCoreHead component
 */
export type TableHeadProps = {
  /**
   * The header content (TableHeaderRow)
   */
  children: React.ReactNode;
  /**
   * Custom classname
   */
  className?: string;
} & HTMLAttributes<HTMLTableSectionElement>;

/**
 * Props for the TableCoreBody component
 */
export type TableBodyProps = {
  /**
   * The body content (TableRow)
   */
  children: React.ReactNode;
  /**
   * Custom classname
   */
  className?: string;
} & HTMLAttributes<HTMLTableSectionElement>;

/**
 * Props for the TableCoreRow component
 */
export type TableRowProps = {
  /**
   * Whether the row is clickable
   * @default false
   */
  clickable?: boolean;
  /**
   * The function to call when the row is clicked
   */
  onClick?: () => void;
  /**
   * The row content (TableCell)
   */
  children: React.ReactNode;
  /**
   * Custom classname
   */
  className?: string;
} & HTMLAttributes<HTMLTableRowElement>;

/**
 * Props for the TableCoreHeaderRow component
 */
export type TableHeaderRowProps = {
  /**
   * The header row content (TableHeaderCell)
   */
  children: React.ReactNode;
  /**
   * Custom classname
   */
  className?: string;
} & HTMLAttributes<HTMLTableRowElement>;

/**
 * Props for the TableCoreCell component
 */
export type TableCellProps = {
  /**
   * The cell content
   */
  children?: React.ReactNode;
  /**
   * Custom classname
   */
  className?: string;
  /**
   * Text alignment within the cell
   */
  align?: 'left' | 'center' | 'right';
} & TdHTMLAttributes<HTMLTableCellElement>;

/**
 * Props for the TableCoreHeaderCell component
 */
export type TableHeaderCellProps = {
  /**
   * The header cell content
   */
  children?: React.ReactNode;
  /**
   * Custom classname
   */
  className?: string;
  /**
   * Text alignment within the cell
   */
  align?: 'left' | 'center' | 'right';
  /**
   * Scope of the header cell
   * @default 'col'
   */
  scope?: 'col' | 'row' | 'colgroup' | 'rowgroup';
} & ThHTMLAttributes<HTMLTableCellElement>;

/**
 * Props for the TableCoreActionBar component
 */
export type TableActionBarProps = {
  /**
   * The action bar content (TableActionBarLeading, TableActionBarTrailing)
   */
  children: React.ReactNode;
  /**
   * Custom classname
   */
  className?: string;
} & HTMLAttributes<HTMLDivElement>;

/**
 * Props for the TableCoreActionBarLeading component
 */
export type TableActionBarLeadingProps = {
  /**
   * The leading content (left-aligned actions)
   */
  children: React.ReactNode;
  /**
   * Custom classname
   */
  className?: string;
} & HTMLAttributes<HTMLDivElement>;

/**
 * Props for the TableCoreActionBarTrailing component
 */
export type TableActionBarTrailingProps = {
  /**
   * The trailing content (right-aligned actions)
   */
  children: React.ReactNode;
  /**
   * Custom classname
   */
  className?: string;
} & HTMLAttributes<HTMLDivElement>;
