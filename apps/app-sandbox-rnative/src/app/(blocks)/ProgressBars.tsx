import { Box, IconButton, ProgressBar, Text } from '@ledgerhq/lumen-ui-rnative';
import { ArrowLeft, ArrowRight } from '@ledgerhq/lumen-ui-rnative/symbols';
import { useEffect, useState } from 'react';

const STEP = 10;
const AUTO_STEP = 20;
const AUTO_INTERVAL_MS = 30_000;

const appearances = [
  'base',
  'accent',
  'success',
  'error',
  'warning',
  'decorative-blue',
  'decorative-pink',
  'decorative-purple',
  'decorative-green',
  'decorative-turquoise',
  'decorative-yellow',
  'decorative-orange',
  'decorative-red',
] as const;

const labelPositions = [
  'start-top',
  'start-bottom',
  'end-top',
  'end-bottom',
] as const;

export default function ProgressBars() {
  const [value, setValue] = useState(40);
  const [autoValue, setAutoValue] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAutoValue((v) => (v >= 100 ? 0 : v + AUTO_STEP));
    }, AUTO_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box lx={{ gap: 's32', width: 'full' }}>
      {/* Interactive */}
      <Box lx={{ gap: 's8', width: 'full' }}>
        <Text typography='body3' lx={{ color: 'muted' }}>
          Interactive
        </Text>
        <Box
          lx={{
            flexDirection: 'row',
            gap: 's12',
            alignItems: 'center',
          }}
        >
          <IconButton
            icon={ArrowLeft}
            size='xs'
            accessibilityLabel='Decrease'
            appearance='transparent'
            onPress={() => setValue((v) => Math.max(0, v - STEP))}
          />
          <Box lx={{ flex: 1 }}>
            <ProgressBar
              value={value}
              accessibilityLabel='Interactive progress'
              label={`${value}%`}
            />
          </Box>
          <IconButton
            icon={ArrowRight}
            size='xs'
            accessibilityLabel='Increase'
            appearance='transparent'
            onPress={() => setValue((v) => Math.min(100, v + STEP))}
          />
        </Box>
      </Box>

      {/* Animated */}
      <Box lx={{ gap: 's8', width: 'full' }}>
        <Text typography='body3' lx={{ color: 'muted' }}>
          Animated fill (+20 every 30s)
        </Text>
        <ProgressBar
          value={autoValue}
          appearance='accent'
          accessibilityLabel='Auto progress'
          label='Syncing accounts'
          labelPosition='start-top'
        />
      </Box>

      {/* Appearances */}
      <Box lx={{ gap: 's12', width: 'full' }}>
        <Text typography='body3' lx={{ color: 'muted' }}>
          Appearances
        </Text>
        {appearances.map((appearance) => (
          <ProgressBar
            key={appearance}
            value={60}
            appearance={appearance}
            accessibilityLabel={appearance}
            label={appearance}
          />
        ))}
      </Box>

      {/* Label positions */}
      <Box lx={{ gap: 's24', width: 'full' }}>
        <Text typography='body3' lx={{ color: 'muted' }}>
          Label positions
        </Text>
        {labelPositions.map((position) => (
          <ProgressBar
            key={position}
            value={40}
            accessibilityLabel={position}
            label={position}
            labelPosition={position}
          />
        ))}
      </Box>

      {/* Values */}
      <Box lx={{ gap: 's12', width: 'full' }}>
        <Text typography='body3' lx={{ color: 'muted' }}>
          Values
        </Text>
        {[0, 25, 50, 75, 100].map((v) => (
          <ProgressBar key={v} value={v} accessibilityLabel={`${v}%`} />
        ))}
      </Box>
    </Box>
  );
}
