import { useCallback, useRef, useState } from 'react';
import type { Editor } from '@tiptap/react';
import type { ChemStructureOpenRequest } from '../extensions/ChemStructure';
import type { ChemStructureEmbed, EditorEmbeds } from '../types/embeds';
import { createChemStructureId } from '../utils/chemStructureIds';
import { getChemStructureEmbed, upsertChemStructure } from '../utils/embeds';

export type ChemDialogState =
  | { open: false }
  | {
      open: true;
      mode: 'insert' | 'edit';
      structureId: string;
      initialSourceValue: string;
      /** Document position when editing an existing node. */
      editPos?: number;
    };

type UseChemStructureEditorArgs = {
  editor: Editor | null;
  embeds?: EditorEmbeds;
  onEmbedsChange?: (embeds: EditorEmbeds) => void;
  /** When false, chem toolbar + click-to-edit are disabled. */
  enabled?: boolean;
};

export function useChemStructureEditor({
  editor,
  embeds,
  onEmbedsChange,
  enabled = true,
}: UseChemStructureEditorArgs) {
  const embedsRef = useRef(embeds);
  embedsRef.current = embeds;

  const [dialog, setDialog] = useState<ChemDialogState>({ open: false });

  const getEmbeds = useCallback(() => embedsRef.current, []);

  const patchEmbeds = useCallback(
    (structureId: string, embed: ChemStructureEmbed) => {
      const next = upsertChemStructure(embedsRef.current ?? {}, structureId, embed);
      onEmbedsChange?.(next);
      return next;
    },
    [onEmbedsChange],
  );

  const openChemEditor = useCallback(
    (request: ChemStructureOpenRequest) => {
      if (!enabled || !onEmbedsChange) return;

      if (request.mode === 'insert') {
        setDialog({
          open: true,
          mode: 'insert',
          structureId: createChemStructureId(),
          initialSourceValue: '',
        });
        return;
      }

      const existing = getChemStructureEmbed(embedsRef.current, request.structureId);
      setDialog({
        open: true,
        mode: 'edit',
        structureId: request.structureId,
        initialSourceValue: existing?.sourceValue ?? '',
        editPos: request.pos,
      });
    },
    [enabled, onEmbedsChange],
  );

  const closeDialog = useCallback(() => setDialog({ open: false }), []);

  const handleDialogSave = useCallback(
    async (embed: ChemStructureEmbed) => {
      if (!dialog.open || !editor) return;

      const structureId = dialog.structureId;
      patchEmbeds(structureId, embed);

      if (dialog.mode === 'insert') {
        editor.chain().focus().insertChemStructure(structureId).run();
      } else if (typeof dialog.editPos === 'number') {
        editor
          .chain()
          .focus()
          .setNodeSelection(dialog.editPos)
          .run();
      }

      // Force node views to re-read embeds after async save
      editor.view.dispatch(editor.state.tr);
    },
    [dialog, editor, patchEmbeds],
  );

  const insertNewStructure = useCallback(() => {
    openChemEditor({ mode: 'insert' });
  }, [openChemEditor]);

  return {
    chemEnabled: enabled && !!onEmbedsChange,
    getEmbeds,
    openChemEditor,
    insertNewStructure,
    dialog,
    closeDialog,
    handleDialogSave,
  };
}
