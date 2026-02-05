import { Extension } from '@tiptap/core';
import { BlockMath } from '@tiptap/extension-mathematics';
import type { MathematicsOptions } from '@tiptap/extension-mathematics';
import { InlineMathWithMathLive } from './InlineMathWithMathLive';

/**
 * Mathematics extension that uses InlineMathWithMathLive for inline math,
 * enabling click-to-edit with MathLive (no popover, no raw LaTeX visible).
 * Block math uses the default implementation.
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
      BlockMath.configure({
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