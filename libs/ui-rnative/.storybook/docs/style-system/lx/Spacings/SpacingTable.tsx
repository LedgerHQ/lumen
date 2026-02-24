import { View } from 'react-native';
import { resolveTheme, getSampleAccentColor } from '../';

export const SpacingTable = () => {
  const spacings = resolveTheme().spacings;
  const cells = Object.entries(spacings);
  const accentColor = getSampleAccentColor();

  const formatCSSToken = (key: string): string => {
    return `--spacing-${key.replace('s', '')}`;
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
