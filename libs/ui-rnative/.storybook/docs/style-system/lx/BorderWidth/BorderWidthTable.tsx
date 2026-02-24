import { View } from 'react-native';
import { resolveTheme, getSampleAccentColor } from '../';

export const BorderWidthTable = () => {
  const borderWidth = resolveTheme().borderWidth;
  const cells = Object.entries(borderWidth);
  const accentColor = getSampleAccentColor();

  const formatCSSToken = (key: string): string => {
    return `--stroke-${key}`;
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
              <code>{`theme.borderWidth.${key}`}</code>
            </td>
            <td>
              <code>{`${value}px`}</code>
            </td>
            <td>
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderWidth: value,
                  borderColor: accentColor,
                  borderRadius: 8,
                  backgroundColor: 'transparent',
                }}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
