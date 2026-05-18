import { NodeSelection } from 'prosemirror-state';
import type { EditorView } from 'prosemirror-view';

/**
 * Consistent Backspace behavior around atomic math nodes:
 * - First Backspace after inline math selects the node (visible outline).
 * - Second Backspace deletes the selected math node.
 * - Backspace in an empty paragraph after block math selects the block node.
 */
export function handleMathBackspaceKeyDown(view: EditorView, event: KeyboardEvent): boolean {
  if (event.key !== 'Backspace') return false;

  const { state } = view;
  const { selection } = state;

  if (selection instanceof NodeSelection) {
    const name = selection.node.type.name;
    if (name === 'inlineMath' || name === 'blockMath') {
      event.preventDefault();
      view.dispatch(state.tr.deleteSelection());
      return true;
    }
  }

  if (!selection.empty) return false;

  const { $from } = selection;
  const nodeBefore = $from.nodeBefore;

  if (nodeBefore?.type.name === 'inlineMath') {
    event.preventDefault();
    view.dispatch(
      state.tr.setSelection(NodeSelection.create(state.doc, $from.pos - nodeBefore.nodeSize))
    );
    return true;
  }

  if (
    $from.parent.type.name === 'paragraph' &&
    $from.parent.content.size === 0 &&
    $from.parentOffset === 0
  ) {
    const paragraphStart = $from.before($from.depth);
    const previousNode = state.doc.resolve(paragraphStart).nodeBefore;
    if (previousNode?.type.name === 'blockMath') {
      event.preventDefault();
      view.dispatch(
        state.tr.setSelection(NodeSelection.create(state.doc, paragraphStart - previousNode.nodeSize))
      );
      return true;
    }
  }

  return false;
}
