import { LumenTheme } from '../../types';
import { AddEntriesNegative } from '../../types/utility.types';

export const resolveNegativeSpacing = <
  Input extends LumenTheme['spacings'],
  Output = AddEntriesNegative<Input>,
>(
  spacings: Input = {} as Input,
): Output => {
  return {
    ...spacings,
    ...Object.fromEntries(
      Object.entries(spacings).map(([key, value]) => [`-${key}`, value * -1]),
    ),
  } as Output;
};
