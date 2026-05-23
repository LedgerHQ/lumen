import type { Series } from '../../../utils/types';

export const useComputeDataFingerprint = ({
  series,
}: {
  series: Series[];
}): string => {
  return series.map((s) => s.data?.join(',') ?? '').join('|');
};
