import { Box, Text, useStyleSheet } from '@ledgerhq/lumen-ui-rnative';
import LottieView from 'lottie-react-native';
import { Image } from 'react-native';
import lottieSecurityCheckOk from '../../../assets/lottie/lottie-security-check-ok.lottie';

const lottieSecurityCheckOkUri = Image.resolveAssetSource(
  lottieSecurityCheckOk,
).uri;

export default function Lottie() {
  const styles = useStyles();

  return (
    <Box lx={{ gap: 's32' }}>
      <Box style={styles.sectionContainer}>
        <Text style={styles.sectionDescription}>Lottie</Text>
        <LottieView
          source={{ uri: lottieSecurityCheckOkUri }}
          autoPlay
          loop
          style={styles.lottie}
        />
      </Box>
    </Box>
  );
}

const useStyles = () => {
  return useStyleSheet(
    (t) => ({
      sectionContainer: {
        gap: t.spacings.s12,
      },
      sectionDescription: {
        color: t.colors.text.muted,
        ...t.typographies.body2SemiBold,
      },
      lottie: {
        width: t.sizes.s128,
        height: t.sizes.s128,
      },
    }),
    [],
  );
};
