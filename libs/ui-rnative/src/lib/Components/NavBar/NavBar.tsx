import { useStyleSheet } from '../../../styles';
import { Box } from '../Utility';
import { NavBarProps } from './types';

/**
 * NavBar component for top navigation
 */
export function NavBar({ children, ...props }: NavBarProps) {
  const styles = useStyles();

  return (
    <Box style={styles.container} {...props}>
      {children}
    </Box>
  );
}

NavBar.displayName = 'NavBar';

const useStyles = () =>
  useStyleSheet(
    (t) => ({
      container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: t.spacings.s16,
        paddingVertical: t.spacings.s12,
        backgroundColor: t.colors.bg.base,
      },
    }),
    [],
  );
