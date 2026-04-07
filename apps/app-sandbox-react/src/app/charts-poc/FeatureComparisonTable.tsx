import { useState, type ReactNode } from 'react';

type FeatureEntry = {
  feature: string;
  recharts: ReactNode;
  victory: ReactNode;
  visx: ReactNode;
  d3: ReactNode;
  details: {
    recharts: ReactNode;
    victory: ReactNode;
    visx: ReactNode;
    d3: ReactNode;
  };
};

type DriverScore = {
  label: string;
  rating: number;
  weight: number;
  note: string;
};

const ScoreDetails = ({
  drivers,
  total,
}: {
  drivers: DriverScore[];
  total: string;
}) => (
  <div className='body-4 text-muted'>
    <p className='mb-6'>Method: ADR driver rating (1-5) x weight.</p>
    <ul className='list-disc pl-16 space-y-4'>
      {drivers.map((driver) => (
        <li key={driver.label}>
          {driver.label}: {driver.rating}/5 x {driver.weight} ={' '}
          {driver.rating * driver.weight}. {driver.note}
        </li>
      ))}
    </ul>
    <p className='mt-8 text-base'>Total: {total}</p>
  </div>
);

const FEATURE_MATRIX: FeatureEntry[] = [
  {
    feature: 'ADR weighted score (max 95)',
    recharts: '65 / 95',
    victory: '70 / 95',
    visx: '61 / 95',
    d3: '68 / 95',
    details: {
      recharts: (
        <ScoreDetails
          total='65 / 95'
          drivers={[
            {
              label: 'Ecosystem + Community',
              rating: 5,
              weight: 3,
              note: 'Largest adoption and active release cadence.',
            },
            {
              label: 'Effort Required',
              rating: 5,
              weight: 5,
              note: 'Fastest path to a production-ready web chart.',
            },
            {
              label: 'Performances',
              rating: 3,
              weight: 3,
              note: 'Acceptable runtime but heavier package footprint.',
            },
            {
              label: 'Feature Support / Extensibility',
              rating: 3,
              weight: 4,
              note: 'Strong built-ins, less flexible for custom layouts.',
            },
            {
              label: 'API consistency across technos',
              rating: 1,
              weight: 1,
              note: 'No native equivalent API.',
            },
            {
              label: 'Compatibility (RN)',
              rating: 1,
              weight: 3,
              note: 'Web-only.',
            },
          ]}
        />
      ),
      victory: (
        <ScoreDetails
          total='70 / 95'
          drivers={[
            {
              label: 'Ecosystem + Community',
              rating: 4,
              weight: 3,
              note: 'Good adoption and stable long-term maintenance.',
            },
            {
              label: 'Effort Required',
              rating: 3,
              weight: 5,
              note: 'Moderate complexity and integration work.',
            },
            {
              label: 'Performances',
              rating: 4,
              weight: 3,
              note: 'Strong runtime profile, especially on native side.',
            },
            {
              label: 'Feature Support / Extensibility',
              rating: 4,
              weight: 4,
              note: 'Rich primitives with good composition options.',
            },
            {
              label: 'API consistency across technos',
              rating: 3,
              weight: 1,
              note: 'Shared concepts, but web and RN are not fully reusable.',
            },
            {
              label: 'Compatibility (RN)',
              rating: 4,
              weight: 3,
              note: 'Native support exists but stack validation is needed.',
            },
          ]}
        />
      ),
      visx: (
        <ScoreDetails
          total='61 / 95'
          drivers={[
            {
              label: 'Ecosystem + Community',
              rating: 3,
              weight: 3,
              note: 'Smaller community, but reputable and stable.',
            },
            {
              label: 'Effort Required',
              rating: 3,
              weight: 5,
              note: 'Low-level work remains, but AI reduces boilerplate cost.',
            },
            {
              label: 'Performances',
              rating: 4,
              weight: 3,
              note: 'Modular imports and strong tree-shaking.',
            },
            {
              label: 'Feature Support / Extensibility',
              rating: 5,
              weight: 4,
              note: 'Maximum control for custom behavior and rendering.',
            },
            {
              label: 'API consistency across technos',
              rating: 2,
              weight: 1,
              note: 'Patterns transfer, API does not.',
            },
            {
              label: 'Compatibility (RN)',
              rating: 1,
              weight: 3,
              note: 'No out-of-the-box native implementation.',
            },
          ]}
        />
      ),
      d3: (
        <ScoreDetails
          total='68 / 95'
          drivers={[
            {
              label: 'Ecosystem + Community',
              rating: 5,
              weight: 3,
              note: 'Largest data-viz ecosystem with broad support.',
            },
            {
              label: 'Effort Required',
              rating: 2,
              weight: 5,
              note: 'Still high ownership cost, but AI shortens build time.',
            },
            {
              label: 'Performances',
              rating: 5,
              weight: 3,
              note: 'Efficient low-level control with lean modular packages.',
            },
            {
              label: 'Feature Support / Extensibility',
              rating: 5,
              weight: 4,
              note: 'No abstraction ceiling for advanced requirements.',
            },
            {
              label: 'API consistency across technos',
              rating: 2,
              weight: 1,
              note: 'Shared math model only, not shared component API.',
            },
            {
              label: 'Compatibility (RN)',
              rating: 2,
              weight: 3,
              note: 'Portable core logic, custom renderer still required.',
            },
          ]}
        />
      ),
    },
  },
  {
    feature: 'Level',
    recharts: 'High',
    victory: 'Mid',
    visx: 'Low',
    d3: 'Lowest',
    details: {
      recharts:
        'Provides pre-built, ready-to-use chart components (<LineChart>, <BarChart>, <PieChart>). Minimal configuration needed for common use cases. Trade-off: harder to break out of built-in patterns when you need something non-standard.',
      victory:
        'Middle ground between high-level convenience and low-level control. Offers composable components (VictoryLine, VictoryAxis, VictoryArea) that can be mixed freely inside a VictoryChart container, but still abstracts away scale/layout math.',
      visx: 'Thin React wrappers around D3 primitives. You manually wire scales, axes, shapes, and interactions. Maximum flexibility but requires understanding of D3 concepts (scales, domains, ranges). Best when you need pixel-level control over every SVG element.',
      d3: 'Raw D3 math (scales, generators, bisectors) with React for DOM rendering. No abstraction layer at all -- you own every SVG element and every interaction handler. Maximum control but also maximum boilerplate. Equivalent to visx without the convenience wrappers.',
    },
  },
  {
    feature: 'Bundle (gzip)',
    recharts: '~150kB',
    victory: '~120kB',
    visx: '~90kB (tree-shake)',
    d3: '~30kB (tree-shake)',
    details: {
      recharts:
        'Single package import. v3 improved tree-shaking but the core is still monolithic. Using <LineChart> pulls in most of the library. The UMD bundle is ~540kB uncompressed. For a Lumen sub-package (@ledgerhq/lumen-ui-react-visualization), this is the heaviest option.',
      victory:
        'Modular packages (victory-line, victory-axis, etc.) but the umbrella "victory" import pulls everything. Selective imports can reduce the bundle, though in practice most charts need victory-core + several sub-packages. Comparable to Recharts when fully loaded.',
      visx: 'Best tree-shaking story. Each package (@visx/shape, @visx/scale, @visx/axis...) is independently installable. A LineChart only imports what it uses. In this POC, only ~90kB gzipped is loaded. Ideal for the ADR side-note about splitting Lumen into lazy-loadable packages.',
      d3: 'Lightest option. Only d3-scale, d3-shape, and d3-array are needed (~30kB gzipped). Each d3 module is independently installable and fully tree-shakeable. No framework wrapper overhead. This is what visx is built on top of, minus the React wrapper layer.',
    },
  },
  {
    feature: 'POC LOC (approx.)',
    recharts: '~840',
    victory: '~890',
    visx: '~930',
    d3: '~900',
    details: {
      recharts:
        'Counts `LineChart-Recharts.tsx` (~653 LOC) plus attributed shared code: ~130 LOC from `utils.ts` (domains, inset, axis visibility, reference lines, value labels, `resolveCssColor`), ~18 LOC for `getRechartsLineType` in `chartCurves.ts`, and ~34 LOC as one-fourth of `types.ts` (~136 LOC) since all four charts share the same props contract. Recharts does not import `lineDataRuns` or `nearestDefinedPointByTime`.',
      victory:
        'Counts `LineChart-Victory.tsx` (~680 LOC) plus ~156 LOC from `utils.ts` (same base helpers as Recharts plus `lineDataRuns` for null-gap segments), ~18 LOC for `getVictoryInterpolation`, and ~34 LOC prorated `types.ts`.',
      visx: 'Counts `LineChart-Visx.tsx` (~687 LOC) plus ~186 LOC from `utils.ts` (same as Victory plus `nearestDefinedPointByTime` and the `d3-array` bisector wiring used for snapping), ~18 LOC for `getVisxCurve`, and ~34 LOC prorated `types.ts`.',
      d3: 'Counts `LineChart-D3.tsx` (~666 LOC) plus the same ~186 LOC `utils.ts` slice as visx, ~18 LOC for `getD3Curve`, and ~34 LOC prorated `types.ts`. Totals are rounded; shared files are not duplicated in the repo but are counted here so implementations can be compared fairly.',
    },
  },
  {
    feature: 'Weekly DLs',
    recharts: '2.4M',
    victory: '445K',
    visx: '300K',
    d3: '7M+',
    details: {
      recharts:
        'Dominant adoption (2.4M weekly downloads, 26.9K GitHub stars). Largest StackOverflow/GitHub Discussions community. Issues get quick responses. v3 is actively maintained with releases every few weeks (latest v3.8.1, March 2026).',
      victory:
        'Solid community (445K downloads, 11.1K stars). Maintained by NearForm (formerly Formidable Labs). Release cadence is slower than Recharts but stable. Good documentation at commerce.nearform.com/open-source/victory.',
      visx: 'Niche but reputable (300K downloads, 20.7K stars). Maintained by Airbnb. Less frequent releases (last major: v3.12.0, Nov 2024) but the API is stable and rarely needs breaking changes. Smaller community means fewer ready-made examples.',
      d3: 'The most widely used data visualization library in any ecosystem (7M+ weekly downloads across d3 modules, 110K+ GitHub stars). Massive community, countless tutorials, and StackOverflow answers. The de facto standard for web data visualization. Stable API since v7.',
    },
  },
  {
    feature: 'React Native',
    recharts: 'No',
    victory: 'Yes (Victory Native)',
    visx: 'No (patterns portable)',
    d3: 'No (math portable)',
    details: {
      recharts:
        'Web-only. No React Native counterpart exists. For the Wallet 4.0 mobile app, a separate charting solution would be needed, meaning two different codebases for charts. This is the biggest drawback given the ADR requirement for API consistency across technologies.',
      victory:
        'Only library with a real cross-platform story. Victory Native (legacy) uses react-native-svg for rendering. Victory Native XL (v40+) uses React Native Skia + Reanimated for 60fps GPU-accelerated charts. Both share the same declarative API as Victory web. XL requires @shopify/react-native-skia which needs validation against RN 0.79.',
      visx: 'Web-only, but because it is low-level D3+React, the patterns (scales, data transforms, layout math) can be ported to any renderer. A React Native counterpart could be built using react-native-svg with the same scale/layout logic. However, this would require custom development effort.',
      d3: 'D3 math (scales, shapes, arrays) works in any JS environment including React Native. The rendering layer (SVG path strings from d3-shape) can be fed into react-native-svg or Skia. However, you must build the entire rendering layer yourself. Same portability story as visx but without any React wrappers.',
    },
  },
  {
    feature: 'TypeScript',
    recharts: 'Full (v3 generics)',
    victory: 'Full',
    visx: 'Full',
    d3: 'Full (@types/d3-*)',
    details: {
      recharts:
        'v3 introduced full TypeScript generics for data and dataKey props. The Tooltip, Axis, and all chart components are strongly typed. Custom content renderers have well-defined prop types. This is a significant improvement over v2 which had loose typing.',
      victory:
        'Full TypeScript support with typed props for all components. Style objects are typed. Event handlers receive typed datum objects. The typing is solid but some advanced patterns (custom data accessors, event compositions) require manual type annotations.',
      visx: 'Excellent TypeScript support. Each package exports its own types. D3 scale types flow through correctly. The granular package structure means you get precise types for exactly the primitives you use. Type inference works well with the functional composition pattern.',
      d3: 'Full TypeScript support via DefinitelyTyped (@types/d3-scale, @types/d3-shape, etc.). Types are well-maintained and accurate. Scale generics, datum types on generators, and accessor typing all work correctly. You get the same level of type safety as visx since visx is built on these same types.',
    },
  },
  {
    feature: 'Chart types built-in',
    recharts: 'Line, Bar, Area, Pie, Radar...',
    victory: 'Line, Bar, Area, Pie, Polar...',
    visx: 'Compose from primitives',
    d3: 'Generators only',
    details: {
      recharts:
        'Ships with LineChart, BarChart, AreaChart, PieChart, RadarChart, ScatterChart, FunnelChart, RadialBarChart, Treemap, and ComposedChart (mix line+bar+area). Each is a self-contained component. Adding a new chart type the library does not support requires workarounds or ejecting to lower-level APIs.',
      victory:
        'Ships with VictoryLine, VictoryBar, VictoryArea, VictoryPie, VictoryPolarAxis, VictoryScatter, VictoryCandlestick, VictoryHistogram, and more. Components compose inside VictoryChart or VictoryGroup. Easier than Recharts to create hybrid/custom chart layouts.',
      visx: 'No pre-built chart components. Instead provides primitives: LinePath, AreaClosed, Bar, Arc, Pie from @visx/shape; scaleLinear, scaleTime from @visx/scale; AxisBottom, AxisLeft from @visx/axis. You compose these into any chart type. The ADR mentions future Donut/Pie and Bar charts -- visx can build any of these but each requires manual assembly.',
      d3: 'D3 provides path generators (d3-shape: line, area, arc, pie, stack) and scale functions (d3-scale) but no React components at all. You call line()(data) to get an SVG path string and render it yourself via <path d={...}>. Complete freedom to build any chart type, but every element is hand-crafted.',
    },
  },
  {
    feature: 'Gradient fill',
    recharts: 'SVG defs',
    victory: 'SVG defs',
    visx: 'LinearGradient component',
    d3: 'Raw SVG defs',
    details: {
      recharts:
        'Requires manually adding <defs><linearGradient> inside the chart JSX, then referencing it via fill="url(#id)" on <Area> components. Works but is verbose. Gradient IDs must be unique when multiple charts are on the same page.',
      victory:
        'Same SVG defs approach. You place a hidden <svg> with <defs> outside the chart and reference gradients by ID in VictoryArea style props. Slightly more boilerplate than Recharts because the defs live outside the chart component tree.',
      visx: 'Provides a dedicated <LinearGradient> component from @visx/gradient that handles SVG defs registration automatically. Cleaner API: just place <LinearGradient id="..." from={color} to={color} /> inside the SVG and reference it. Also supports RadialGradient and pattern fills.',
      d3: 'Pure SVG <defs><linearGradient> elements rendered in JSX. No helper components -- you write the gradient markup directly. Same approach as Recharts/Victory but without any abstraction. Most explicit and most verbose.',
    },
  },
  {
    feature: 'Tooltip',
    recharts: 'Built-in + custom',
    victory: 'VictoryTooltip + Voronoi',
    visx: 'useTooltip + manual',
    d3: 'Fully manual (React state)',
    details: {
      recharts:
        'Drop-in <Tooltip /> component that automatically finds the nearest data point. Supports custom content via the content prop (render function or React element). Formatter props for quick label changes. Tooltip positioning, animation, and cursor tracking are handled automatically.',
      victory:
        'VictoryTooltip renders styled flyout tooltips. Combined with VictoryVoronoiContainer, it uses Voronoi tessellation to determine the nearest data point -- efficient for dense datasets. The labelComponent prop accepts any React element. Flyout styling is done via style objects.',
      visx: 'Provides useTooltip() hook and <TooltipWithBounds> component for positioning. You manually handle mouse events, compute the nearest data point (using d3-array bisector), and show/hide the tooltip. Most work but also most control over tooltip appearance, positioning, and behavior.',
      d3: 'No tooltip primitives at all. Mouse events on an SVG overlay rect are handled via React callbacks, the nearest point is found with d3-array bisector, and tooltip state is stored in useState. The tooltip is rendered as an absolutely-positioned HTML div. Identical pattern to visx but without the useTooltip hook.',
    },
  },
  {
    feature: 'Cursor line',
    recharts: 'Tooltip cursor prop',
    victory: 'VoronoiContainer + onActivated',
    visx: 'Manual SVG line',
    d3: 'Manual SVG line',
    details: {
      recharts:
        'The <Tooltip cursor={...} /> prop renders a vertical or horizontal line following the mouse. Accepts style props (stroke, strokeWidth, strokeDasharray). Requires no additional code -- works out of the box when Tooltip is enabled.',
      victory:
        'VictoryVoronoiContainer provides onActivated/onDeactivated callbacks that report active data points. In this POC, we track the cursor X position via onActivated and render a separate VictoryLine as the cursor. An alternative is VictoryCursorContainer (dedicated cursor) but it cannot be combined with Voronoi tooltips without createContainer().',
      visx: 'Fully manual. In the mouse event handler, we compute the cursor X position from the scale, then render an SVG <line> element at that position. This gives complete control over cursor appearance and behavior (snap-to-point, vertical/horizontal, crosshair, etc.) but requires the most code.',
      d3: 'Same approach as visx -- manual SVG <line> element positioned based on tooltip state. The cursor X is derived from the hovered data point timestamp run through the xScale. Identical code, identical control.',
    },
  },
  {
    feature: 'Theming',
    recharts: 'CSS vars in props',
    victory: 'Style objects + CSS vars',
    visx: 'CSS vars in SVG attrs',
    d3: 'CSS vars in SVG attrs',
    details: {
      recharts:
        'Stroke, fill, and style props accept CSS variable references directly (e.g. stroke="var(--color-crypto-bitcoin)"). CartesianGrid, Axis, and Tooltip all support inline style objects. However, Recharts does not have a built-in theme system -- you must pass token values to each component individually.',
      victory:
        'Uses JS style objects throughout. CSS variables work inside these objects (e.g. { stroke: "var(--border-muted)" }). Victory also has a VictoryTheme system where you define a theme object with default styles for all chart elements. This aligns well with Lumen\'s token-based approach -- a Lumen theme could be created once and applied globally.',
      visx: "SVG attributes accept CSS variables directly. Since visx renders plain SVG elements, you can also use className for Tailwind/CSS-based styling. This is the most flexible theming approach and integrates naturally with Lumen's Tailwind-based design tokens. No abstraction layer between you and the SVG.",
      d3: "Same as visx -- pure SVG elements accept CSS variables in stroke/fill attributes. You can also apply className for Tailwind styling. Since there is no library-level abstraction, theming is entirely in your hands. Works seamlessly with Lumen's token system.",
    },
  },
  {
    feature: 'Effort to implement',
    recharts: 'Low',
    victory: 'Medium',
    visx: 'High',
    d3: 'Highest',
    details: {
      recharts:
        'Fastest path to a working chart. In this POC, the main file is ~653 LOC including the custom tooltip. Data format requires merging multiple lines into a flat array (one quirk), but otherwise it is mostly declarative JSX configuration. Ideal for the ADR\'s "Effort Required" driver (weight: 5).',
      victory:
        'Moderate effort. In this POC, ~680 LOC in the main file. Composing VictoryChart + VictoryLine + VictoryAxis is straightforward. The main friction point was the cursor implementation -- VictoryVoronoiContainer does not natively expose a cursor line, requiring a workaround with onActivated + a separate VictoryLine.',
      visx: 'Most effort. In this POC, ~687 LOC in the main file. You must manually create scales, wire mouse events, compute nearest points with bisectors, manage tooltip state, and render SVG elements. However, this effort yields the most maintainable long-term architecture because every piece is explicit and replaceable.',
      d3: 'Highest effort. Similar main-file size to visx (~666 LOC) but without convenience components like <LinePath>, <AreaClosed>, <LinearGradient>, or useTooltip. Every SVG element, gradient definition, and interaction handler is written from scratch. The upside: zero dependency on any React charting library -- only D3 math utilities.',
    },
  },
  {
    feature: 'Customizability',
    recharts: 'Medium',
    victory: 'Medium-High',
    visx: 'Maximum',
    d3: 'Maximum',
    details: {
      recharts:
        'Good for standard patterns. Custom tooltips, custom axis ticks, reference lines/areas are well-supported. However, non-standard layouts (e.g. charts with custom clip paths, unusual coordinate systems, mixed Canvas+SVG) are difficult or impossible. You are constrained by the component tree structure.',
      victory:
        "More flexible than Recharts. Custom data components (replace the default line renderer), functional style props (style based on datum values), and the ability to compose arbitrary chart elements. The VictoryTheme system also allows deep style customization. The main limitation is that you are still within Victory's rendering pipeline.",
      visx: "Full control. Since visx is just React components rendering SVG, you can mix visx primitives with raw SVG, add Canvas layers, implement custom interactions (brush, zoom, pan), or even replace individual pieces with your own implementations. This is particularly valuable for the ADR's future requirements (reference lines, 500+ interactive markers, draggable elements).",
      d3: 'Same maximum customizability as visx -- you own the entire SVG output. The difference is that with D3 you also own the math layer, meaning you can swap out scale implementations, create custom curve interpolators, or mix Canvas and SVG renderers freely. No library opinions to work around.',
    },
  },
];

