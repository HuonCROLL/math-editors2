import { Extension, InputRule } from '@tiptap/core';
import { BlockMath } from '@tiptap/extension-mathematics';
import { TextSelection } from 'prosemirror-state';
import type { MathematicsOptions } from '@tiptap/extension-mathematics';
import { InlineMathWithMathLive } from './InlineMathWithMathLive';

export const BlockMathWithBrackets = BlockMath.extend({
  addInputRules() {
    return [
      new InputRule({
        find: /\\\[(.+?)\\\]$/,
        handler: ({ state, range, match }) => {
          const latex = (match[1] || '').trim();
          if (!latex) return;
          const node = this.type.create({ latex });
          const { tr } = state;
          tr.replaceWith(range.from, range.to, node);
          // Position cursor after the block node so it renders immediately.
          tr.setSelection(TextSelection.near(tr.doc.resolve(range.from + node.nodeSize)));
        },
      }),
    ];
  },
});

/**
 * Mathematics extension that uses InlineMathWithMathLive for inline math,
 * enabling click-to-edit with MathLive (no popover, no raw LaTeX visible).
 * Block math uses \[...\] delimiters.
 */
export const MathematicsWithInlineEdit = Extension.create<MathematicsOptions>({
  name: 'MathematicsWithInlineEdit',

  addOptions() {
    return {
      inlineOptions: undefined,
      blockOptions: undefined,
      katexOptions: undefined,
      placeholderLatex: undefined as string | undefined,
    };
  },

  addExtensions() {
    return [
      BlockMathWithBrackets.configure({
        ...this.options.blockOptions,
        katexOptions: this.options.katexOptions,
      }),
      InlineMathWithMathLive.configure({
        ...this.options.inlineOptions,
        katexOptions: this.options.katexOptions,
        placeholderLatex: (this.options as { placeholderLatex?: string }).placeholderLatex,
      } as Parameters<typeof InlineMathWithMathLive.configure>[0]),
    ];
  },
});