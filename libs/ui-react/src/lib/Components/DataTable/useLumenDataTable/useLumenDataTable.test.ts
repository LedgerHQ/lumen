import { ColumnDef } from '@tanstack/react-table';
import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useLumenDataTable } from './useLumenDataTable';

type TestData = {
  id: number;
  name: string;
  value: number;
};

const testData: TestData[] = [
  { id: 1, name: 'Alpha', value: 100 },
  { id: 2, name: 'Beta', value: 200 },
  { id: 3, name: 'Gamma', value: 300 },
];

const testColumns: ColumnDef<TestData>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'value', header: 'Value' },
];

describe('useLumenDataTable', () => {
  it('should return a table instance with row model', () => {
    const { result } = renderHook(() =>
      useLumenDataTable({
        data: testData,
        columns: testColumns,
      }),
    );

    const table = result.current;
    expect(table).toBeDefined();
    expect(table.getRowModel().rows).toHaveLength(3);
  });

  it('should expose header groups from column definitions', () => {
    const { result } = renderHook(() =>
      useLumenDataTable({
        data: testData,
        columns: testColumns,
      }),
    );

    const headerGroups = result.current.getHeaderGroups();
    expect(headerGroups).toHaveLength(1);
    expect(headerGroups[0].headers).toHaveLength(2);
  });

  it('should preserve column meta for Lumen-specific properties', () => {
    const columnsWithMeta: ColumnDef<TestData>[] = [
      { accessorKey: 'name', header: 'Name', meta: { align: 'start' } },
      {
        accessorKey: 'value',
        header: 'Value',
        meta: { align: 'end', hideBelow: 'md' },
      },
    ];

    const { result } = renderHook(() =>
      useLumenDataTable({
        data: testData,
        columns: columnsWithMeta,
      }),
    );

    const headers = result.current.getHeaderGroups()[0].headers;
    expect(headers[0].column.columnDef.meta?.align).toBe('start');
    expect(headers[1].column.columnDef.meta?.align).toBe('end');
    expect(headers[1].column.columnDef.meta?.hideBelow).toBe('md');
  });

  it('should update when data changes', () => {
    const { result, rerender } = renderHook(
      ({ data }) =>
        useLumenDataTable({
          data,
          columns: testColumns,
        }),
      { initialProps: { data: testData } },
    );

    expect(result.current.getRowModel().rows).toHaveLength(3);

    rerender({ data: [...testData, { id: 4, name: 'Delta', value: 400 }] });
    expect(result.current.getRowModel().rows).toHaveLength(4);
  });
});
