/** Shared by the ESLint and oxlint rule tests. */
export const noHardcodedStyleLiteralsCases = {
  valid: [
    { code: 'const size = { width: 24 };' },
    {
      code: 'const styles = useStyleSheet((t) => ({ root: { width: t.sizes.s24 } }));',
    },
    {
      code: 'const styles = useStyleSheet(() => ({ root: { width: 0, margin: 0 } }));',
    },
    {
      code: 'const styles = useStyleSheet(() => ({ root: { flex: 1, opacity: 0.5, zIndex: 2 } }));',
    },
    {
      code: 'const styles = useStyleSheet(() => ({ root: { shadowOffset: { width: 0, height: 2 } } }));',
    },
    {
      code: "const styles = useStyleSheet(() => ({ root: { width: 'auto' } }));",
    },
    {
      code: 'const styles = useStyleSheet(() => ({ root: { width: size } }));',
    },
    {
      code: 'const styles = useStyleSheet(() => ({ root: { padding: 8 } }));',
      options: [{ ignoreProperties: ['padding'] }],
    },
  ],
  invalid: [
    {
      code: 'const styles = useStyleSheet(() => ({ root: { borderRadius: 9999 } }));',
      errors: [
        {
          messageId: 'hardcodedLiteral',
          data: { property: 'borderRadius', value: '9999' },
        },
      ],
    },
    {
      code: "const styles = useStyleSheet(() => ({ root: { width: '100%' } }));",
      errors: [
        {
          messageId: 'hardcodedLiteral',
          data: { property: 'width', value: "'100%'" },
        },
      ],
    },
    {
      code: 'const styles = StyleSheet.create({ root: { marginTop: -8 } });',
      errors: [
        {
          messageId: 'hardcodedLiteral',
          data: { property: 'marginTop', value: '-8' },
        },
      ],
    },
    {
      code: 'const x = <View style={{ padding: 16 }} />;',
      errors: [
        {
          messageId: 'hardcodedLiteral',
          data: { property: 'padding', value: '16' },
        },
      ],
    },
    {
      code: 'const x = <ScrollView contentContainerStyle={[{ gap: 4 }]} />;',
      errors: [
        {
          messageId: 'hardcodedLiteral',
          data: { property: 'gap', value: '4' },
        },
      ],
    },
    {
      code: 'const styles = useStyleSheet(() => ({ root: { height: 12 as number } }));',
      errors: [
        {
          messageId: 'hardcodedLiteral',
          data: { property: 'height', value: '12' },
        },
      ],
    },
  ],
};
