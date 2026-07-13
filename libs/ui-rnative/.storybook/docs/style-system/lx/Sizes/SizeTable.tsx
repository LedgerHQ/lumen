import { Text, View } from 'react-native';
import { useResolvedTheme, useSampleAccentColor } from '../';

export const SizeTable = () => {
  const theme = useResolvedTheme();
  const cells = Object.entries(theme.sizes);
  const accentColor = useSampleAccentColor();

  const formatCSSToken = (key: string): string => {
    return `--size-${key.replace('s', '')}`;
  };

  const renderSample = (value: number | string) => {
    const numericValue = value === '100%' ? 100 : Number(value);

    if (numericValue >= 100) {
      return (
        <Text style={{ fontSize: 10, color: 'grey' }}>Too large to show!</Text>
      );
    }

    return (
      <View
        style={{
          width: numericValue,
          height: numericValue,
          backgroundColor: accentColor,
          borderRadius: 4,
        }}
      />
    );
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
              <code>{`theme.sizes.${key}`}</code>
            </td>
            <td>
              <code>{key === 'full' ? '100%' : `${value}px`}</code>
            </td>
            <td>{renderSample(value)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
