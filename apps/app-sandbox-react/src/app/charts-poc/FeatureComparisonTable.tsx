import { useState } from 'react';

type FeatureEntry = {
  feature: string;
  recharts: string;
  victory: string;
  visx: string;
  details: {
    recharts: string;
    victory: string;
    visx: string;
  };
};

const FEATURE_MATRIX: FeatureEntry[] = [
  {
    feature: 'Level',
    recharts: 'High',
    victory: 'Mid',
    visx: 'Low',
    details: {
      recharts:
        'Provides pre-built, ready-to-use chart components (<LineChart>, <BarChart>, <PieChart>). Minimal configuration needed for common use cases. Trade-off: harder to break out of built-in patterns when you need something non-standard.',
      victory:
        'Middle ground between high-level convenience and low-level control. Offers composable components (VictoryLine, VictoryAxis, VictoryArea) that can be mixed freely inside a VictoryChart container, but still abstracts away scale/layout math.',
      visx: 'Thin React wrappers around D3 primitives. You manually wire scales, axes, shapes, and interactions. Maximum flexibility but requires understanding of D3 concepts (scales, domains, ranges). Best when you need pixel-level control over every SVG element.',
    },
  },
  {
    feature: 'Bundle (gzip)',
    recharts: '~150kB',
    victory: '~120kB',
    visx: '~90kB (tree-shake)',
    details: {
      recharts:
        'Single package import. v3 improved tree-shaking but the core is still monolithic. Using <LineChart> pulls in most of the library. The UMD bundle is ~540kB uncompressed. For a Lumen sub-package (@ledgerhq/lumen-ui-react-visualization), this is the heaviest option.',
      victory:
        'Modular packages (victory-line, victory-axis, etc.) but the umbrella "victory" import pulls everything. Selective imports can reduce the bundle, though in practice most charts need victory-core + several sub-packages. Comparable to Recharts when fully loaded.',
      visx: 'Best tree-shaking story. Each package (@visx/shape, @visx/scale, @visx/axis...) is independently installable. A LineChart only imports what it uses. In this POC, only ~90kB gzipped is loaded. Ideal for the ADR side-note about splitting Lumen into lazy-loadable packages.',
    },
  },
  {
    feature: 'Weekly DLs',
    recharts: '2.4M',
    victory: '445K',
    visx: '300K',
    details: {
      recharts:
        'Dominant adoption (2.4M weekly downloads, 26.9K GitHub stars). Largest StackOverflow/GitHub Discussions community. Issues get quick responses. v3 is actively maintained with releases every few weeks (latest v3.8.1, March 2026).',
      victory:
        'Solid community (445K downloads, 11.1K stars). Maintained by NearForm (formerly Formidable Labs). Release cadence is slower than Recharts but stable. Good documentation at commerce.nearform.com/open-source/victory.',
      visx: 'Niche but reputable (300K downloads, 20.7K stars). Maintained by Airbnb. Less frequent releases (last major: v3.12.0, Nov 2024) but the API is stable and rarely needs breaking changes. Smaller community means fewer ready-made examples.',
    },
  },
  {
    feature: 'React Native',
    recharts: 'No',
    victory: 'Yes (Victory Native)',
    visx: 'No (patterns portable)',
    details: {
      recharts:
        'Web-only. No React Native counterpart exists. For the Wallet 4.0 mobile app, a separate charting solution would be needed, meaning two different codebases for charts. This is the biggest drawback given the ADR requirement for API consistency across technologies.',
      victory:
        'Only library with a real cross-platform story. Victory Native (legacy) uses react-native-svg for rendering. Victory Native XL (v40+) uses React Native Skia + Reanimated for 60fps GPU-accelerated charts. Both share the same declarative API as Victory web. XL requires @shopify/react-native-skia which needs validation against RN 0.79.',
      visx: 'Web-only, but because it is low-level D3+React, the patterns (scales, data transforms, layout math) can be ported to any renderer. A React Native counterpart could be built using react-native-svg with the same scale/layout logic. However, this would require custom development effort.',
    },
  },
  {
    feature: 'TypeScript',
    recharts: 'Full (v3 generics)',
    victory: 'Full',
    visx: 'Full',
    details: {
      recharts:
        'v3 introduced full TypeScript generics for data and dataKey props. The Tooltip, Axis, and all chart components are strongly typed. Custom content renderers have well-defined prop types. This is a significant improvement over v2 which had loose typing.',
      victory:
        'Full TypeScript support with typed props for all components. Style objects are typed. Event handlers receive typed datum objects. The typing is solid but some advanced patterns (custom data accessors, event compositions) require manual type annotations.',
      visx: 'Excellent TypeScript support. Each package exports its own types. D3 scale types flow through correctly. The granular package structure means you get precise types for exactly the primitives you use. Type inference works well with the functional composition pattern.',
    },
  },
  {
    feature: 'Chart types built-in',
    recharts: 'Line, Bar, Area, Pie, Radar...',
    victory: 'Line, Bar, Area, Pie, Polar...',
    visx: 'Compose from primitives',
    details: {
      recharts:
        'Ships with LineChart, BarChart, AreaChart, PieChart, RadarChart, ScatterChart, FunnelChart, RadialBarChart, Treemap, and ComposedChart (mix line+bar+area). Each is a self-contained component. Adding a new chart type the library does not support requires workarounds or ejecting to lower-level APIs.',
      victory:
        'Ships with VictoryLine, VictoryBar, VictoryArea, VictoryPie, VictoryPolarAxis, VictoryScatter, VictoryCandlestick, VictoryHistogram, and more. Components compose inside VictoryChart or VictoryGroup. Easier than Recharts to create hybrid/custom chart layouts.',
      visx: 'No pre-built chart components. Instead provides primitives: LinePath, AreaClosed, Bar, Arc, Pie from @visx/shape; scaleLinear, scaleTime from @visx/scale; AxisBottom, AxisLeft from @visx/axis. You compose these into any chart type. The ADR mentions future Donut/Pie and Bar charts -- visx can build any of these but each requires manual assembly.',
    },
  },
  {
    feature: 'Gradient fill',
    recharts: 'SVG defs',
    victory: 'SVG defs',
    visx: 'LinearGradient component',
    details: {
      recharts:
        'Requires manually adding <defs><linearGradient> inside the chart JSX, then referencing it via fill="url(#id)" on <Area> components. Works but is verbose. Gradient IDs must be unique when multiple charts are on the same page.',
      victory:
        'Same SVG defs approach. You place a hidden <svg> with <defs> outside the chart and reference gradients by ID in VictoryArea style props. Slightly more boilerplate than Recharts because the defs live outside the chart component tree.',
      visx: 'Provides a dedicated <LinearGradient> component from @visx/gradient that handles SVG defs registration automatically. Cleaner API: just place <LinearGradient id="..." from={color} to={color} /> inside the SVG and reference it. Also supports RadialGradient and pattern fills.',
    },
  },
  {
    feature: 'Tooltip',
    recharts: 'Built-in + custom',
    victory: 'VictoryTooltip + Voronoi',
    visx: 'useTooltip + manual',
    details: {
      recharts:
        'Drop-in <Tooltip /> component that automatically finds the nearest data point. Supports custom content via the content prop (render function or React element). Formatter props for quick label changes. Tooltip positioning, animation, and cursor tracking are handled automatically.',
      victory:
        'VictoryTooltip renders styled flyout tooltips. Combined with VictoryVoronoiContainer, it uses Voronoi tessellation to determine the nearest data point -- efficient for dense datasets. The labelComponent prop accepts any React element. Flyout styling is done via style objects.',
      visx: 'Provides useTooltip() hook and <TooltipWithBounds> component for positioning. You manually handle mouse events, compute the nearest data point (using d3-array bisector), and show/hide the tooltip. Most work but also most control over tooltip appearance, positioning, and behavior.',
    },
  },
  {
    feature: 'Cursor line',
    recharts: 'Tooltip cursor prop',
    victory: 'VoronoiContainer + onActivated',
    visx: 'Manual SVG line',
    details: {
      recharts:
        'The <Tooltip cursor={...} /> prop renders a vertical or horizontal line following the mouse. Accepts style props (stroke, strokeWidth, strokeDasharray). Requires no additional code -- works out of the box when Tooltip is enabled.',
      victory:
        'VictoryVoronoiContainer provides onActivated/onDeactivated callbacks that report active data points. In this POC, we track the cursor X position via onActivated and render a separate VictoryLine as the cursor. An alternative is VictoryCursorContainer (dedicated cursor) but it cannot be combined with Voronoi tooltips without createContainer().',
      visx: 'Fully manual. In the mouse event handler, we compute the cursor X position from the scale, then render an SVG <line> element at that position. This gives complete control over cursor appearance and behavior (snap-to-point, vertical/horizontal, crosshair, etc.) but requires the most code.',
    },
  },
  {
    feature: 'Theming',
    recharts: 'CSS vars in props',
    victory: 'Style objects + CSS vars',
    visx: 'CSS vars in SVG attrs',
    details: {
      recharts:
        'Stroke, fill, and style props accept CSS variable references directly (e.g. stroke="var(--color-crypto-bitcoin)"). CartesianGrid, Axis, and Tooltip all support inline style objects. However, Recharts does not have a built-in theme system -- you must pass token values to each component individually.',
      victory:
        'Uses JS style objects throughout. CSS variables work inside these objects (e.g. { stroke: "var(--border-muted)" }). Victory also has a VictoryTheme system where you define a theme object with default styles for all chart elements. This aligns well with Lumen\'s token-based approach -- a Lumen theme could be created once and applied globally.',
      visx: "SVG attributes accept CSS variables directly. Since visx renders plain SVG elements, you can also use className for Tailwind/CSS-based styling. This is the most flexible theming approach and integrates naturally with Lumen's Tailwind-based design tokens. No abstraction layer between you and the SVG.",
    },
  },
  {
    feature: 'Effort to implement',
    recharts: 'Low',
    victory: 'Medium',
    visx: 'High',
    details: {
      recharts:
        'Fastest path to a working chart. In this POC, the Recharts implementation required ~140 lines including the custom tooltip. Data format requires merging multiple lines into a flat array (one quirk), but otherwise it is mostly declarative JSX configuration. Ideal for the ADR\'s "Effort Required" driver (weight: 5).',
      victory:
        'Moderate effort. In this POC, ~150 lines. Composing VictoryChart + VictoryLine + VictoryAxis is straightforward. The main friction point was the cursor implementation -- VictoryVoronoiContainer does not natively expose a cursor line, requiring a workaround with onActivated + a separate VictoryLine.',
      visx: 'Most effort. In this POC, ~240 lines. You must manually create scales, wire mouse events, compute nearest points with bisectors, manage tooltip state, and render SVG elements. However, this effort yields the most maintainable long-term architecture because every piece is explicit and replaceable.',
    },
  },
  {
    feature: 'Customizability',
    recharts: 'Medium',
    victory: 'Medium-High',
    visx: 'Maximum',
    details: {
      recharts:
        'Good for standard patterns. Custom tooltips, custom axis ticks, reference lines/areas are well-supported. However, non-standard layouts (e.g. charts with custom clip paths, unusual coordinate systems, mixed Canvas+SVG) are difficult or impossible. You are constrained by the component tree structure.',
      victory:
        "More flexible than Recharts. Custom data components (replace the default line renderer), functional style props (style based on datum values), and the ability to compose arbitrary chart elements. The VictoryTheme system also allows deep style customization. The main limitation is that you are still within Victory's rendering pipeline.",
      visx: "Full control. Since visx is just React components rendering SVG, you can mix visx primitives with raw SVG, add Canvas layers, implement custom interactions (brush, zoom, pan), or even replace individual pieces with your own implementations. This is particularly valuable for the ADR's future requirements (reference lines, 500+ interactive markers, draggable elements).",
    },
  },
];

