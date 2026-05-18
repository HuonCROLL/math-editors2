import { InputRule } from '@tiptap/core';
import { TextSelection } from 'prosemirror-state';
import { InlineMath } from '@tiptap/extension-mathematics';

/**
 * Inline math with only \( ... \) input rules.
 * This intentionally avoids the upstream dollar-delimiter rules.
 */
export const InlineMathWithParens = InlineMath.extend({
  addPasteRules() {
    return [];
  },

  addInputRules() {
    return [
      new InputRule({
        find: /\\\((.+?)\\\)$/,
        handler: ({ state, range, match }) => {
          const latex = (match[1] || '').trim();
          if (!latex) return null;
          const node = this.type.create({ latex });
          const { tr } = state;
          tr.replaceWith(range.from, range.to, node);
          // Place cursor immediately after the node (not TextSelection.near, which can
          // land before the atom and make the next Backspace "unrender" the math).
          const afterPos = range.from + node.nodeSize;
          tr.setSelection(TextSelection.create(tr.doc, afterPos));
        },
      }),
    ];
  },
});
