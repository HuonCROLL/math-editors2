import { Node, mergeAttributes } from '@tiptap/core';
import type { EditorEmbeds, GraphEmbed } from '../types/embeds';
import { getGraphEmbed } from '../utils/embeds';
import { graphModeLabel } from '../utils/graphMode';
import { resolveGraphDisplaySize } from '../utils/graphViewport';

export type GraphEmbedOpenRequest =
  | { mode: 'insert' }
  | { mode: 'edit'; embedId: string; pos?: number };

export type GraphEmbedResizePayload = {
  width: number;
  height: number;
};

export interface GraphEmbedExtensionOptions {
  getEmbeds: () => EditorEmbeds | undefined;
  onOpenEditor: (request: GraphEmbedOpenRequest) => void;
  onResizeEmbed?: (embedId: string, size: GraphEmbedResizePayload) => void;
  /** When false, hide the resize handle (read-only editor). */
  allowResize?: boolean;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    graphEmbed: {
      insertGraphEmbed: (embedId: string) => ReturnType;
    };
  }
}

const MIN_GRAPH_WIDTH = 200;
const MAX_GRAPH_WIDTH = 960;
const MIN_GRAPH_HEIGHT = 120;
const MAX_GRAPH_HEIGHT = 800;

function applyGraphNodeLayout(
  dom: HTMLElement,
  body: HTMLElement,
  embed: GraphEmbed | undefined,
) {
  const { width, height } = embed
    ? resolveGraphDisplaySize(embed)
    : { width: 400, height: 400 };

  dom.style.display = 'inline-block';
  dom.style.verticalAlign = 'top';
  dom.style.maxWidth = '100%';
  dom.style.width = `${width}px`;
  body.style.width = '100%';
  body.style.height = `${height}px`;
  body.style.boxSizing = 'border-box';
}

