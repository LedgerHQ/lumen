import { useResolvedTheme } from '../';

export const BreakpointTable = () => {
  const theme = useResolvedTheme();
  const cells = Object.entries(theme.breakpoints);

  return (
    <table style={{ width: '100%', color: theme.colors.text.base }}>
      <thead>
        <tr>
          <th style={{ textAlign: 'left' }}>Name</th>
          <th style={{ textAlign: 'left' }}>Theme object</th>
          <th style={{ textAlign: 'left' }}>Min width</th>
        </tr>
      </thead>
      <tbody>
        {cells.map(([key, value]) => (
          <tr key={key}>
            <td>
              <code>{key}</code>
            </td>
            <td>
              <code>
                {/^\d/.test(key)
                  ? `theme.breakpoints['${key}']`
                  : `theme.breakpoints.${key}`}
              </code>
            </td>
            <td>
              <code>{`${value}px`}</code>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
