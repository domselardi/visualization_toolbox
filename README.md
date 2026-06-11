# Visualization Toolbox

Visualization Toolbox is an add-on for Splunk Enterprise and Splunk Cloud powered by [Apache ECharts](https://echarts.apache.org/).

## Releases

- GitHub: https://github.com/hman-78/visualization_toolbox/releases
- Splunkbase: https://splunkbase.splunk.com/app/6675

---

## Features

The viz component `visualization_toolbox.hman` supports four data modes via the `dataType` option:

| `dataType` | Description |
|---|---|
| `Custom` | Full ECharts `option` object — any chart type ECharts supports |
| `SimpleBoxplot` | One SPL row per box; 6–7 columns (name, lower, Q1, median, Q3, upper, outliers) |
| `Boxplot` | Multi-series grouped boxplots via a transposed 8-row table |
| `Timeline` | Gantt-style timeline with automatic axis/legend construction |

---

### Custom mode

Write any ECharts `option` object directly. Supports all ECharts chart types (line, bar, scatter, pie, gauge, heatmap, radar, treemap, sunburst, funnel, candlestick, …) and JavaScript functions in the option string (tooltip formatters, `symbolSize` callbacks, etc.).

**Data binding** (optional — maps SPL result columns into series data):

| Option | Example | Description |
|---|---|---|
| `xAxisDataIndexBinding` | `0` | Column index to use as xAxis categories |
| `seriesDataIndexBinding` | `1,2,3` | Comma-separated indices, one per series |
| `seriesDataIndexBinding` | `[1;2]` | Bracket syntax → `[col1, col2]` per point (scatter X/Y) |
| `seriesDataIndexBinding` | `[1;2;3]` | Three-element bracket → `[col1, col2, col3]` per point (bubble) |

When `seriesDataIndexBinding` is omitted, any `data` arrays in the option string are used as-is (static charts).

See [Tutorial 1](default/data/ui/views/tutorial_1.xml) – [Tutorial 8](default/data/ui/views/tutorial_8.xml).

---

### SimpleBoxplot mode

One search result row = one boxplot. Required columns in order:

| # | Column | Description |
|---|---|---|
| 0 | name | X-axis label |
| 1 | lower | Min / lower whisker |
| 2 | Q1 | 25th percentile |
| 3 | median | Median |
| 4 | Q3 | 75th percentile |
| 5 | upper | Max / upper whisker |
| 6 | outliers | *(Optional)* Pipe-separated values, e.g. `95.2\|102.7`. Use `null()` for rows with no outliers. |

The option string must define `xAxis: {}`. Pre-populate `series` with a boxplot entry to attach `markLine` overlays (reference lines, SLA targets). See [Tutorial 9](default/data/ui/views/tutorial_9.xml).

---

### Boxplot mode

Multi-series grouped boxplots. The search must return a **transposed** 8-row table where each column is one boxplot:

| Row | Content |
|---|---|
| 0 | Minimum |
| 1 | Q1 |
| 2 | Median |
| 3 | Q3 |
| 4 | Maximum |
| 5 | Category / series label |
| 6 | X-axis group label |
| 7 | Number of distinct categories (same value repeated in every cell) |

Use `| eval seq=N` on each sub-search and `| sort seq` before `| table` to guarantee row order — same-time `makeresults` events have non-deterministic ordering. See [Tutorial 10](default/data/ui/views/tutorial_10.xml).

---

### Timeline mode

Gantt-style chart. Required columns (in order):

| # | Column | Description |
|---|---|---|
| 0 | start_time | Unix timestamp in **seconds** |
| 1 | end_time | Unix timestamp in **seconds** |
| 2 | internal_name | Y-axis row label (machine, process, operator, …) |
| 3 | category | Legend / colour group |
| 4 | fill_color | *(Optional)* Hex/rgb colour — omit when using `timeline_useSplunkCategoricalColors=true` |

Splunk's `now()`, `relative_time()`, and `strptime()` all return seconds; the viz multiplies internally by 1000 for ECharts.

**Key options:**

| Option | Default | Description |
|---|---|---|
| `timeline_useSplunkCategoricalColors` | `false` | Auto-assign Splunk palette colours per category; omit the `fill_color` column |
| `timeline_bandHeight` | `32` | Height in px of each event bar |
| `timeline_bandGap` | `8` | Vertical gap in px between rows |
| `timeline_splitByHour` | `false` | Rotate to hourly rows; requires a `<form>` with a time picker whose **token is exactly `time_range`** (max 24 h) |

Canvas height is auto-computed as `(bandHeight + bandGap) × numberOfRows + gridTop + gridBottom`. Set the panel `height` option generously.

Only `tooltip`, `grid`, and `dataZoom` are customisable via the option string; `xAxis`, `yAxis`, `series`, and `legend` are built automatically.

**Drilldown tokens** set on click:

| Token | Value |
|---|---|
| `hman_ts_series` | `internal_name` of the clicked rectangle |
| `hman_ts_legend` | `category` of the clicked rectangle |
| `hman_ts_start_time` | Event start (Unix seconds) |
| `hman_ts_end_time` | Event end (Unix seconds) |
| `hman_ts_duration` | Duration in seconds |
| `hman_ts_color` | Fill colour of the clicked rectangle |

See [Tutorial 11](default/data/ui/views/tutorial_11.xml).

---

## Tutorials

Full interactive tutorials with live charts are in the **Docs / Tutorial** tab inside the app.

| Tutorial | Chart types covered |
|---|---|
| [1 — Getting started](default/data/ui/views/tutorial_1.xml) | Line, Bar — ECharts basics, static data |
| [2 — Data binding](default/data/ui/views/tutorial_2.xml) | Line, Bar, Scatter — `seriesDataIndexBinding` and `xAxisDataIndexBinding` |
| [3 — Advanced Custom](default/data/ui/views/tutorial_3.xml) | Multi-Y axis, dataZoom slider |
| [4 — Pie / Donut / Rose](default/data/ui/views/tutorial_4.xml) | Pie, Donut, Nightingale Rose |
| [5 — Scatter / Bubble / Heatmap](default/data/ui/views/tutorial_5.xml) | Scatter (2D binding), Bubble (3D binding), Heatmap with visualMap |
| [6 — Gauge / Radar](default/data/ui/views/tutorial_6.xml) | Gauge (single/multi-needle, thresholds), Radar |
| [7 — Treemap / Sunburst / Funnel](default/data/ui/views/tutorial_7.xml) | Treemap, Sunburst, Funnel |
| [8 — Candlestick / Boxplot](default/data/ui/views/tutorial_8.xml) | OHLC Candlestick, Candlestick + MA overlay, Boxplot (Custom) |
| [9 — SimpleBoxplot](default/data/ui/views/tutorial_9.xml) | `dataType=SimpleBoxplot` — cycle time QC, outliers, SLA markLine |
| [10 — Boxplot multi-series](default/data/ui/views/tutorial_10.xml) | `dataType=Boxplot` — machine × shift grouped boxplots |
| [11 — Timeline](default/data/ui/views/tutorial_11.xml) | `dataType=Timeline` — Gantt, custom colours, drilldown tokens, splitByHour |

---

## Build

```sh
cd appserver/static/visualizations/hman
npm ci
npm run build
rm -rf node_modules
```

### Release workflow

Bump the version in `app.manifest` and `default/app.conf`, then trigger the `ReleaseApp` workflow at https://github.com/hman-78/visualization_toolbox/actions.

---

## Requirements

Splunk Enterprise or Cloud 8.2.9 or later.

## Support

Developer-supported. File issues at https://github.com/hman-78/visualization_toolbox/issues
