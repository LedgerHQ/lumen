import { cn } from '@ledgerhq/lumen-utils-shared';
import type { ReactNode } from 'react';

type DocTableProps = {
  /** Column header cells, left to right. */
  headers: ReactNode[];
  /** Table body: an array of rows, each an array of cells aligned to `headers`. */
  rows: ReactNode[][];
  /**
   * Optional fixed width per column (px number or CSS string). Use it to size
   * the first column so the rest fills the remaining space.
   */
  columnWidths?: (string | number | undefined)[];
  /** Extra classes on the `<table>` element. */
  className?: string;
};

/**
 * A minimal, full-width documentation table for MDX guides.
 *
 * Storybook's MDX compiler does not enable GFM, so markdown pipe tables render
 * as raw text. Use this component instead:
 *
 * @example
 * <DocTable
 *   headers={['Field', 'Description']}
 *   rows={[
 *     [<code>id</code>, 'Stable, unique identifier.'],
 *     [<code>data</code>, 'Array of numbers.'],
 *   ]}
 * />
 */
export const DocTable: React.FC<DocTableProps> = ({
  headers,
  rows,
  columnWidths,
  className,
}) => {
  return (
    <table className={cn('my-16 w-full border-collapse text-left', className)}>
      <thead>
        <tr>
          {headers.map((header, index) => (
            <th
              key={index}
              style={{ width: columnWidths?.[index] }}
              className='h-48 border-b border-muted bg-muted px-12 py-8 body-2-semi-bold text-base'
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIndex) => (
          <tr key={rowIndex} className='h-48 bg-transparent!'>
            {row.map((cell, cellIndex) => (
              <td
                key={cellIndex}
                className='border-b border-muted px-12 py-8 body-2 text-muted'
              >
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
