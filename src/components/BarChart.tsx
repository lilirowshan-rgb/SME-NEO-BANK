import { useState, type ReactNode } from 'react';

export interface ChartBar {
  value: number;
  color: string;
}

export interface ChartGroup {
  key: string;
  /** Axis label; pass '' to hide it for this group (dense charts). */
  label: string;
  bars: ChartBar[];
  /** Small label drawn above the bars. */
  top?: ReactNode;
  /** Second axis line under the label (e.g. net value). */
  axisSub?: ReactNode;
  tooltip: ReactNode;
}

interface BarChartProps {
  groups: ChartGroup[];
  height: number;
  ariaLabel: string;
  /** Accessible data table rendered off-screen for screen readers. */
  table: { head: string[]; rows: string[][] };
  max?: number;
  gap?: number;
  /** Extra class, e.g. "chart-dense" to thin out axis labels on phones. */
  className?: string;
}

/** Vertical (grouped) bar chart with per-group hover/focus tooltips. RTL: first group renders on the right. */
export default function BarChart({ groups, height, ariaLabel, table, max, gap = 6, className }: BarChartProps) {
  const [active, setActive] = useState<string | null>(null);
  const top = max ?? Math.max(...groups.flatMap((g) => g.bars.map((b) => b.value)));

  return (
    <figure className={`chart${className ? ` ${className}` : ''}`} style={{ margin: 0 }}>
      <div className="chart-plot" style={{ height, gap }} aria-hidden="true" onMouseLeave={() => setActive(null)}>
        {groups.map((g) => (
          <div
            key={g.key}
            className="chart-group"
            onMouseEnter={() => setActive(g.key)}
          >
            {g.top !== undefined && <div className="chart-top">{g.top}</div>}
            <div className="chart-bars">
              {g.bars.map((b, i) => (
                <div
                  key={i}
                  className="chart-bar"
                  style={{ height: `${Math.max(0, (b.value / top) * 100)}%`, background: b.color }}
                />
              ))}
            </div>
            {active === g.key && <div className="chart-tooltip">{g.tooltip}</div>}
          </div>
        ))}
      </div>
      <div className="chart-axis" style={{ gap }} aria-hidden="true">
        {groups.map((g) => (
          <div key={g.key}>
            {g.label}
            {g.axisSub !== undefined && <span className="chart-axis-sub">{g.axisSub}</span>}
          </div>
        ))}
      </div>
      <table className="sr-only">
        <caption>{ariaLabel}</caption>
        <thead>
          <tr>
            {table.head.map((h) => (
              <th key={h} scope="col">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((r) => (
            <tr key={r[0]}>
              {r.map((c, i) => (
                <td key={i}>{c}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
