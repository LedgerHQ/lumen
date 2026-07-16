import { View } from 'react-native';
import { useResolvedTheme } from '../';

export const ShadowTable = () => {
  const theme = useResolvedTheme();
  const cells = Object.entries(theme.shadows);

  const formatShadow = (shadowArray: any[]): string => {
    return shadowArray
      .map(
        (shadow) =>
          `${shadow.offsetX}px ${shadow.offsetY}px ${shadow.blurRadius}px ${shadow.spreadDistance}px ${shadow.color}`,
      )
      .join(', ');
  };

  const formatCSSToken = (key: string): string => {
    return `--shadow-${key}`;
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
              <code>{`theme.shadows.${key}`}</code>
            </td>
            <td>
              <code style={{ fontSize: '11px' }}>{formatShadow(value)}</code>
            </td>
            <td>
              <View style={{ paddingVertical: 12 }}>
                <View
                  style={{
                    width: 64,
                    height: 64,
                    backgroundColor: '#fff',
                    borderRadius: 8,
                    shadowColor: value[0].color,
                    shadowOffset: {
                      width: value[0].offsetX,
                      height: value[0].offsetY,
                    },
                    shadowOpacity: 1,
                    shadowRadius: value[0].blurRadius,
                    elevation: 8,
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
