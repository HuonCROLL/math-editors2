import type { EditorEmbeds } from '../types/embeds';
import { getChemStructureEmbed } from './embeds';
import { hydrateGraphsInHtml } from './graphPreview';

const PLACEHOLDER_LABEL = 'Chemical structure';

const cssEscapeValue = (value: string) => {
  if (typeof CSS !== 'undefined' && CSS.escape) return CSS.escape(value);
  return value.replace(/["\\#.[\]:,>+~*^$|=!\s]/g, '\\$&');
};

/**
 * Ketcher SVGs reuse ids such as `glyph-0-1`. Prefix them per structure so
 * multiple inline molecule previews do not resolve <use> references across SVGs.
 */
export function namespaceChemPreviewSvg(svg: string, structureId: string): string {
  if (!svg || !structureId || !svg.includes('<svg')) return svg;

  const parser = new DOMParser();
  const doc = parser.parseFromString(svg, 'image/svg+xml');
  const svgEl = doc.documentElement;
  if (svgEl.nodeName.toLowerCase() !== 'svg') return svg;

  const idMap = new Map<string, string>();
  const prefix = `chem-${structureId.replace(/[^a-zA-Z0-9_-]/g, '-')}`;

  svgEl.querySelectorAll<HTMLElement>('[id]').forEach((element) => {
    const id = element.getAttribute('id');
    if (!id) return;
    const nextId = `${prefix}-${id}`;
    idMap.set(id, nextId);
    element.setAttribute('id', nextId);
  });

  idMap.forEach((nextId, id) => {
    const escapedId = cssEscapeValue(id);
    svgEl.querySelectorAll(`[href="#${escapedId}"], [xlink\\:href="#${escapedId}"]`).forEach((element) => {
      element.setAttribute('href', `#${nextId}`);
      element.setAttribute('xlink:href', `#${nextId}`);
    });

    svgEl.querySelectorAll<HTMLElement>('[clip-path], [fill], [filter], [mask], [stroke]').forEach((element) => {
      ['clip-path', 'fill', 'filter', 'mask', 'stroke'].forEach((attr) => {
        const value = element.getAttribute(attr);
        if (value?.includes(`url(#${id})`)) {
          element.setAttribute(attr, value.split(`url(#${id})`).join(`url(#${nextId})`));
        }
      });
    });
  });

  return new XMLSerializer().serializeToString(svgEl);
}

/**
 * Replace `<span data-type="chem-structure" data-structure-id="...">` nodes
 * with their preview SVG from the embeds manifest (for read-only display).
 */
export function hydrateChemStructuresInHtml(html: string, embeds?: EditorEmbeds): string {
  if (!html || !html.includes('chem-structure')) return html;
  if (!embeds?.chem_structures || !Object.keys(embeds.chem_structures).length) {
    return html;
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const nodes = Array.from(
    doc.querySelectorAll<HTMLElement>('[data-type="chem-structure"][data-structure-id]'),
  );

  nodes.forEach((node) => {
    const id = node.getAttribute('data-structure-id') ?? '';
    const embed = getChemStructureEmbed(embeds, id);
    const replacement = doc.createElement('span');
    replacement.className = 'chem-structure-preview';
    replacement.setAttribute('data-type', 'chem-structure');
    replacement.setAttribute('data-structure-id', id);

    const previewSvg = embed?.previewSvg ?? embed?.preview_svg;
    if (previewSvg) {
      replacement.innerHTML = namespaceChemPreviewSvg(previewSvg, id);
    } else {
      replacement.textContent = PLACEHOLDER_LABEL;
      replacement.classList.add('chem-structure-preview--missing');
    }

    node.replaceWith(replacement);
  });

  return doc.body.innerHTML;
}

const BASE_ALLOWED_TAGS = [
  'p', 'div', 'span', 'br', 'strong', 'em', 'u', 'b', 'i', 'img',
  'table', 'caption', 'colgroup', 'col', 'tbody', 'tr', 'td', 'th', 'thead',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li', 'ul', 'ol',
] as const;

const BASE_ALLOWED_ATTR = [
  'src', 'alt', 'style', 'class', 'data-type', 'data-latex', 'data-structure-id', 'data-embed-id',
  'data-graph-embed-id', 'data-graph-mode',
  'width', 'height', 'border', 'cellpadding', 'cellspacing', 'colspan', 'rowspan',
  'align', 'valign', 'srcset', 'sizes', 'loading', 'decoding', 'referrerpolicy',
] as const;

/** DOMPurify allowlist additions for chem-structure preview rendering. */
export const CHEM_STRUCTURE_ALLOWED_TAGS = [
  'svg',
  'g',
  'path',
  'rect',
  'circle',
  'ellipse',
  'line',
  'polyline',
  'polygon',
  'text',
  'tspan',
  'defs',
  'clipPath',
  'use',
  'image',
  'foreignObject',
] as const;

export const CHEM_STRUCTURE_ALLOWED_ATTR = [
  'data-structure-id',
  'viewBox',
  'xmlns',
  'fill',
  'stroke',
  'stroke-width',
  'stroke-linecap',
  'stroke-linejoin',
  'd',
  'class',
  'data-type',
  'x',
  'y',
  'x1',
  'y1',
  'x2',
  'y2',
  'cx',
  'cy',
  'r',
  'rx',
  'ry',
  'width',
  'height',
  'transform',
  'opacity',
  'font-size',
  'font-family',
  'text-anchor',
  'points',
  'clip-path',
  'id',
  'href',
  'xlink:href',
  'xmlns:xlink',
  'fill-opacity',
  'stroke-opacity',
  'stroke-miterlimit',
] as const;

/** DOMPurify options that allow hydrated chem-structure SVG previews. */
export function chemAwareSanitizeConfig() {
  return {
    ALLOWED_TAGS: [...BASE_ALLOWED_TAGS, ...CHEM_STRUCTURE_ALLOWED_TAGS],
    ALLOWED_ATTR: [...BASE_ALLOWED_ATTR, ...CHEM_STRUCTURE_ALLOWED_ATTR],
    ALLOW_DATA_ATTR: false,
  };
}

/** Hydrate chem-structure spans from embeds before sanitization/rendering. */
export function prepareChemAwareHtml(html: string, embeds?: EditorEmbeds | null): string {
  const withChem = hydrateChemStructuresInHtml(html, embeds ?? undefined);
  return hydrateGraphsInHtml(withChem, embeds ?? undefined);
}