export const GraphEmbedNode = Node.create<GraphEmbedExtensionOptions>({
  name: 'graphEmbed',
  group: 'inline',
  inline: true,
  atom: true,
  selectable: true,

  addOptions() {
    return {
      getEmbeds: () => undefined,
      onOpenEditor: () => {},
      onResizeEmbed: undefined,
      allowResize: true,
    };
  },

  addAttributes() {
    return {
      embedId: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-embed-id'),
        renderHTML: (attributes) => {
          if (!attributes.embedId) return {};
          return { 'data-embed-id': attributes.embedId };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'motionless[data-type="graph"]',
        getAttrs: (element) => {
          if (typeof element === 'string') return false;
          const id = element.getAttribute('data-embed-id');
          return id ? { embedId: id } : false;
        },
      },
      {
        tag: 'motion[data-type="graph"]',
        getAttrs: (element) => {
          if (typeof element === 'string') return false;
          const id = element.getAttribute('data-embed-id');
          return id ? { embedId: id } : false;
        },
      },
      {
        tag: 'div[data-type="graph"]',
        getAttrs: (element) => {
          if (typeof element === 'string') return false;
          const id = element.getAttribute('data-embed-id');
          return id ? { embedId: id } : false;
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-type': 'graph',
        class: 'graph-embed-node',
      }),
    ];
  },

  addCommands() {
    return {
      insertGraphEmbed:
        (embedId: string) =>
        ({ commands }) =>
          commands.insertContent({
            type: this.name,
            attrs: { embedId },
          }),
    };
  },

  addNodeView() {
    const { getEmbeds, onOpenEditor, onResizeEmbed, allowResize } = this.options;

    return ({ node, getPos, editor }) => {
      const dom = document.createElement('div');
      dom.className = 'graph-embed-node';
      dom.dataset.type = 'graph';
      dom.contentEditable = 'false';

      const header = document.createElement('div');
      header.className = 'graph-embed-node__header';

      const label = document.createElement('span');
      label.className = 'graph-embed-node__label';

      const editBtn = document.createElement('button');
      editBtn.type = 'button';
      editBtn.className = 'graph-embed-node__edit';
      editBtn.textContent = 'Edit graph';

      header.appendChild(label);
      header.appendChild(editBtn);

      const body = document.createElement('div');
      body.className = 'graph-embed-node__body';

      const mount = document.createElement('div');
      mount.className = 'graph-embed-node__mount';
      mount.dataset.graphPreviewMount = 'true';

      body.appendChild(mount);

      let resizeHandle: HTMLDivElement | null = null;
      if (allowResize !== false && onResizeEmbed) {
        resizeHandle = document.createElement('div');
        resizeHandle.className = 'graph-embed-node__resize-handle';
        resizeHandle.title = 'Drag to resize graph';
        resizeHandle.setAttribute('aria-label', 'Resize graph');
        body.appendChild(resizeHandle);
      }

      dom.appendChild(header);
      dom.appendChild(body);

      const openEditor = () => {
        const embedId = node.attrs.embedId as string;
        let pos = getPos();
        if (typeof pos !== 'number') {
          editor.state.doc.descendants((n, p) => {
            if (n.type.name === 'graphEmbed' && n.attrs.embedId === embedId) {
              pos = p;
              return false;
            }
          });
        }
        onOpenEditor({
          mode: 'edit',
          embedId,
          pos: typeof pos === 'number' ? pos : undefined,
        });
      };

      const syncNode = (updatedNode: typeof node) => {
        node = updatedNode;
        const embedId = node.attrs.embedId as string;
        dom.dataset.embedId = embedId;
        mount.dataset.graphEmbedId = embedId;

        const embed = getGraphEmbed(getEmbeds(), embedId);
        dom.classList.toggle('graph-embed-node--missing', !embed);

        if (embed) {
          label.textContent = `Graph (${graphModeLabel(embed)})`;
        } else {
          label.textContent = 'Graph (missing definition)';
        }

        applyGraphNodeLayout(dom, body, embed);
      };

      syncNode(node);

      if (resizeHandle && onResizeEmbed) {
        resizeHandle.addEventListener('mousedown', (event) => {
          event.preventDefault();
          event.stopPropagation();

          const embedId = node.attrs.embedId as string;
          const startX = event.clientX;
          const startY = event.clientY;
          const startW = body.offsetWidth;
          const startH = body.offsetHeight;

          const onMove = (moveEvent: MouseEvent) => {
            const width = Math.min(
              MAX_GRAPH_WIDTH,
              Math.max(MIN_GRAPH_WIDTH, startW + moveEvent.clientX - startX),
            );
            const height = Math.min(
              MAX_GRAPH_HEIGHT,
              Math.max(MIN_GRAPH_HEIGHT, startH + moveEvent.clientY - startY),
            );
            dom.style.width = `${width}px`;
            body.style.width = '100%';
            body.style.height = `${height}px`;
          };

          const onUp = (upEvent: MouseEvent) => {
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseup', onUp);
            const width = Math.min(
              MAX_GRAPH_WIDTH,
              Math.max(MIN_GRAPH_WIDTH, startW + upEvent.clientX - startX),
            );
            const height = Math.min(
              MAX_GRAPH_HEIGHT,
              Math.max(MIN_GRAPH_HEIGHT, startH + upEvent.clientY - startY),
            );
            onResizeEmbed(embedId, { width, height });
          };

          window.addEventListener('mousemove', onMove);
          window.addEventListener('mouseup', onUp);
        });
      }

      editBtn.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        openEditor();
      });

      header.addEventListener('click', (event) => {
        if (event.target === editBtn) return;
        openEditor();
      });

      return {
        dom,
        update(updatedNode) {
          if (updatedNode.type.name !== 'graphEmbed') return false;
          syncNode(updatedNode);
          return true;
        },
        ignoreMutation(mutation) {
          const target = mutation.target;
          if (!(target instanceof HTMLElement)) return false;
          return body.contains(target);
        },
      };
    };
  },
});
