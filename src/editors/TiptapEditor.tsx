import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';

/* ───────── extensions ───────── */
import StarterKit from '@tiptap/starter-kit';
import ImageResize from 'tiptap-extension-resize-image';
import { Table } from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import { InlineMath } from '@tiptap/extension-mathematics';
import { BlockMathWithBrackets } from '../extensions/MathematicsWithInlineEdit';
import { OverleafPaste } from '../extensions/OverleafPaste';
import { SmartMathPaste } from '../extensions/SmartMathPaste';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyleFontSize } from '../extensions/TextStyleFontSize';
import Box from '@mui/material/Box';
import 'katex/dist/katex.min.css';
import '../styles/tiptap.css';
import MenuBar from '../components/MenuBar';

type QuestionOpts =
  | boolean
  | { enabled: boolean; subjectId?: string | null; categoryId?: string | null };

interface Props {
  value: string;
  onChange: (html: string) => void;
  readOnly?: boolean;
  /** Enable question placeholders + picker (pass subject/category to scope results) */
  questions?: QuestionOpts;
  menuBarWrapperSx?: any;
  toolbarMode?: 'studentSimple' | 'tutorFull';
}

const TiptapEditor: React.FC<Props> = ({
  value,
  onChange,
  readOnly,
  questions = false,
  menuBarWrapperSx,
  toolbarMode = 'tutorFull',
}) => {
  /* -------------------------------- editor -------------------------------- */
  const editor = useEditor({
    content: value || '<p></p>',
    editable: !readOnly,
    extensions: [
      TextStyleFontSize,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),

      /* base */
      StarterKit,

      /* images */
      ImageResize,

      /* smart‑paste for Overleaf tabular */
      OverleafPaste,
      SmartMathPaste,

      InlineMath.configure({ katexOptions: { throwOnError: false } }),
      BlockMathWithBrackets.configure({ katexOptions: { throwOnError: false } }),

      /* tables */
      Table.configure({
        resizable: true,
        HTMLAttributes: { class: 'tiptap-table' },
      }),

      TableRow,
      TableCell,
      TableHeader,
    ],
  });

  useEffect(() => {
    if (!editor) return;
    const handler = () => onChange(editor.getHTML());
    editor.on('update', handler);
    return () => {
      editor.off('update', handler);
    };
  }, [editor, onChange]);

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [editor, value]);

  if (!editor) return null;
  return (
    <>
      <Box sx={menuBarWrapperSx}>
        <MenuBar editor={editor} showQuestionButton={false} toolbarMode={toolbarMode} />
      </Box>
      <EditorContent editor={editor} className="tiptap" />
    </>
  );
};

export default TiptapEditor;