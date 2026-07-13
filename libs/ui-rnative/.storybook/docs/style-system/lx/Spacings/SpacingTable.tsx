import { View } from 'react-native';
import { useResolvedTheme, useSampleAccentColor } from '../';

export const SpacingTable = () => {
  const theme = useResolvedTheme();
  const cells = Object.entries(theme.spacings);
  const accentColor = useSampleAccentColor();

  const formatCSSToken = (key: string): string => {
    return `--spacing-${key.replace('s', '')}`;
  };

  return (
    <table style={{ width: '100%', color: theme.colors.text.base }}>
      <thead>
        <tr>
          <th style={{ textAlign: 'left' }}>Name</th>
          <th style={{ textAlign: 'left' }}>Theme object</th>
          <th style={{ textAlign: 'left' }}>Value</th>
          <th style={{ textAlign: 'left' }}>Sample</th>
        </tr>
      </thead>
      <tbody>
        {cells.map(([key, value], i) => (
          <tr key={i}>
            <td>
              <code>{formatCSSToken(key)}</code>
            </td>
            <td>
              <code>{`theme.spacings.${key}`}</code>
            </td>
            <td>
              <code>{`${value}px`}</code>
            </td>
            <td>
              <View
                style={{
                  width: value,
                  height: 16,
                  backgroundColor: accentColor,
                  borderRadius: 2,
                }}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
