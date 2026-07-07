import type { ReactNode } from 'react';

export const SectionHeader = ({
  title,
  description,
}: {
  title: string;
  description?: string;
}) => (
  <div className='mb-48'>
    <h2 className='mb-8 responsive-display-4 text-base'>{title}</h2>
    {description && <p className='text-muted'>{description}</p>}
  </div>
);

export type TokenTableRow = {
  key: string;
  cells: ReactNode[];
};

/**
 * Theme-aware table used by the foundation token docs, styled to match the
 * Storybook docs tables of the React Native package. Layout/borders use static
 * Tailwind utilities; only the per-token sample cells use inline styles.
 */
export const TokenTable = ({
  headers,
  rows,
}: {
  headers: string[];
  rows: TokenTableRow[];
}) => (
  <div className='overflow-hidden rounded-lg border border-muted-subtle'>
    <table className='w-full border-collapse body-3 text-base'>
      <thead>
        <tr>
          {headers.map((header) => (
            <th
              key={header}
              className='border border-muted-subtle bg-muted p-12 text-start body-2-semi-bold text-base'
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map(({ key, cells }) => (
          <tr key={key}>
            {cells.map((cell, index) => (
              <td
                key={index}
                className='border border-muted-subtle p-12 text-left align-middle'
              >
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
