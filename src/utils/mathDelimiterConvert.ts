import type { Node as ProseMirrorNode, NodeType } from '@tiptap/pm/model';
import { TextSelection, type EditorState, type Transaction } from '@tiptap/pm/state';

export type DelimiterMatch = {
  /** Offset within the textblock's content (not document position). */
  contentFrom: number;
  contentTo: number;
  latex: string;
};

/**
 * Find non-overlapping `\( ... \)` / `\[ ... \]` matches in a textblock's
 * plain text. Indices align with ProseMirror content offsets when leaf atoms
 * are represented as a single character (same convention as TipTap InputRules).
 */
export function findDelimiterMatches(
  text: string,
  pattern: RegExp,
): DelimiterMatch[] {
  const matches: DelimiterMatch[] = [];
  // Always work from a fresh regex so lastIndex doesn't leak across calls.
  const re = new RegExp(pattern.source, pattern.flags.includes('g') ? pattern.flags : `${pattern.flags}g`);
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    const latex = (m[1] || '').trim();
    if (!latex) continue;
    matches.push({
      contentFrom: m.index,
      contentTo: m.index + m[0].length,
      latex,
    });
  }
  return matches;
}

function textblockPlainText(node: ProseMirrorNode): string {
  return node.textBetween(0, node.content.size, null, '\ufffc');
}

/**
 * Convert complete delimiter pairs inside textblocks into math nodes.
 *
 * TipTap InputRules only see text *before* the cursor, so typing the opening
 * `\(` / `\[` after the body+closer already exists never triggers them.
 * Running this in `appendTransaction` catches that case (and the leading-`\`
 * case) while still cooperating with the existing end-anchored InputRules.
 */
export function convertMathDelimiters(
  state: EditorState,
  options: {
    pattern: RegExp;
    nodeType: NodeType;
  },
): Transaction | null {
  const { pattern, nodeType } = options;
  type Conversion = {
    from: number;
    to: number;
    latex: string;
  };

  const conversions: Conversion[] = [];

  state.doc.descendants((node, pos) => {
    if (!node.isTextblock || node.type.spec.code) return;
    const text = textblockPlainText(node);
    if (!text.includes('\\(') && !text.includes('\\[')) return;

    const matches = findDelimiterMatches(text, pattern);
    for (const match of matches) {
      conversions.push({
        from: pos + 1 + match.contentFrom,
        to: pos + 1 + match.contentTo,
        latex: match.latex,
      });
    }
  });

  if (!conversions.length) return null;

  // Replace from the end so earlier positions stay valid.
  conversions.sort((a, b) => b.from - a.from);

  const tr = state.tr;
  const cursor = state.selection.head;

  for (const { from, to, latex } of conversions) {
    const mathNode = nodeType.create({ latex });
    tr.replaceWith(from, to, mathNode);
  }

  // Keep the cursor after the math node that contained it, when possible.
  const mappedCursor = tr.mapping.map(cursor);
  try {
    tr.setSelection(TextSelection.create(tr.doc, mappedCursor));
  } catch {
    // Document structure after block-math insertion can invalidate the
    // mapped position; ProseMirror will place a reasonable default selection.
  }

  return tr;
}
