/**
 * Build a smooth (cubic-bezier) SVG path for a series of values, scaled to fit
 * a `w` × `h` box. Higher values sit higher on the chart (smaller y). Shared by
 * the dashboard ProgressChart and the Insights area chart.
 */
export function buildSmoothPath(values: number[], w: number, h: number): string {
  if (values.length === 0) return ''
  const max = Math.max(...values, 1)
  const xs = values.map((_, i) => (i / Math.max(values.length - 1, 1)) * w)
  const ys = values.map((v) => h - (v / max) * h)

  let d = `M ${xs[0]} ${ys[0]}`
  for (let i = 1; i < values.length; i++) {
    const cpx = (xs[i - 1] + xs[i]) / 2
    d += ` C ${cpx} ${ys[i - 1]}, ${cpx} ${ys[i]}, ${xs[i]} ${ys[i]}`
  }
  return d
}

/** Close a line path into a filled area down to the baseline. */
export function toAreaPath(linePath: string, w: number, h: number): string {
  return `${linePath} L ${w} ${h} L 0 ${h} Z`
}
