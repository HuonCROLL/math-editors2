import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from 'prosemirror-state';

/**
 * Intercept Overleaf‑style LaTeX pastes and turn \begin{tabular}
 * into a real HTML <table>, which @tiptap/extension-table
 * then parses into editable rows/cells.
 *
 * Supports simple cases: rows separated by '\\', cells by '&'.
 * Ignores \hline / \cline for brevity.
 */
export const OverleafPaste = Extension.create({
  name: 'overleafPaste',
  addProseMirrorPlugins() {
    const editor = this.editor;

    return [
      new Plugin({
        key: new PluginKey('overleafPaste'),
        props: {
          handlePaste(_view, event) {
            const text = event.clipboardData?.getData('text/plain') ?? '';
            if (!/\\begin{tabular}/.test(text)) return false;   // let others handle

            event.preventDefault();
            const html = tabularToHTML(text);
            if (html) {
              editor.chain().focus().insertContent(html).run();
            } else {
              // fallback: plain paste
              editor.commands.insertContent(text);
            }
            return true;
          },
        },
      }),
    ];
  },
});

/* ───────── helpers ───────── */

function tabularToHTML(tex: string): string | null {
  const m = tex.match(/\\begin{tabular}{[^}]*}([\s\S]+?)\\end{tabular}/);
  if (!m) return null;

  const body = m[1]
    .replace(/\\hline/g, '')
    .replace(/\\multicolumn{[^}]+}{[^}]+}{([^}]*)}/g, '$1') // remove multicolumn
    .trim();

  const rows = body.split(/\\\\/).map(r => r.trim()).filter(Boolean);

  let table = '<table class="tiptap-table"><tbody>';
  rows.forEach(row => {
    table += '<tr>';
    row.split('&').forEach(cell => {
      const safeCell = cell.trim() || '&nbsp;';
      table += `<td>${safeCell}</td>`;
    });
    table += '</tr>';
  });
  table += '</tbody></table>';
  return table;
}