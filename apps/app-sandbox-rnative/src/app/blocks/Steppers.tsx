import { Box, Text, IconButton, Stepper } from '@ledgerhq/lumen-ui-rnative';
import { useTheme } from '@ledgerhq/lumen-ui-rnative/styles';
import { ArrowLeft, ArrowRight } from '@ledgerhq/lumen-ui-rnative/symbols';
import { useState } from 'react';

export const Steppers = () => {
  const [step, setStep] = useState(1);
  const totalSteps = 5;
  const { theme } = useTheme();

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
          <Stepper currentStep={step} totalSteps={totalSteps} />
          <IconButton
            icon={ArrowRight}
            size='xs'
            accessibilityLabel='Next step'
            appearance='transparent'
            onPress={() => setStep((v) => Math.min(totalSteps, v + 1))}
          />
        </Box>
      </Box>

      {/* Disabled stepper */}
      <Box lx={{ gap: 's8', alignItems: 'center' }}>
        <Text
          lx={{ color: 'muted' }}
          style={{ ...theme.typographies.body3SemiBold }}
        >
          Disabled
        </Text>
        <Stepper currentStep={2} totalSteps={totalSteps} disabled />
      </Box>

      {/* Custom label stepper */}
      <Box lx={{ gap: 's8', alignItems: 'center' }}>
        <Text
          lx={{ color: 'muted' }}
          style={{ ...theme.typographies.body3SemiBold }}
        >
          Custom label
        </Text>
        <Stepper currentStep={3} totalSteps={totalSteps} label='A' />
      </Box>
    </Box>
  );
};
