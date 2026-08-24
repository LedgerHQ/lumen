import { Text } from 'react-native';
import { useStyleSheet } from '../../../../styles';
import type { BaseInputCounterProps } from './types';

const useCounterStyles = () => {
  return useStyleSheet(
    (t) => ({
      counterText: {
        ...t.typographies.body3,
        flexShrink: 0,
        color: t.colors.text.muted,
      },
    }),
    [],
  );
};

/**
 * Character counter rendered below the control inside `BaseInput`.
 *
 * @internal
 */
export const BaseInputCounter = ({
  count,
  maxCount,
}: BaseInputCounterProps) => {
  const styles = useCounterStyles();

  return (
    <Text style={styles.counterText} accessibilityLiveRegion='polite'>
      {`${count}/${maxCount}`}
    </Text>
  );
};
