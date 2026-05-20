import React from 'react';
import { createRoot, type Root } from 'react-dom/client';
import GraphPreview from '../components/GraphPreview';
import { graphPreviewKey } from './graphPreviewKey';
import type { EditorEmbeds } from '../types/embeds';
import { getGraphEmbed } from './embeds';
import { resolveGraphDisplaySize } from './graphViewport';

const roots = new WeakMap<HTMLElement, Root>();
const rootKeys = new WeakMap<HTMLElement, string>();

export type MountGraphPreviewsOptions = {
  /** When true, answer-input graphs show tools but cannot draw (student view). */
  answerInputReadOnly?: boolean;
  height?: number;
};

/** Mount JSXGraph previews into hydrated graph placeholder nodes. */
export function mountGraphPreviewsInElement(
  container: HTMLElement,
  embeds?: EditorEmbeds | null,
  options?: MountGraphPreviewsOptions,
): void {
  const height = options?.height ?? 280;
  const mounts = container.querySelectorAll<HTMLElement>(
    '[data-graph-embed-id], .graph-embed-node__mount[data-graph-embed-id]',
  );

  mounts.forEach((mountEl) => {
    const embedId = mountEl.dataset.graphEmbedId;
    if (!embedId) return;
    const embed = getGraphEmbed(embeds ?? undefined, embedId);
    if (!embed) return;

    const key = graphPreviewKey(embed);
    const prevKey = rootKeys.get(mountEl);
    let root = roots.get(mountEl);

    if (!root || prevKey !== key) {
      if (root) root.unmount();
      root = createRoot(mountEl);
      roots.set(mountEl, root);
      rootKeys.set(mountEl, key);
    }

    const { width: plotWidth, height: plotHeight } = resolveGraphDisplaySize(embed);
    const inEditorNode = mountEl.closest('.graph-embed-node__body') != null;
    root.render(
      <GraphPreview
        embed={embed}
        height={inEditorNode ? '100%' : plotHeight}
        width={inEditorNode ? '100%' : `${plotWidth}px`}
      />,
    );

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        void mountEl.offsetHeight;
        window.dispatchEvent(new Event('resize'));
      });
    });
  });
}

/** Unmount graph preview React roots inside a container. */
export function unmountGraphPreviewsInElement(container: HTMLElement): void {
  const mounts = container.querySelectorAll<HTMLElement>(
    '[data-graph-embed-id], .graph-embed-node__mount[data-graph-embed-id]',
  );
  mounts.forEach((mountEl) => {
    const root = roots.get(mountEl);
    if (root) {
      root.unmount();
      roots.delete(mountEl);
      rootKeys.delete(mountEl);
    }
  });
}