const FeatureRow = ({ row, index }: { row: FeatureEntry; index: number }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <tr
        onClick={() => setOpen((v) => !v)}
        className={`border-t border-muted cursor-pointer select-none ${
          index % 2 === 0 ? 'bg-surface' : 'bg-base'
        }`}
      >
        <td className='px-16 py-10 body-3 text-muted font-semibold'>
          <span
            className={`inline-block mr-8 body-4 text-muted transition-transform duration-200 ${
              open ? 'rotate-90' : 'rotate-0'
            }`}
          >
            &#9654;
          </span>
          {row.feature}
        </td>
        <td className='px-16 py-10 body-3 text-muted'>{row.recharts}</td>
        <td className='px-16 py-10 body-3 text-muted'>{row.victory}</td>
        <td className='px-16 py-10 body-3 text-muted'>{row.visx}</td>
        <td className='px-16 py-10 body-3 text-muted'>{row.d3}</td>
      </tr>
      {open && (
        <tr
          className={`border-t border-dashed border-muted ${
            index % 2 === 0 ? 'bg-surface' : 'bg-base'
          }`}
        >
          <td className='px-16 pt-8 pb-12 body-4 leading-relaxed text-base font-semibold align-top'>
            Details
          </td>
          <td className='px-16 pt-8 pb-12 body-4 leading-relaxed text-muted align-top'>
            {row.details.recharts}
          </td>
          <td className='px-16 pt-8 pb-12 body-4 leading-relaxed text-muted align-top'>
            {row.details.victory}
          </td>
          <td className='px-16 pt-8 pb-12 body-4 leading-relaxed text-muted align-top'>
            {row.details.visx}
          </td>
          <td className='px-16 pt-8 pb-12 body-4 leading-relaxed text-muted align-top'>
            {row.details.d3}
          </td>
        </tr>
      )}
    </>
  );
};

export const FeatureComparisonTable = () => (
  <>
    <h2 className='heading-3 mb-16'>Feature Comparison</h2>
    <p className='text-muted mb-16 body-3'>
      Click any row to expand detailed notes for each library, including ADR
      weighted scoring. Updated assumptions: Victory web/RN is only partially
      reusable, and AI assistance reduces effort for low-level abstractions.
    </p>
    <div className='rounded-lg overflow-hidden border border-muted max-w-[960px]'>
      <table className='w-full border-collapse'>
        <thead>
          <tr className='bg-muted'>
            <th className='px-16 py-12 text-left body-3 font-bold text-base'>
              Feature
            </th>
            <th className='px-16 py-12 text-left body-3 font-bold text-base'>
              Recharts v3
            </th>
            <th className='px-16 py-12 text-left body-3 font-bold text-base'>
              Victory v37
            </th>
            <th className='px-16 py-12 text-left body-3 font-bold text-base'>
              visx v3
            </th>
            <th className='px-16 py-12 text-left body-3 font-bold text-base'>
              D3.js v7
            </th>
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
