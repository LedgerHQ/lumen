import { Text, View } from 'react-native';
import { resolveTheme, getSampleAccentColor } from '../';

export const SizeTable = () => {
  const sizes = resolveTheme().sizes;
  const cells = Object.entries(sizes);
  const accentColor = getSampleAccentColor();

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
