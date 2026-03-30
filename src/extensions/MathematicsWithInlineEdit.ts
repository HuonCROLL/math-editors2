import { Extension, InputRule } from '@tiptap/core';
import { BlockMath } from '@tiptap/extension-mathematics';
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
          const { tr } = state;
          tr.replaceWith(range.from, range.to, this.type.create({ latex }));
          // No manual setSelection: ProseMirror places the cursor naturally after
          // the block node. Manually resolving position after replaceWith can produce
          // an invalid offset when the document is restructured to fit the block node,
          // causing the transaction to be silently rolled back.
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
