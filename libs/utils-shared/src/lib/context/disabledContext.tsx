import { createSafeContext } from './createSafeContext';

type DisabledContextValue = {
  disabled?: boolean;
};

const [DisabledProvider, _useDisabledContext] =
  createSafeContext<DisabledContextValue>('Disabled', { disabled: false });

const useDisabledContext = ({
  consumerName,
  contextRequired,
  mergeWith,
}: {
  consumerName: string;
  contextRequired?: boolean;
  mergeWith?: DisabledContextValue;
}) => {
  const disabledContext = _useDisabledContext({
    consumerName: consumerName,
    contextRequired: contextRequired ?? false,
  });

  return mergeWith?.disabled || disabledContext.disabled;
};

export { DisabledProvider, useDisabledContext };
