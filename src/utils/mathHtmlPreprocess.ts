/** Escape for HTML attribute value (data-latex="...") */
function escapeHtmlAttr(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function unescapeHtmlIfNeeded(html: string): string {
  if (!html) return html;
  const hasEntities = /&(?:lt|gt|quot|amp);/.test(html);
  if (!hasEntities) return html;
  return html
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&');
}

function ensureInlineDisplayStyle(latex: string): string {
  const trimmed = latex.trim();
  if (!trimmed) return trimmed;
  if (/^\\displaystyle(?:\s|$)/.test(trimmed)) return trimmed;
  return `\\displaystyle ${trimmed}`;
}

const toInlineMathSpan = (latex: string) =>
  `<span data-type="inline-math" data-latex="${escapeHtmlAttr(ensureInlineDisplayStyle(latex))}"></span>`;
const toBlockMathDiv = (latex: string) =>
  `<div data-type="block-math" data-latex="${escapeHtmlAttr(latex.trim())}"></div>`;

function findNextHtmlTagStart(html: string, from: number): number {
  let idx = html.indexOf('<', from);
  while (idx !== -1) {
    const candidate = html.slice(idx);
    if (
      /^<\/?[A-Za-z][^>]*>/.test(candidate) ||
      /^<!--[\s\S]*?-->/.test(candidate) ||
      /^<![A-Za-z][^>]*>/.test(candidate)
    ) {
      return idx;
    }
    idx = html.indexOf('<', idx + 1);
  }
  return -1;
}

/** Convert bracket math delimiters in text outside HTML tags to math nodes. */
function replaceBracketMathOutsideTags(html: string): string {
  if (!html.includes('\\(') && !html.includes('\\[')) return html;

  let out = '';
  let i = 0;
  while (i < html.length) {
    const lt = findNextHtmlTagStart(html, i);
    const textEnd = lt === -1 ? html.length : lt;
    const chunk = html.slice(i, textEnd);

    out += chunk
      .replace(/\\\[([\s\S]+?)\\\]/g, (_, latex) => {
        const trimmed = (latex as string).trim();
        return trimmed ? toBlockMathDiv(trimmed) : `\\[${latex}\\]`;
      })
      .replace(/\\\((.+?)\\\)/g, (full, latex) => {
        const trimmed = (latex as string).trim();
        return trimmed ? toInlineMathSpan(trimmed) : full;
      });

    if (lt === -1) break;
    const gt = html.indexOf('>', lt);
    if (gt === -1) {
      out += html.slice(lt);
      break;
    }
    out += html.slice(lt, gt + 1);
    i = gt + 1;
  }
  return out;
}

/**
 * Replace \(...\) and \[...\] in HTML with math nodes so preview components
 * can render them consistently with TipTap-stored math.
 */
export function preprocessMathInHtml(html: string): string {
  if (!html) return html;
  const unescaped = unescapeHtmlIfNeeded(html);
  const withInlineMathDisplayStyle = unescaped.replace(
    /(<span\b[^>]*data-type="inline-math"[^>]*\bdata-latex=")([^"]*)(")/gi,
    (_m, start: string, encodedLatex: string, end: string) => {
      const decodedLatex = encodedLatex
        .replace(/&quot;/g, '"')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&');
      return `${start}${escapeHtmlAttr(ensureInlineDisplayStyle(decodedLatex))}${end}`;
    },
  );
  return replaceBracketMathOutsideTags(withInlineMathDisplayStyle);
}
