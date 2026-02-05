// SmartMathPaste.ts
import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from 'prosemirror-state';

export const SmartMathPaste = Extension.create({
  name: 'smartMathPaste',

  addProseMirrorPlugins() {
    const editor = this.editor;

    return [
      new Plugin({
        key: new PluginKey('smartMathPaste'),
        props: {
          handlePaste(_view, event) {
            const plain = event.clipboardData?.getData('text/plain') ?? '';
            if (!plain.includes('$$')) return false;

            // robust multi-line $$...$$ capture
            const pattern = /\$\$([\s\S]+?)\$\$/g;
            if (!pattern.test(plain)) return false;

            event.preventDefault();

            // Detect the block math node name available in the schema
            // Prefer 'math', otherwise try 'mathBlock'
            const mathNodeName =
              (editor.schema.nodes as any).math
                ? 'math'
                : (editor.schema.nodes as any).mathBlock
                  ? 'mathBlock'
                  : null;

            if (!mathNodeName) {
              // No compatible math node – don’t lose the paste
              editor.commands.insertContent(plain);
              return true;
            }

            // Determine which attribute the node expects: 'content' (common) or 'latex'
            const nodeType = editor.schema.nodes[mathNodeName];
            const expectsContent = !!nodeType.spec.attrs?.content;
            const expectsLatex = !!nodeType.spec.attrs?.latex;

            const makeMathBlock = (latex: string) => ({
              type: mathNodeName,
              attrs: expectsContent
                ? { content: latex, displayMode: true }
                : expectsLatex
                  ? { latex, displayMode: true }
                  : { content: latex, displayMode: true }, // sensible default
            });

            const toParagraph = (text: string) => ({
              type: 'paragraph',
              content: text ? [{ type: 'text', text }] : [],
            });

            // Build content: paragraphs before/after, math block for each $$...$$
            const content: any[] = [];
            let last = 0;
            pattern.lastIndex = 0;
            let m: RegExpExecArray | null;

            while ((m = pattern.exec(plain))) {
              const before = plain.slice(last, m.index).trim();
              if (before) content.push(toParagraph(before));

              const latex = m[1].trim();
              content.push(makeMathBlock(latex));

              last = pattern.lastIndex;
            }
            const tail = plain.slice(last).trim();
            if (tail) content.push(toParagraph(tail));

            // Try inserting; if it fails for any reason, fall back to raw paste so nothing is lost
            const ok = editor.chain().focus().insertContent(content).run();
            if (!ok) editor.commands.insertContent(plain);

            return true;
          },
        },
      }),
    ];
  },
});
