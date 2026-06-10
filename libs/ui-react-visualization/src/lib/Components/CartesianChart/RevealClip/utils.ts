import type { Series } from '../../../utils/types';

export const computeDataFingerprint = ({
  series,
}: {
  series: Series[];
}): string => {
  return series.map((s) => s.data?.join(',') ?? '').join('|');
};
