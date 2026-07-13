import { View } from 'react-native';
import { useResolvedTheme, useSampleAccentColor } from '../';

export const BorderRadiusTable = () => {
  const theme = useResolvedTheme();
  const cells = Object.entries(theme.borderRadius);
  const accentColor = useSampleAccentColor();

  const formatCSSToken = (key: string): string => {
    return `--border-radius-${key}`;
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
              <code>{`theme.borderRadius.${key}`}</code>
            </td>
            <td>
              <code>{`${value}px`}</code>
            </td>
            <td>
              <View style={{ paddingVertical: 12 }}>
                <View
                  style={{
                    width: 64,
                    height: 64,
                    backgroundColor: accentColor,
                    borderRadius: value,
                  }}
                />
              </View>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
