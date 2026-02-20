import { Text } from 'react-native';
import { resolveTheme } from '../';

type TypographyCategory = 'heading' | 'body';

type TypographyTableProps = {
  category: TypographyCategory;
};

export const TypographyTable = ({ category }: TypographyTableProps) => {
  const typographies = resolveTheme().typographies.xs[category];

  const cells = Object.entries(typographies);

  return (
    <table style={{ width: '100%' }}>
      <thead>
        <tr>
          <th>Token</th>
          <th>Sample</th>
        </tr>
      </thead>
      <tbody>
        {cells.map(([key, value]) => (
          <tr key={key}>
            <td>
              <code>{key}</code>
            </td>
            <td>
              <Text
                style={{
                  fontFamily: value.fontFamily,
                  fontSize: value.fontSize,
                  fontWeight: value.fontWeight,
                  lineHeight: value.lineHeight,
                  letterSpacing: value.letterSpacing,
                }}
              >
                The quick brown fox jumps over the lazy dog
              </Text>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
