import { Box, IconButton, Stepper } from '@ledgerhq/lumen-ui-rnative';
import { ArrowLeft, ArrowRight } from '@ledgerhq/lumen-ui-rnative/symbols';
import { useEffect, useRef, useState } from 'react';

const MAX_STEPS = 8;

export default function Steppers() {
  const [step, setStep] = useState(1);
  const [autoStep, setAutoStep] = useState(0);

  const isReversing = useRef(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (autoStep >= MAX_STEPS) {
        isReversing.current = true;
      } else if (autoStep <= 0) {
        isReversing.current = false;
      }
      setAutoStep((s) => s + (isReversing.current ? -1 : 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [autoStep]);

  return (
    <Box lx={{ gap: 's32', width: 'full' }}>
      {/* Interactive stepper */}
      <Box lx={{ gap: 's16', alignItems: 'center' }}>
        <Box
          lx={{
            flexDirection: 'row',
            gap: 's16',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <IconButton
            icon={ArrowLeft}
            size='xs'
            accessibilityLabel='Previous step'
            appearance='transparent'
            onPress={() => setStep((v) => Math.max(0, v - 1))}
          />
          <Stepper currentStep={step} totalSteps={5} />
          <IconButton
            icon={ArrowRight}
            size='xs'
            accessibilityLabel='Next step'
            appearance='transparent'
            onPress={() => setStep((v) => Math.min(5, v + 1))}
          />
        </Box>
      </Box>

      <Box
        lx={{
          gap: 's12',
          width: 'full',
          flexDirection: 'row',
          flexWrap: 'wrap',
        }}
      >
        {Array.from({ length: MAX_STEPS }).map((_, i) => (
          <Stepper
            currentStep={Math.max(0, Math.min(autoStep, i + 1))}
            totalSteps={i + 1}
          />
        ))}
      </Box>
      <Box
        lx={{
          gap: 's12',
          width: 'full',
          flexDirection: 'row',
          flexWrap: 'wrap',
        }}
      >
        <Stepper currentStep={1} totalSteps={1} label='🎉' />
        <Stepper currentStep={2} totalSteps={5} disabled />
      </Box>
    </Box>
  );
}
