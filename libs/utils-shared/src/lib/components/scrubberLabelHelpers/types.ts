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
  /**
   * The scrubbed data index.
   */
  dataIndex: number;
  /**
   * The raw x-axis value at the scrubbed index: the axis `data` entry, or the
   * index itself when the axis has no `data`.
   */
  value: number | string;
  /**
   * The x-axis value formatted like its tick labels, using the axis
   * `tickLabelFormatter` when set.
   */
  label: string;
};
