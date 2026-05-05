import type { RefObject } from 'react';

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
  children: React.ReactNode;
  /**
   * Ref to the root SVG element where event listeners will be attached.
   */
  svgRef: RefObject<SVGSVGElement | null>;
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
