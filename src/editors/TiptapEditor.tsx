import React, { useEffect, useMemo } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';

/* ───────── extensions ───────── */
import StarterKit from '@tiptap/starter-kit';
import ImageResize from 'tiptap-extension-resize-image';
import { Table } from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import { InlineMathWithParens } from '../extensions/InlineMathWithParens';
import { BlockMathWithBrackets } from '../extensions/MathematicsWithInlineEdit';
import { OverleafPaste } from '../extensions/OverleafPaste';
import { SmartMathPaste } from '../extensions/SmartMathPaste';
import { ChemStructure } from '../extensions/ChemStructure';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyleFontSize } from '../extensions/TextStyleFontSize';
import Box from '@mui/material/Box';
import 'katex/dist/katex.min.css';
import '../styles/tiptap.css';
import MenuBar from '../components/MenuBar';
import ChemStructureDialog from '../components/ChemStructureDialogLazy';
import { useChemStructureEditor } from '../hooks/useChemStructureEditor';
import type { EditorEmbeds } from '../types/embeds';

type QuestionOpts =
  | boolean
  | { enabled: boolean; subjectId?: string | null; categoryId?: string | null };

interface Props {
  value: string;
  onChange: (html: string) => void;
  readOnly?: boolean;
  /** Enable question placeholders + picker (pass subject/category to scope results) */
  questions?: QuestionOpts;
  /** Chemical structure embeds manifest (paired with chem-structure spans in HTML). */
  embeds?: EditorEmbeds;
  onEmbedsChange?: (embeds: EditorEmbeds) => void;
  menuBarWrapperSx?: any;
  toolbarMode?: 'studentSimple' | 'tutorFull';
}

const TiptapEditor: React.FC<Props> = ({
  value,
  onChange,
  readOnly,
  questions = false,
  embeds,
  onEmbedsChange,
  menuBarWrapperSx,
  toolbarMode = 'tutorFull',
}) => {
  const chemEditorRef = React.useRef<ReturnType<typeof useChemStructureEditor> | null>(null);

  const chemExtension = useMemo(
    () =>
      ChemStructure.configure({
        getEmbeds: () => chemEditorRef.current?.getEmbeds(),
        onOpenEditor: (request) => chemEditorRef.current?.openChemEditor(request),
      }),
    [],
  );

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

      /* smart-paste for Overleaf tabular and math delimiters */
      OverleafPaste,
      SmartMathPaste,

      InlineMathWithParens.configure({ katexOptions: { throwOnError: false } }),
      BlockMathWithBrackets.configure({ katexOptions: { throwOnError: false } }),

      /* tables */
      Table.configure({
        resizable: true,
        HTMLAttributes: { class: 'tiptap-table' },
      }),

      TableRow,
      TableCell,
      TableHeader,

      chemExtension,
    ],
  });

  const chemEditor = useChemStructureEditor({
    editor,
    embeds,
    onEmbedsChange,
    enabled: !readOnly,
  });
  chemEditorRef.current = chemEditor;

  useEffect(() => {
    if (editor) {
      editor.view.dispatch(editor.state.tr);
    }
  }, [editor, embeds]);

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
        <MenuBar
          editor={editor}
          showQuestionButton={false}
          toolbarMode={toolbarMode}
          onInsertChemStructure={chemEditor.chemEnabled ? chemEditor.insertNewStructure : undefined}
        />
      </Box>
      <EditorContent editor={editor} className="tiptap" />
      {chemEditor.dialog.open && (
        <ChemStructureDialog
          open
          mode={chemEditor.dialog.mode}
          initialSourceValue={chemEditor.dialog.initialSourceValue}
          onClose={chemEditor.closeDialog}
          onSave={chemEditor.handleDialogSave}
        />
      )}
    </>
  );
};

export default TiptapEditor;