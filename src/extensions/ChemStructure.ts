import { Node, mergeAttributes } from '@tiptap/core';
import type { EditorEmbeds } from '../types/embeds';
import { getChemStructureEmbed } from '../utils/embeds';
import { namespaceChemPreviewSvg } from '../utils/chemStructurePreview';

export type ChemStructureOpenRequest =
  | { mode: 'insert' }
  | { mode: 'edit'; structureId: string; pos: number };

export interface ChemStructureOptions {
  getEmbeds: () => EditorEmbeds | undefined;
  onOpenEditor: (request: ChemStructureOpenRequest) => void;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    chemStructure: {
      insertChemStructure: (structureId: string) => ReturnType;
    };
  }
}

export const ChemStructure = Node.create<ChemStructureOptions>({
  name: 'chemStructure',
  group: 'inline',
  inline: true,
  atom: true,
  selectable: true,

  addOptions() {
    return {
      getEmbeds: () => undefined,
      onOpenEditor: () => {},
    };
  },

  addAttributes() {
    return {
      structureId: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-structure-id'),
        renderHTML: (attributes) => {
          if (!attributes.structureId) return {};
          return { 'data-structure-id': attributes.structureId };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-type="chem-structure"]',
        getAttrs: (element) => {
          if (typeof element === 'string') return false;
          const id = element.getAttribute('data-structure-id');
          return id ? { structureId: id } : false;
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'span',
      mergeAttributes(HTMLAttributes, {
        'data-type': 'chem-structure',
        class: 'chem-structure-node',
      }),
    ];
  },

  addCommands() {
    return {
      insertChemStructure:
        (structureId: string) =>
        ({ commands }) =>
          commands.insertContent({
            type: this.name,
            attrs: { structureId },
          }),
    };
  },

  addNodeView() {
    const { getEmbeds, onOpenEditor } = this.options;

    return ({ node, getPos, editor }) => {
      const dom = document.createElement('span');
      dom.className = 'chem-structure-node';
      dom.dataset.type = 'chem-structure';
      dom.contentEditable = 'false';

      const renderPreview = () => {
        const structureId = node.attrs.structureId as string;
        dom.dataset.structureId = structureId;

        const embed = getChemStructureEmbed(getEmbeds(), structureId);
        dom.innerHTML = '';
        dom.classList.remove('chem-structure-node--missing');

        const previewSvg = embed?.previewSvg ?? embed?.preview_svg;
        if (previewSvg) {
          const wrap = document.createElement('span');
          wrap.className = 'chem-structure-preview';
          wrap.innerHTML = namespaceChemPreviewSvg(previewSvg, structureId);
          dom.appendChild(wrap);
        } else {
          dom.classList.add('chem-structure-node--missing');
          dom.textContent = 'Chemical structure';
        }
      };

      renderPreview();

      if (editor.isEditable) {
        dom.style.cursor = 'pointer';
        dom.title = 'Click to edit structure';

        dom.addEventListener('click', (event) => {
          event.preventDefault();
          event.stopPropagation();
          const pos = getPos();
          if (typeof pos !== 'number') return;
          onOpenEditor({
            mode: 'edit',
            structureId: node.attrs.structureId,
            pos,
          });
        });
      }

      return {
        dom,
        update(updatedNode) {
          if (updatedNode.type.name !== 'chemStructure') return false;
          node = updatedNode;
          renderPreview();
          return true;
        },
      };
    };
  },
});
