import type { ChemStructureEmbed, EditorEmbeds, GraphEmbed } from '../types/embeds';

const CHEM_STRUCTURE_ID_RE = /data-structure-id=["']([^"']+)["']/gi;
const GRAPH_EMBED_ID_RE = /data-type=["']graph["'][^>]*data-embed-id=["']([^"']+)["']|data-embed-id=["']([^"']+)["'][^>]*data-type=["']graph["']/gi;

/** Collect all chem-structure ids referenced in one or more HTML strings. */
export function collectChemStructureIds(...htmlFields: string[]): Set<string> {
  const ids = new Set<string>();
  for (const html of htmlFields) {
    if (!html) continue;
    let match: RegExpExecArray | null;
    const re = new RegExp(CHEM_STRUCTURE_ID_RE.source, 'gi');
    while ((match = re.exec(html)) !== null) {
      ids.add(match[1]);
    }
  }
  return ids;
}

/** Insert or replace a chem structure entry in the embeds manifest. */
export function upsertChemStructure(
  embeds: EditorEmbeds,
  structureId: string,
  embed: ChemStructureEmbed,
): EditorEmbeds {
  return {
    ...embeds,
    chem_structures: {
      ...(embeds.chem_structures ?? {}),
      [structureId]: embed,
    },
  };
}

/** Remove a chem structure entry from the embeds manifest. */
export function removeChemStructure(embeds: EditorEmbeds, structureId: string): EditorEmbeds {
  const next = { ...(embeds.chem_structures ?? {}) };
  delete next[structureId];
  return {
    ...embeds,
    chem_structures: Object.keys(next).length ? next : undefined,
  };
}

/** Drop chem_structures entries not referenced in any provided HTML field. */
export function pruneUnusedChemStructures(
  embeds: EditorEmbeds,
  ...htmlFields: string[]
): EditorEmbeds {
  const used = collectChemStructureIds(...htmlFields);
  const chem = embeds.chem_structures;
  if (!chem) return embeds;

  const next: Record<string, ChemStructureEmbed> = {};
  for (const id of used) {
    if (chem[id]) next[id] = chem[id];
  }

  return {
    ...embeds,
    chem_structures: Object.keys(next).length ? next : undefined,
  };
}

/** Look up a chem structure embed by id. */
export function getChemStructureEmbed(
  embeds: EditorEmbeds | undefined,
  structureId: string,
): ChemStructureEmbed | undefined {
  return embeds?.chem_structures?.[structureId];
}

/** Collect all graph embed ids referenced in one or more HTML strings. */
export function collectGraphEmbedIds(...htmlFields: string[]): Set<string> {
  const ids = new Set<string>();
  for (const html of htmlFields) {
    if (!html) continue;
    let match: RegExpExecArray | null;
    const re = new RegExp(GRAPH_EMBED_ID_RE.source, 'gi');
    while ((match = re.exec(html)) !== null) {
      const id = match[1] ?? match[2];
      if (id) ids.add(id);
    }
  }
  return ids;
}

/** Insert or replace a graph entry in the embeds manifest. */
export function upsertGraphEmbed(
  embeds: EditorEmbeds,
  embedId: string,
  embed: GraphEmbed,
): EditorEmbeds {
  return {
    ...embeds,
    graphs: {
      ...(embeds.graphs ?? {}),
      [embedId]: embed,
    },
  };
}

/** Remove a graph entry from the embeds manifest. */
export function removeGraphEmbed(embeds: EditorEmbeds, embedId: string): EditorEmbeds {
  const next = { ...(embeds.graphs ?? {}) };
  delete next[embedId];
  return {
    ...embeds,
    graphs: Object.keys(next).length ? next : undefined,
  };
}

/** Drop graph entries not referenced in any provided HTML field. */
export function pruneUnusedGraphs(embeds: EditorEmbeds, ...htmlFields: string[]): EditorEmbeds {
  const used = collectGraphEmbedIds(...htmlFields);
  const graphs = embeds.graphs;
  if (!graphs) return embeds;

  const next: Record<string, GraphEmbed> = {};
  for (const id of used) {
    if (graphs[id]) next[id] = graphs[id];
  }

  return {
    ...embeds,
    graphs: Object.keys(next).length ? next : undefined,
  };
}

/** Look up a graph embed by id. */
export function getGraphEmbed(
  embeds: EditorEmbeds | undefined,
  embedId: string,
): GraphEmbed | undefined {
  return embeds?.graphs?.[embedId];
}
