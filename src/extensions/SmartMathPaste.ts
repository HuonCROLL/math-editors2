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
            if (!plain.includes('\\[') && !plain.includes('\\(')) return false;

            const delimiterPattern = /\\\[([\s\S]+?)\\\]|\\\(([\s\S]+?)\\\)/g;
            if (!delimiterPattern.test(plain)) return false;

            event.preventDefault();

            const blockMathNodeName =
              (editor.schema.nodes as any).blockMath
                ? 'blockMath'
                : (editor.schema.nodes as any).math
                  ? 'math'
                  : (editor.schema.nodes as any).mathBlock
                  ? 'mathBlock'
                  : null;

            const inlineMathNodeName =
              (editor.schema.nodes as any).inlineMath
                ? 'inlineMath'
                : (editor.schema.nodes as any).mathInline
                  ? 'mathInline'
                  : null;

            const hasBlockMath = /\\\[([\s\S]+?)\\\]/.test(plain);
            const hasInlineMath = /\\\(([\s\S]+?)\\\)/.test(plain);
            if ((hasBlockMath && !blockMathNodeName) || (hasInlineMath && !inlineMathNodeName)) {
              // No compatible math node - do not lose the paste.
              editor.commands.insertContent(plain);
              return true;
            }

            const hasAttr = (nodeName: string, attrName: string) =>
              Object.prototype.hasOwnProperty.call(editor.schema.nodes[nodeName].spec.attrs ?? {}, attrName);

            const makeMathAttrs = (nodeName: string, latex: string, displayMode?: boolean) => {
              const attrs: Record<string, any> = {};
              if (hasAttr(nodeName, 'content')) {
                attrs.content = latex;
              } else {
                attrs.latex = latex;
              }
              if (displayMode !== undefined && hasAttr(nodeName, 'displayMode')) {
                attrs.displayMode = displayMode;
              }
              return attrs;
            };

            const makeInlineMath = (latex: string) => ({
              type: inlineMathNodeName as string,
              attrs: makeMathAttrs(inlineMathNodeName as string, latex),
            });

            const makeMathBlock = (latex: string) => ({
              type: blockMathNodeName as string,
              attrs: makeMathAttrs(blockMathNodeName as string, latex, true),
            });

            const buildInlineContent = (text: string) => {
              const inlinePattern = /\\\(([\s\S]+?)\\\)/g;
              const inlineContent: any[] = [];
              let lastInline = 0;
              let inlineMatch: RegExpExecArray | null;

              while ((inlineMatch = inlinePattern.exec(text))) {
                const beforeInline = text.slice(lastInline, inlineMatch.index);
                if (beforeInline) inlineContent.push({ type: 'text', text: beforeInline });

                const latex = inlineMatch[1].trim();
                if (latex) {
                  inlineContent.push(makeInlineMath(latex));
                } else {
                  inlineContent.push({ type: 'text', text: inlineMatch[0] });
                }

                lastInline = inlinePattern.lastIndex;
              }

              const inlineTail = text.slice(lastInline);
              if (inlineTail) inlineContent.push({ type: 'text', text: inlineTail });

              return inlineContent;
            };

            if (!hasBlockMath) {
              const inlineContent = buildInlineContent(plain);
              const ok = editor.chain().focus().insertContent(inlineContent).run();
              if (!ok) editor.commands.insertContent(plain);
              return true;
            }

            // Build content: paragraphs before/after, inline math for \( ... \), and block math for \[...\]
            const content: any[] = [];
            let paragraphContent: any[] = [];
            let last = 0;
            delimiterPattern.lastIndex = 0;
            let m: RegExpExecArray | null;

            const flushParagraph = () => {
              if (paragraphContent.length > 0) {
                content.push({ type: 'paragraph', content: paragraphContent });
                paragraphContent = [];
              }
            };

            while ((m = delimiterPattern.exec(plain))) {
              const before = plain.slice(last, m.index);
              if (before) paragraphContent.push(...buildInlineContent(before));

              if (m[1] !== undefined) {
                flushParagraph();
                const latex = m[1].trim();
                if (latex) content.push(makeMathBlock(latex));
              } else {
                const latex = (m[2] || '').trim();
                if (latex) {
                  paragraphContent.push(makeInlineMath(latex));
                } else {
                  paragraphContent.push({ type: 'text', text: m[0] });
                }
              }

              last = delimiterPattern.lastIndex;
            }
            const tail = plain.slice(last);
            if (tail) paragraphContent.push(...buildInlineContent(tail));
            flushParagraph();

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
