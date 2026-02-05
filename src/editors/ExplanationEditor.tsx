import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import * as MathematicsPkg from '@tiptap/extension-mathematics';
import { MathematicsWithInlineEdit } from '../extensions/MathematicsWithInlineEdit.js';
import TextAlign from '@tiptap/extension-text-align';
import { Table } from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import { TextStyleFontSize } from '../extensions/TextStyleFontSize.js';
import 'katex/dist/katex.min.css';
import 'mathlive/static.css';
import MenuBar from '../components/MenuBar.js';

type Props = {
  value: string; // HTML or text string
  onChange: (html: string) => void;
  placeholder?: string;
};

const PLACEHOLDER_LATEX = '\\text{Enter Equation here}';
const migrateMathStrings = (
  MathematicsPkg as unknown as { migrateMathStrings?: (editor: any, regex?: RegExp) => void }
).migrateMathStrings;

export default function ExplanationEditor({ value, onChange, placeholder }: Props) {
  const [, forceUpdate] = useState({});

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyleFontSize,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      MathematicsWithInlineEdit.configure({
        katexOptions: {
          throwOnError: false,
        },
        placeholderLatex: PLACEHOLDER_LATEX,
      } as Parameters<typeof MathematicsWithInlineEdit.configure>[0]),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: value || '',
    editorProps: {
      attributes: {
        style:
          'min-height:80px;max-height:200px;overflow-y:auto;border:1px solid #d0d7de;border-radius:8px;padding:10px;outline:none;font-size:1rem;',
        placeholder: placeholder || 'Enter your answer...',
        class: 'tiptap-editor',
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
      // Force re-render to update button states
      forceUpdate({});
    },
    onSelectionUpdate() {
      // Force re-render when selection changes (cursor moves, text selected)
      forceUpdate({});
    },
  });

  // Keep TipTap in sync if parent value changes externally
  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    // Only update if truly different (avoid infinite loops)
    if (value !== current && value !== undefined) {
      editor.commands.setContent(value || '', { emitUpdate: false });
      if (typeof migrateMathStrings === 'function' && /\$(?!\$)/.test(value || '')) {
        migrateMathStrings(editor, /\$(?!\$)([^$]+?)\$(?!\$)/g);
      }
    }
  }, [editor, value]);

  const insertInlineMath = (latex = PLACEHOLDER_LATEX) => {
    if (!editor) return;
    editor
      .chain()
      .focus()
      .insertContent({
        type: 'inlineMath',
        attrs: { latex },
      })
      .run();
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Table styles */}
      <style>{`
        .tiptap-editor table {
          border-collapse: collapse;
          margin: 0;
          overflow: hidden;
          table-layout: fixed;
          width: 100%;
        }
        .tiptap-editor table td,
        .tiptap-editor table th {
          min-width: 1em;
          border: 1px solid #ced4da;
          padding: 6px 8px;
          vertical-align: top;
          box-sizing: border-box;
          position: relative;
        }
        .tiptap-editor table th {
          font-weight: bold;
          text-align: left;
          background-color: #f1f3f5;
        }
        .tiptap-editor table .selectedCell:after {
          z-index: 2;
          position: absolute;
          content: "";
          left: 0; right: 0; top: 0; bottom: 0;
          background: rgba(200, 200, 255, 0.4);
          pointer-events: none;
        }
        .tiptap-editor table .column-resize-handle {
          position: absolute;
          right: -2px;
          top: 0;
          bottom: -2px;
          width: 4px;
          background-color: #adf;
          pointer-events: none;
        }
        .tiptap-inline-math-wrapper math-field::part(virtual-keyboard-toggle) {
          display: none;
        }
        .tiptap-inline-math-wrapper {
          overflow: visible;
        }
        .inline-math-insert-panel {
          z-index: 9999;
          min-width: 280px;
        }
        .inline-math-insert-panel button {
          white-space: nowrap;
        }
        .tiptap-math-placeholder,
        .tiptap-math-placeholder .katex {
          color: #999 !important;
        }
      `}</style>
      {/* Compact toolbar */}
      {editor && (
        <MenuBar
          editor={editor}
          onInsertEquation={() => insertInlineMath()}
        />
      )}

      <EditorContent editor={editor} />
    </Box>
  );
}