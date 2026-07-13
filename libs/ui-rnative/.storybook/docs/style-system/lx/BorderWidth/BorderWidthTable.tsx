import { View } from 'react-native';
import { useResolvedTheme, useSampleAccentColor } from '../';

export const BorderWidthTable = () => {
  const theme = useResolvedTheme();
  const cells = Object.entries(theme.borderWidth);
  const accentColor = useSampleAccentColor();

  const formatCSSToken = (key: string): string => {
    return `--stroke-${key}`;
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
