import type { EditorEmbeds } from '../types/embeds';
import { getGraphEmbed } from './embeds';

const PLACEHOLDER_LABEL = 'Graph';

/**
 * Replace `<div data-type="graph" data-embed-id="...">` placeholders
 * with mountable preview containers for client-side JSXGraph hydration.
 */
export function hydrateGraphsInHtml(html: string, embeds?: EditorEmbeds): string {
  if (!html || !html.includes('data-type="graph"')) return html;
  if (!embeds?.graphs || !Object.keys(embeds.graphs).length) return html;

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const nodes = Array.from(
    doc.querySelectorAll<HTMLElement>('[data-type="graph"][data-embed-id]'),
  );

  nodes.forEach((node) => {
    const id = node.getAttribute('data-embed-id') ?? '';
    const embed = getGraphEmbed(embeds, id);
    const replacement = doc.createElement('div');
    replacement.setAttribute('data-type', 'graph');
    replacement.setAttribute('data-embed-id', id);
    replacement.className = 'graph-embed-preview';

    if (embed) {
      replacement.dataset.graphMode = embed.mode;
      const inner = doc.createElement('div');
      inner.className = 'graph-embed-preview__mount';
      inner.dataset.graphEmbedId = id;
      inner.style.minHeight = '280px';
      inner.style.width = '100%';
      replacement.appendChild(inner);
    } else {
      replacement.textContent = PLACEHOLDER_LABEL;
      replacement.classList.add('graph-embed-preview--missing');
    }

    node.replaceWith(replacement);
  });

  return doc.body.innerHTML;
}
