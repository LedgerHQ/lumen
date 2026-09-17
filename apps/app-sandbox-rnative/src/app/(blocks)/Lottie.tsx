import { Box, Button, Text, useStyleSheet } from '@ledgerhq/lumen-ui-rnative';
import type { Dotlottie } from '@lottiefiles/dotlottie-react-native';
import { DotLottie } from '@lottiefiles/dotlottie-react-native';
import { useRef, useState } from 'react';

export default function Lottie() {
  const styles = useStyles();
  const ref = useRef<Dotlottie>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  function togglePlayback() {
    if (isPlaying) {
      ref.current?.pause();
      setIsPlaying(false);
    } else {
      ref.current?.play();
      setIsPlaying(true);
    }
  }

  return (
    <Box lx={{ gap: 's32' }}>
      <Box style={styles.sectionContainer}>
        <Text style={styles.sectionDescription}>Lottie</Text>
        <DotLottie
          ref={ref}
          // eslint-disable-next-line @typescript-eslint/no-require-imports
          source={require('../../../assets/lottie/lottie-security-check-ok.lottie')}
          loop
          style={styles.lottie}
        />
        <Button appearance='gray' onPress={togglePlayback}>
          {isPlaying ? 'Pause' : 'Resume'}
        </Button>
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
