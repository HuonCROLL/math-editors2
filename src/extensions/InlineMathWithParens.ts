import { InputRule } from '@tiptap/core';
import { Plugin, PluginKey, TextSelection } from '@tiptap/pm/state';
import { InlineMath } from '@tiptap/extension-mathematics';
import { convertMathDelimiters } from '../utils/mathDelimiterConvert';

const INLINE_MATH_PATTERN = /\\\((.+?)\\\)/g;
const delimiterConvertKey = new PluginKey('inlineMathDelimiterConvert');

/**
 * Inline math with only \( ... \) input rules.
 * This intentionally avoids the upstream dollar-delimiter rules.
 *
 * Also converts complete `\(...\)` pairs via appendTransaction so typing the
 * opening `\(` after the body+`\)` already exists still renders (InputRules
 * only match text before the cursor).
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

  addProseMirrorPlugins() {
    const nodeType = this.type;

    return [
      new Plugin({
        key: delimiterConvertKey,
        appendTransaction(transactions, _oldState, newState) {
          if (!transactions.some((tr) => tr.docChanged)) return null;
          if (transactions.some((tr) => tr.getMeta(delimiterConvertKey))) return null;

          const tr = convertMathDelimiters(newState, {
            pattern: INLINE_MATH_PATTERN,
            nodeType,
          });
          if (!tr) return null;
          tr.setMeta(delimiterConvertKey, true);
          return tr;
        },
      }),
    ];
  },
});
