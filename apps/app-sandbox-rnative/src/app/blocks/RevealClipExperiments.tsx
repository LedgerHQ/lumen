import { Box, Button, Text } from '@ledgerhq/lumen-ui-rnative';
import { useTheme } from '@ledgerhq/lumen-ui-rnative/styles';
import { useEffect, useId, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedProps,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Svg, { ClipPath, Defs, G, Line, Path, Rect } from 'react-native-svg';

const CHART_WIDTH = 320;
const CHART_HEIGHT = 160;
const PADDING = 24;
const DATA = [10, 45, 98, 45, 22, 52, 21, 20, 37];
const ANIM_DURATION_MS = 1500;
const PATH_LENGTH_ESTIMATE = 1200;

const AnimatedPath = Animated.createAnimatedComponent(Path);

const buildPath = (values: number[]): string => {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const stepX = (CHART_WIDTH - PADDING * 2) / (values.length - 1);
  return values
    .map((v, i) => {
      const x = PADDING + i * stepX;
      const y =
        PADDING +
        (CHART_HEIGHT - PADDING * 2) -
        ((v - min) / range) * (CHART_HEIGHT - PADDING * 2);
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');
};

const LINE_PATH = buildPath(DATA);

const Grid = () => {
  const { theme } = useTheme();
  const stroke = theme.colors.border.mutedSubtleTransparent;
  const xStep = (CHART_WIDTH - PADDING * 2) / 4;
  const yStep = (CHART_HEIGHT - PADDING * 2) / 4;
  return (
    <G testID='grid'>
      {[0, 1, 2, 3, 4].map((i) => (
        <Line
          key={`v-${i}`}
          x1={PADDING + i * xStep}
          y1={PADDING}
          x2={PADDING + i * xStep}
          y2={CHART_HEIGHT - PADDING}
          stroke={stroke}
          strokeWidth={1}
          strokeDasharray='3 3'
        />
      ))}
      {[0, 1, 2, 3, 4].map((i) => (
        <Line
          key={`h-${i}`}
          x1={PADDING}
          y1={PADDING + i * yStep}
          x2={CHART_WIDTH - PADDING}
          y2={PADDING + i * yStep}
          stroke={stroke}
          strokeWidth={1}
          strokeDasharray='3 3'
        />
      ))}
    </G>
  );
};

const SectionHeader = ({ title }: { title: string }) => {
  const { theme } = useTheme();
  return (
    <Text
      style={{
        fontSize: 11,
        color: theme.colors.bg.muted,
        textTransform: 'uppercase',
        marginBottom: 8,
      }}
    >
      {title}
    </Text>
  );
};

/**
 * Variant 1 — Static ClipPath at fixed 60%.
 * Sanity baseline. If the line shows partially, the ClipPath mechanism itself
 * works on this platform.
 */
const StaticClip = () => {
  const id = useId().replace(/:/g, '_');
  const { theme } = useTheme();
  return (
    <View>
      <SectionHeader title='1. Static ClipPath at 60% (baseline)' />
      <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
        <Defs>
          <ClipPath id={id}>
            <Rect
              x={0}
              y={0}
              width={(CHART_WIDTH - PADDING * 2) * 0.6 + PADDING}
              height={CHART_HEIGHT}
            />
          </ClipPath>
        </Defs>
        <Grid />
        <G clipPath={`url(#${id})`}>
          <Path
            d={LINE_PATH}
            stroke={theme.colors.bg.accent}
            strokeWidth={2}
            fill='none'
          />
        </G>
      </Svg>
    </View>
  );
};

/**
 * Variant 2 — State-driven ClipPath width with rotating id.
 * Android caches a ClipPath's content by `id`. Rotating the id on every
 * frame forces a fresh clip to be evaluated. The corresponding `url(#...)`
 * reference is updated to match.
 */
const StateClip = () => {
  const baseId = useId().replace(/:/g, '_');
  const { theme } = useTheme();
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number | null>(null);

  const start = (): void => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    setProgress(0);
    const t0 = performance.now();
    const tick = (): void => {
      const t = Math.min((performance.now() - t0) / ANIM_DURATION_MS, 1);
      setProgress(t);
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    start();
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const id = `${baseId}-${Math.round(progress * 10000)}`;

  return (
    <View>
      <SectionHeader title='2. State-driven ClipPath (id rotation)' />
      <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
        <Defs>
          <ClipPath id={id}>
            <Rect
              x={0}
              y={0}
              width={progress * CHART_WIDTH}
              height={CHART_HEIGHT}
            />
          </ClipPath>
        </Defs>
        <Grid />
        <G clipPath={`url(#${id})`}>
          <Path
            d={LINE_PATH}
            stroke={theme.colors.bg.accent}
            strokeWidth={2}
            fill='none'
          />
        </G>
      </Svg>
      <Button onPress={start}>Replay</Button>
    </View>
  );
};

/**
 * Variant 3 — Reanimated-driven ClipPath with id rotation.
 * Reanimated's `withTiming` runs the animation on the UI thread; a
 * `useAnimatedReaction` bridges the value back to a JS state on each frame,
 * which in turn rotates the ClipPath `id` so Android re-evaluates the clip.
 */
const AnimatedClip = () => {
  const baseId = useId().replace(/:/g, '_');
  const { theme } = useTheme();
  const sv = useSharedValue(0);
  const [progress, setProgress] = useState(0);

  const start = (): void => {
    sv.value = 0;
    sv.value = withTiming(1, { duration: ANIM_DURATION_MS });
  };

  useEffect(() => {
    start();
  }, []);

  useAnimatedReaction(
    () => sv.value,
    (val) => {
      runOnJS(setProgress)(val);
    },
    [],
  );

  const id = `${baseId}-${Math.round(progress * 10000)}`;

  return (
    <View>
      <SectionHeader title='3. Reanimated → state bridge (id rotation)' />
      <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
        <Defs>
          <ClipPath id={id}>
            <Rect
              x={0}
              y={0}
              width={progress * CHART_WIDTH}
              height={CHART_HEIGHT}
            />
          </ClipPath>
        </Defs>
        <Grid />
        <G clipPath={`url(#${id})`}>
          <Path
            d={LINE_PATH}
            stroke={theme.colors.bg.accent}
            strokeWidth={2}
            fill='none'
          />
        </G>
      </Svg>
      <Button onPress={start}>Replay</Button>
    </View>
  );
};

/**
 * Variant 4 — Two SVG layers. Grid in its own absolutely-positioned SVG, data
 * layer wrapped in an Animated.View with overflow:hidden whose width grows.
 * Grid stays fully visible at all times.
 */
const TwoLayerView = () => {
  const { theme } = useTheme();
  const sv = useSharedValue(0);

  const start = (): void => {
    sv.value = 0;
    sv.value = withTiming(CHART_WIDTH, { duration: ANIM_DURATION_MS });
  };

  useEffect(() => {
    start();
  }, []);

  const dataLayerStyle = useAnimatedStyle(() => ({
    width: sv.value,
    height: CHART_HEIGHT,
    overflow: 'hidden' as const,
  }));

  return (
    <View>
      <SectionHeader title='4. Two layers (View overflow:hidden)' />
      <View style={{ width: CHART_WIDTH, height: CHART_HEIGHT }}>
        <Svg
          width={CHART_WIDTH}
          height={CHART_HEIGHT}
          style={StyleSheet.absoluteFill}
        >
          <Grid />
        </Svg>
        <Animated.View style={dataLayerStyle}>
          <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
            <Path
              d={LINE_PATH}
              stroke={theme.colors.bg.accent}
              strokeWidth={2}
              fill='none'
            />
          </Svg>
        </Animated.View>
      </View>
      <Button onPress={start}>Replay</Button>
    </View>
  );
};

/**
 * Variant 5 — strokeDasharray + strokeDashoffset reveal. No ClipPath.
 * The path is drawn from start to end like a pen tracing the line. Most
 * reliable cross-platform approach. Grid is unaffected.
 */
const StrokeDashReveal = () => {
  const { theme } = useTheme();
  const sv = useSharedValue(PATH_LENGTH_ESTIMATE);

  const start = (): void => {
    sv.value = PATH_LENGTH_ESTIMATE;
    sv.value = withTiming(0, {
      duration: ANIM_DURATION_MS,
      easing: Easing.out(Easing.cubic),
    });
  };

  useEffect(() => {
    start();
  }, []);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: sv.value,
  }));

  return (
    <View>
      <SectionHeader title='5. strokeDasharray reveal (no ClipPath)' />
      <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
        <Grid />
        <AnimatedPath
          d={LINE_PATH}
          stroke={theme.colors.bg.accent}
          strokeWidth={2}
          fill='none'
          strokeDasharray={`${PATH_LENGTH_ESTIMATE} ${PATH_LENGTH_ESTIMATE}`}
          animatedProps={animatedProps}
        />
      </Svg>
      <Button onPress={start}>Replay</Button>
    </View>
  );
};

export const RevealClipExperiments = () => {
  return (
    <Box lx={{ gap: 's24', width: 'full' }}>
      <StaticClip />
      <StateClip />
      <AnimatedClip />
      <TwoLayerView />
      <StrokeDashReveal />
    </Box>
  );
};
