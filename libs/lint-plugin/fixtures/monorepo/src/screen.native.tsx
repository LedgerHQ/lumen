import { useStyleSheet } from '@ledgerhq/lumen-ui-rnative/styles';

export const useStyles = () =>
  useStyleSheet((t) => ({
    root: { backgroundColor: '#fff', borderRadius: 9999, width: t.sizes.s24 },
  }));

export const Fixture = () => <View style={{ padding: 16, color: 'white' }} />;
