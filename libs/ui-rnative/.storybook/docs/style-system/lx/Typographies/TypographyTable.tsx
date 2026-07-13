import { Text } from 'react-native';
import { useResolvedTheme } from '../';

type TypographyCategory = 'heading' | 'body';

type TypographyTableProps = {
  category: TypographyCategory;
};

export const TypographyTable = ({ category }: TypographyTableProps) => {
  const theme = useResolvedTheme();
  const cells = Object.entries(theme.typographies.xs[category]);

  return (
    <table style={{ width: '100%', color: theme.colors.text.base }}>
      <thead>
        <tr>
          <th style={{ textAlign: 'left' }}>Token</th>
          <th style={{ textAlign: 'left' }}>Sample</th>
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
                  color: theme.colors.text.base,
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
