import type { ReactNode } from 'react';

export type ScrubberContextValue = {
  /**
   * Whether scrubbing interactions are enabled.
   */
  enableScrubbing: boolean;
  /**
   * The current data index of the scrubber, or undefined when idle.
   */
  scrubberPosition: number | undefined;
  /**
   * Callback to update the scrubber position.
   */
  onScrubberPositionChange: (index: number | undefined) => void;
};

export type ScrubberProviderProps = {
  children: ReactNode;
  /**
   * Width of the chart in pixels. Used to bound gesture detection.
   */
  width: number;
  /**
   * Height of the chart in pixels. Used to bound gesture detection.
   */
  height: number;
  /**
   * Whether scrubbing is enabled.
   */
  enableScrubbing: boolean;
  /**
   * Optional external callback fired whenever the scrubber position changes.
   */
  onScrubberPositionChange?: (index: number | undefined) => void;
};

export type ScrubberProps = {
  /**
   * Formats a label string shown above the reference line for a given data index.
   * When omitted, no label is rendered.
   */
  label?: (dataIndex: number) => string;
  /**
   * Hides the vertical reference line.
   * @default false
   */
  hideLine?: boolean;
  /**
   * Hides the semi-transparent overlay that dims data after the scrubber position.
   * @default false
   */
  hideOverlay?: boolean;
  /**
   * Shows the beacon dots on each series at the scrubbed data index.
   * @default false
   */
  showBeacons?: boolean;
};
