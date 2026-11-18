import type {
  LottieAnimation,
  LottieViewRef,
  LottieSource,
} from '@ledgerhq/lumen-ui-rnative';
import { Box, Button, LottieView, Text } from '@ledgerhq/lumen-ui-rnative';
import { useRef, useState } from 'react';

const lottieContext = require.context(
  '../../../assets/lotties',
  false,
  /\.lottie$/,
);

// TODO: these animations have no dark variant yet, so both appearances share one file.
const animations = lottieContext.keys().map((key) => {
  const asset = lottieContext(key) as LottieSource;
  const animation: LottieAnimation = { light: asset, dark: asset };
  const name = key.replace(/^\.\/(lottie-)?/, '').replace(/\.lottie$/, '');
  return { name, animation };
});

export default function Lotties() {
  const [paused, setPaused] = useState(false);
  const [loops, setLoops] = useState(0);
  const onceRef = useRef<LottieViewRef>(null);
  const [first] = animations;

  if (!first) {
    return <Text>No animations in assets/lotties.</Text>;
  }

  return (
    <Box lx={{ gap: 's32' }}>
      <Box lx={{ gap: 's12' }}>
        <Text typography='body2SemiBold'>Looping</Text>
        <Box lx={{ flexDirection: 'row', flexWrap: 'wrap', gap: 's24' }}>
          {animations.map(({ name, animation }) => (
            <Box key={name} lx={{ alignItems: 'center', gap: 's4' }}>
              <LottieView
                animation={animation}
                loop
                paused={paused}
                lx={{ width: 's80', height: 's80' }}
              />
              <Text typography='body4' lx={{ color: 'muted' }}>
                {name}
              </Text>
            </Box>
          ))}
        </Box>
        <Button appearance='gray' onPress={() => setPaused((p) => !p)}>
          {paused ? 'Resume' : 'Pause'}
        </Button>
      </Box>
      <Box lx={{ gap: 's12' }}>
        <Text typography='body2SemiBold'>Played once</Text>
        <LottieView
          ref={onceRef}
          animation={first.animation}
          lx={{ width: 's80', height: 's80' }}
        />
        <Box lx={{ flexDirection: 'row', gap: 's8' }}>
          <Button appearance='gray' onPress={() => onceRef.current?.play()}>
            Play
          </Button>
          <Button appearance='gray' onPress={() => onceRef.current?.stop()}>
            Stop
          </Button>
        </Box>
      </Box>
      <Box lx={{ gap: 's12' }}>
        <Text typography='body2SemiBold'>Loop counter</Text>
        <LottieView
          animation={first.animation}
          loop
          onLoop={() => setLoops((count) => count + 1)}
          lx={{ width: 's80', height: 's80' }}
        />
        <Text typography='body3' lx={{ color: 'muted' }}>
          {`Loops: ${loops}`}
        </Text>
      </Box>
    </Box>
  );
}
