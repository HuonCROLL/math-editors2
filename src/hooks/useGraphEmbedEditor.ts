import { useCallback, useRef, useState } from 'react';
import type { Editor } from '@tiptap/react';
import type { GraphEmbedOpenRequest } from '../extensions/GraphEmbed';
import type { EditorEmbeds, GraphEmbed } from '../types/embeds';
import { createGraphEmbedId } from '../utils/graphIds';
import { getGraphEmbed, upsertGraphEmbed } from '../utils/embeds';
import { withAutoDisplaySize } from '../utils/graphViewport';

export type GraphDialogState =
  | { open: false }
  | {
      open: true;
      mode: 'insert' | 'edit';
      embedId: string;
      initialEmbed: GraphEmbed;
      editPos?: number;
    };

const defaultGraphEmbed = (): GraphEmbed => ({
  type: 'graph',
  renderer: 'jsxgraph',
  mode: 'display',
  viewport: { xMin: -10, xMax: 10, yMin: -10, yMax: 10 },
  options: {
    showAxes: true,
    showGrid: true,
    gridStep: 1,
    showLabels: true,
    scaleRatio: { x: 1, y: 1 },
    snapToGrid: false,
  },
  autoDisplaySize: true,
  expressions: [],
  objects: [],
});

type UseGraphEmbedEditorArgs = {
  editor: Editor | null;
  embeds?: EditorEmbeds;
  onEmbedsChange?: (embeds: EditorEmbeds) => void;
  enabled?: boolean;
};

export function useGraphEmbedEditor({
  editor,
  embeds,
  onEmbedsChange,
  enabled = true,
}: UseGraphEmbedEditorArgs) {
  const embedsRef = useRef(embeds);
  embedsRef.current = embeds;

  const [dialog, setDialog] = useState<GraphDialogState>({ open: false });

  const getEmbeds = useCallback(() => embedsRef.current, []);

  const patchEmbeds = useCallback(
    (embedId: string, embed: GraphEmbed) => {
      const next = upsertGraphEmbed(embedsRef.current ?? {}, embedId, embed);
      embedsRef.current = next;
      onEmbedsChange?.(next);
      return next;
    },
    [onEmbedsChange],
  );

  const openGraphEditor = useCallback(
    (request: GraphEmbedOpenRequest) => {
      if (!enabled || !onEmbedsChange) return;

      if (request.mode === 'insert') {
        setDialog({
          open: true,
          mode: 'insert',
          embedId: createGraphEmbedId(),
          initialEmbed: withAutoDisplaySize(defaultGraphEmbed()),
        });
        return;
      }

      const existing = getGraphEmbed(embedsRef.current, request.embedId);
      setDialog({
        open: true,
        mode: 'edit',
        embedId: request.embedId,
        initialEmbed: existing ?? defaultGraphEmbed(),
        editPos: request.pos,
      });
    },
    [enabled, onEmbedsChange],
  );

  const closeDialog = useCallback(() => setDialog({ open: false }), []);

  const handleDialogSave = useCallback(
    (embed: GraphEmbed) => {
      if (!dialog.open || !editor) return;

      const embedId = dialog.embedId;
      patchEmbeds(embedId, embed);

      if (dialog.mode === 'insert') {
        editor.chain().focus().insertGraphEmbed(embedId).run();
      } else if (typeof dialog.editPos === 'number') {
        editor.chain().focus().setNodeSelection(dialog.editPos).run();
      }

      editor.view.dispatch(editor.state.tr);
    },
    [dialog, editor, patchEmbeds],
  );

  const insertNewGraph = useCallback(() => {
    openGraphEditor({ mode: 'insert' });
  }, [openGraphEditor]);

  const resizeGraphEmbed = useCallback(
    (embedId: string, size: { width: number; height: number }) => {
      if (!enabled || !onEmbedsChange) return;
      const existing = getGraphEmbed(embedsRef.current, embedId);
      if (!existing) return;
      patchEmbeds(embedId, {
        ...existing,
        autoDisplaySize: false,
        displayWidth: size.width,
        displayHeight: size.height,
      });
    },
    [enabled, onEmbedsChange, patchEmbeds],
  );

  return {
    graphEnabled: enabled && !!onEmbedsChange,
    getEmbeds,
    openGraphEditor,
    insertNewGraph,
    resizeGraphEmbed,
    dialog,
    closeDialog,
    handleDialogSave,
  };
}
