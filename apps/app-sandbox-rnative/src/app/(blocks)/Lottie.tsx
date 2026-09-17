/* eslint-disable @typescript-eslint/no-require-imports */
import { Box, Button, useStyleSheet } from '@ledgerhq/lumen-ui-rnative';
import type { Dotlottie } from '@lottiefiles/dotlottie-react-native';
import { DotLottie } from '@lottiefiles/dotlottie-react-native';
import { useRef, useState } from 'react';

const LOTTIE_SOURCES = [
  require('../../../assets/lottie/lottie-bluetooth.lottie'),
  require('../../../assets/lottie/lottie-bluetooth-to-usb.lottie'),
  require('../../../assets/lottie/lottie-success.lottie'),
  require('../../../assets/lottie/lottie-error.lottie'),
  require('../../../assets/lottie/lottie-info.lottie'),
  require('../../../assets/lottie/lottie-usb.lottie'),
  require('../../../assets/lottie/lottie-loading.lottie'),
  require('../../../assets/lottie/lottie-security-check-ok.lottie'),
];

export default function Lottie() {
  const styles = useStyles();
  const refs = useRef<(Dotlottie | null)[]>([]);
  const [isPlaying, setIsPlaying] = useState(true);

  function togglePlayback() {
    if (isPlaying) {
      refs.current.forEach((ref) => ref?.pause());
      setIsPlaying(false);
    } else {
      refs.current.forEach((ref) => ref?.play());
      setIsPlaying(true);
    }
  }

  return (
    <Box style={{ flex: 1 }} lx={{ gap: 's32' }}>
      <Box style={styles.sectionContainer}>
        {LOTTIE_SOURCES.map((source, index) => (
          <DotLottie
            key={index}
            ref={(instance) => {
              refs.current[index] = instance as Dotlottie | null;
            }}
            source={source}
            loop
            style={styles.lottie}
          />
        ))}
      </Box>
      <Box lx={{ paddingHorizontal: 's12' }}>
        <Box lx={{ gap: 's8' }}>
          <Button appearance='gray' onPress={togglePlayback}>
            {isPlaying ? 'Pause' : 'Resume'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

const useStyles = () => {
  return useStyleSheet(
    (t) => ({
      sectionContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: t.spacings.s12,
        flexWrap: 'wrap',
      },
      sectionDescription: {
        color: t.colors.text.muted,
        marginBottom: t.spacings.s8,
        ...t.typographies.body2SemiBold,
      },
      lottie: {
        width: t.sizes.s80,
        height: t.sizes.s80,
      },
    }),
    [],
  );
};
