export type LabelDrawingArea = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type LineLabelAxis = {
  data?: string[] | number[];
  tickLabelFormatter?: (value: number | string) => string;
};

export type LineLabelContext = {
  dataIndex: number;
  value: number | string;
  label: string;
};
