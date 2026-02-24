import { View } from 'react-native';
import { resolveTheme, getSampleAccentColor } from '../';

export const BorderRadiusTable = () => {
  const borderRadius = resolveTheme().borderRadius;
  const cells = Object.entries(borderRadius);
  const accentColor = getSampleAccentColor();

  const formatCSSToken = (key: string): string => {
    return `--border-radius-${key}`;
  };

  return (
    <table style={{ width: '100%' }}>
      <thead>
        <tr>
          <th>Name</th>
          <th>Theme object</th>
          <th>Value</th>
          <th>Sample</th>
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