const thStyle: React.CSSProperties = {
  padding: '12px 16px',
  textAlign: 'left',
  fontSize: 13,
  fontWeight: 700,
  color: 'var(--text-base)',
};

const tdStyle: React.CSSProperties = {
  padding: '10px 16px',
  fontSize: 13,
  color: 'var(--text-muted)',
};

const detailCellStyle: React.CSSProperties = {
  padding: '8px 16px 12px',
  fontSize: 12,
  lineHeight: 1.6,
  color: 'var(--text-muted)',
  verticalAlign: 'top',
};

const chevronStyle = (open: boolean): React.CSSProperties => ({
  display: 'inline-block',
  transition: 'transform 0.2s',
  transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
  marginRight: 8,
  fontSize: 10,
  color: 'var(--text-muted)',
});

const FeatureRow = ({ row, index }: { row: FeatureEntry; index: number }) => {
  const [open, setOpen] = useState(false);
  const bg =
    index % 2 === 0 ? 'var(--background-surface)' : 'var(--background-base)';

  return (
    <>
      <tr
        onClick={() => setOpen((v) => !v)}
        style={{
          borderTop: '1px solid var(--border-muted)',
          backgroundColor: bg,
          cursor: 'pointer',
          userSelect: 'none',
        }}
      >
        <td style={{ ...tdStyle, fontWeight: 600 }}>
          <span style={chevronStyle(open)}>&#9654;</span>
          {row.feature}
        </td>
        <td style={tdStyle}>{row.recharts}</td>
        <td style={tdStyle}>{row.victory}</td>
        <td style={tdStyle}>{row.visx}</td>
      </tr>
      {open && (
        <tr
          style={{
            backgroundColor: bg,
            borderTop: '1px dashed var(--border-muted)',
          }}
        >
          <td
            style={{
              ...detailCellStyle,
              fontWeight: 600,
              color: 'var(--text-base)',
            }}
          >
            Details
          </td>
          <td style={detailCellStyle}>{row.details.recharts}</td>
          <td style={detailCellStyle}>{row.details.victory}</td>
          <td style={detailCellStyle}>{row.details.visx}</td>
        </tr>
      )}
    </>
  );
};

export const FeatureComparisonTable = () => (
  <>
    <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>
      Feature Comparison
    </h2>
    <p style={{ color: 'var(--text-muted)', marginBottom: 16, fontSize: 13 }}>
      Click any row to expand detailed notes for each library.
    </p>
    <div
      style={{
        borderRadius: 12,
        overflow: 'hidden',
        border: '1px solid var(--border-muted)',
        maxWidth: 960,
      }}
    >
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: 'var(--background-muted)' }}>
            <th style={thStyle}>Feature</th>
            <th style={thStyle}>Recharts v3</th>
            <th style={thStyle}>Victory v37</th>
            <th style={thStyle}>visx v3</th>
          </tr>
        </thead>
        <tbody>
          {FEATURE_MATRIX.map((row, i) => (
            <FeatureRow key={row.feature} row={row} index={i} />
          ))}
        </tbody>
      </table>
    </div>
  </>
);
