/** Shared by the ESLint and oxlint rule tests. */
export const noHardcodedColorsCases = {
  valid: [
    { code: 'const s = { color: t.colors.text.base };' },
    { code: "const s = { backgroundColor: 'transparent' };" },
    { code: "const s = { color: 'currentColor' };" },
    { code: "const s = { color: 'inherit' };" },
    { code: "const s = { margin: '#fff' };" },
    { code: "const s = { [dynamicKey]: '#fff' };" },
    // The sample is source code under test, not a template string.
    // eslint-disable-next-line no-template-curly-in-string
    { code: 'const s = { color: `${token}` };' },
    { code: "const s = { color: 'primary' };" },
    { code: "const x = <Path fill='none' />;" },
    { code: 'const x = <Path fill={tokens.fill} />;' },
    { code: "const x = <Badge color='primary' />;" },
    { code: "const s = { color: '#fff' };", options: [{ allow: ['#FFF'] }] },
  ],
  invalid: [
    {
      code: "const s = { color: '#fff' };",
      errors: [
        { messageId: 'hardcodedColor', data: { value: '#fff' }, line: 1 },
      ],
    },
    {
      code: "const s = { backgroundColor: 'rgba(0, 0, 0, 0.15)' };",
      errors: [
        { messageId: 'hardcodedColor', data: { value: 'rgba(0, 0, 0, 0.15)' } },
      ],
    },
    {
      code: "const s = { borderColor: 'White' };",
      errors: [{ messageId: 'hardcodedColor', data: { value: 'White' } }],
    },
    {
      code: "const s = { 'shadowColor': '#000' };",
      errors: [{ messageId: 'hardcodedColor', data: { value: '#000' } }],
    },
    {
      code: 'const s = { color: `#fff` };',
      errors: [{ messageId: 'hardcodedColor', data: { value: '#fff' } }],
    },
    {
      code: "const s = { color: '#fff' as const };",
      errors: [{ messageId: 'hardcodedColor', data: { value: '#fff' } }],
    },
    {
      code: "const styles = useStyleSheet(() => ({ root: { backgroundColor: '#fff' } }));",
      errors: [{ messageId: 'hardcodedColor', data: { value: '#fff' } }],
    },
    {
      code: 'const x = <Path fill="#0082FC" />;',
      errors: [{ messageId: 'hardcodedColor', data: { value: '#0082FC' } }],
    },
    {
      code: "const x = <Path stroke={'red'} />;",
      errors: [{ messageId: 'hardcodedColor', data: { value: 'red' } }],
    },
    {
      code: 'const x = <TextInput placeholderTextColor="#999" />;',
      errors: [{ messageId: 'hardcodedColor', data: { value: '#999' } }],
    },
  ],
};
