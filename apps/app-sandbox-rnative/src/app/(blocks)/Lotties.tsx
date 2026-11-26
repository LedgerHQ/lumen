import { success } from '@ledgerhq/lumen-symbols/lotties/success';
import { LottieView } from '@ledgerhq/lumen-ui-rnative';

export default function Lotties() {
  return (
    <LottieView animation={success} loop lx={{ width: 's80', height: 's80' }} />
  );
}
