export type DataPoint = {
  timestamp: number;
  value: number;
};

export type Series = {
  id: string;
  label: string;
  data: DataPoint[];
  color?: string;
};
