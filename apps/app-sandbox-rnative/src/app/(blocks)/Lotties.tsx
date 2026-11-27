import { success } from '@ledgerhq/lumen-symbols/lotties/success';
import {
  Box,
  Button,
  LottieView,
  Switch,
  Text,
  type LottieViewRef,
} from '@ledgerhq/lumen-ui-rnative';
import type { ReactNode } from 'react';
import { useRef, useState } from 'react';

const SPEED_STEP = 0.5;
const MIN_SPEED = 0.5;
const MAX_SPEED = 4;

export default function Lotties() {
  const ref = useRef<LottieViewRef>(null);
  const [speed, setSpeed] = useState(1);
  const [loop, setLoop] = useState(true);

  const changeSpeed = (delta: number): void =>
    setSpeed((previous) =>
      Math.min(MAX_SPEED, Math.max(MIN_SPEED, previous + delta)),
    );

  return (
    <Box lx={{ gap: 's24', width: 'full', paddingHorizontal: 's16' }}>
      <Box lx={{ alignItems: 'center' }}>
        <LottieView
          ref={ref}
          animation={success}
          loop={loop}
          speed={speed}
          lx={{ width: 's144', height: 's144' }}
        />
      </Box>

      <Section title='Ref'>
        <Row>
          <Button
            size='sm'
            appearance='accent'
            onPress={() => ref.current?.play()}
          >
            Play
          </Button>
          <Button
            size='sm'
            appearance='gray'
            onPress={() => ref.current?.pause()}
          >
            Pause
          </Button>
          <Button
            size='sm'
            appearance='gray'
            onPress={() => ref.current?.stop()}
          >
            Stop
          </Button>
        </Row>
      </Section>

      <Section title={`Speed: ${speed}x`}>
        <Row>
          <Button
            size='sm'
            appearance='gray'
            disabled={speed <= MIN_SPEED}
            onPress={() => changeSpeed(-SPEED_STEP)}
          >
            Slower
          </Button>
          <Button size='sm' appearance='gray' onPress={() => setSpeed(1)}>
            Reset
          </Button>
          <Button
            size='sm'
            appearance='gray'
            disabled={speed >= MAX_SPEED}
            onPress={() => changeSpeed(SPEED_STEP)}
          >
            Faster
          </Button>
        </Row>
      </Section>

      <Section title='Props'>
        <Toggle label='loop' checked={loop} onChange={setLoop} />
      </Section>
    </Box>
  );
}

const Section = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <Box lx={{ gap: 's8' }}>
    <Text typography='body2SemiBold' lx={{ color: 'base' }}>
      {title}
    </Text>
    {children}
  </Box>
);

const Row = ({ children }: { children: ReactNode }) => (
  <Box lx={{ flexDirection: 'row', gap: 's8', flexWrap: 'wrap' }}>
    {children}
  </Box>
);

const Toggle = ({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) => (
  <Box
    lx={{
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}
  >
    <Text typography='body2' lx={{ color: 'base' }}>
      {label}
    </Text>
    <Switch checked={checked} onCheckedChange={onChange} />
  </Box>
);
