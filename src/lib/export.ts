import type { WorkLog } from '@/types'

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

/**
 * Export logs to PDF via the browser's print dialog. We render a clean,
 * standalone HTML document in a hidden iframe and trigger print on it — this
 * avoids fighting the app's layout/dark-mode and lets the user "Save as PDF"
 * from the native print dialog. No extra dependencies.
 */
export function exportLogsToPdf(logs: WorkLog[]): void {
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const rows = logs
    .map((l) => {
      const date = new Date(l.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
      const report = l.report
        ? `<div class="report">
             <p><strong>Summary:</strong> ${esc(l.report.summary)}</p>
             ${section('Accomplishments', l.report.accomplishments)}
             ${section('Challenges', l.report.challenges)}
             ${section('Next Steps', l.report.nextSteps)}
           </div>`
        : l.input
          ? `<p class="note">${esc(l.input)}</p>`
          : ''
      return `<div class="log">
        <div class="log-head">
          <span class="title">${esc(l.title)}</span>
          <span class="meta">${esc(l.tag)} · ${date} · ${esc(l.time)}</span>
        </div>
        ${report}
      </div>`
    })
    .join('')

  const html = `<!doctype html>
<html><head><meta charset="utf-8"><title>Logify AI — Work Logs</title>
<style>
  * { box-sizing: border-box; }
  body { font-family: -apple-system, Segoe UI, Roboto, sans-serif; color: #1a1a1a; margin: 40px; }
  h1 { font-size: 22px; margin: 0 0 4px; }
  .sub { color: #888; font-size: 13px; margin: 0 0 24px; }
  .log { border: 1px solid #e5e5e5; border-radius: 10px; padding: 14px 16px; margin-bottom: 12px; page-break-inside: avoid; }
  .log-head { display: flex; justify-content: space-between; gap: 12px; margin-bottom: 6px; }
  .title { font-weight: 600; font-size: 14px; }
  .meta { color: #999; font-size: 12px; white-space: nowrap; }
  .note { color: #555; font-size: 13px; margin: 4px 0 0; }
  .report { font-size: 13px; color: #333; }
  .report p { margin: 4px 0; }
  .report ul { margin: 2px 0 8px; padding-left: 18px; }
  .report li { margin: 2px 0; }
  .report h4 { margin: 8px 0 2px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.04em; color: #888; }
  @media print { body { margin: 0; } }
</style></head>
<body>
  <h1>Work Logs</h1>
  <p class="sub">Exported from Logify AI · ${today} · ${logs.length} ${logs.length === 1 ? 'log' : 'logs'}</p>
  ${rows || '<p class="sub">No logs to export.</p>'}
</body></html>`

  const iframe = document.createElement('iframe')
  iframe.style.position = 'fixed'
  iframe.style.right = '0'
  iframe.style.bottom = '0'
  iframe.style.width = '0'
  iframe.style.height = '0'
  iframe.style.border = '0'
  document.body.appendChild(iframe)

  const doc = iframe.contentWindow?.document
  if (!doc) {
    document.body.removeChild(iframe)
    return
  }
  doc.open()
  doc.write(html)
  doc.close()

  // Give the iframe a tick to render before printing.
  const win = iframe.contentWindow!
  win.focus()
  setTimeout(() => {
    win.print()
    // Clean up after the print dialog closes.
    setTimeout(() => document.body.removeChild(iframe), 500)
  }, 250)
}

function section(title: string, items: string[]): string {
  if (!items || items.length === 0) return ''
  return `<h4>${title}</h4><ul>${items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>`
}
