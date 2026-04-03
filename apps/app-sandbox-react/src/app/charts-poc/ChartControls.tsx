import type { DatasetKey } from './constants';
import { DATASET_LABELS } from './constants';

const Toggle = ({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) => (
  <label
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      fontSize: 12,
      cursor: 'pointer',
      color: 'var(--text-base)',
    }}
  >
    <input
      type='checkbox'
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      style={{ accentColor: 'var(--background-accent)' }}
    />
    {label}
  </label>
);

export const ChartControls = ({
  dataset,
  onDatasetChange,
  showGrid,
  onShowGridChange,
  showXAxis,
  onShowXAxisChange,
  showYAxis,
  onShowYAxisChange,
  showTooltip,
  onShowTooltipChange,
  showCursor,
  onShowCursorChange,
}: {
  dataset: DatasetKey;
  onDatasetChange: (v: DatasetKey) => void;
  showGrid: boolean;
  onShowGridChange: (v: boolean) => void;
  showXAxis: boolean;
  onShowXAxisChange: (v: boolean) => void;
  showYAxis: boolean;
  onShowYAxisChange: (v: boolean) => void;
  showTooltip: boolean;
  onShowTooltipChange: (v: boolean) => void;
  showCursor: boolean;
  onShowCursorChange: (v: boolean) => void;
}) => (
  <div
    style={{
      display: 'flex',
      gap: 32,
      marginBottom: 24,
      flexWrap: 'wrap',
      alignItems: 'flex-start',
    }}
  >
    <fieldset
      style={{
        border: '1px solid var(--border-muted)',
        borderRadius: 8,
        padding: '12px 16px',
      }}
    >
      <legend
        style={{
          fontSize: 12,
          color: 'var(--text-muted)',
          padding: '0 4px',
        }}
      >
        Dataset
      </legend>
      <div style={{ display: 'flex', gap: 8 }}>
        {(Object.keys(DATASET_LABELS) as DatasetKey[]).map((key) => (
          <button
            key={key}
            onClick={() => onDatasetChange(key)}
            style={{
              padding: '6px 12px',
              fontSize: 12,
              borderRadius: 6,
              border: '1px solid var(--border-muted)',
              backgroundColor:
                dataset === key ? 'var(--background-accent)' : 'transparent',
              color:
                dataset === key ? 'var(--text-on-accent)' : 'var(--text-muted)',
              cursor: 'pointer',
            }}
          >
            {DATASET_LABELS[key]}
          </button>
        ))}
      </div>
    </fieldset>

    <fieldset
      style={{
        border: '1px solid var(--border-muted)',
        borderRadius: 8,
        padding: '12px 16px',
      }}
    >
      <legend
        style={{
          fontSize: 12,
          color: 'var(--text-muted)',
          padding: '0 4px',
        }}
      >
        Features
      </legend>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <Toggle label='Grid' checked={showGrid} onChange={onShowGridChange} />
        <Toggle
          label='X Axis'
          checked={showXAxis}
          onChange={onShowXAxisChange}
        />
        <Toggle
          label='Y Axis'
          checked={showYAxis}
          onChange={onShowYAxisChange}
        />
        <Toggle
          label='Tooltip'
          checked={showTooltip}
          onChange={onShowTooltipChange}
        />
        <Toggle
          label='Cursor'
          checked={showCursor}
          onChange={onShowCursorChange}
        />
      </div>
    </fieldset>
  </div>
);
