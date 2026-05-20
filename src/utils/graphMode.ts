import type { GraphEmbed, GraphMode } from '../types/embeds';

/** Canonical graph mode (unified display). */
export type CanonicalGraphMode = 'display';

/** Map legacy modes (including answer-input) to unified display. */
export function normalizeGraphMode(mode: GraphMode | undefined): CanonicalGraphMode {
  return 'display';
}

export function graphHasSliders(embed: GraphEmbed): boolean {
  return (embed.objects ?? []).some((o) => o.type === 'slider');
}

/** Sliders enable pan/zoom for students exploring parameters. */
export function isDisplayInteractive(embed: GraphEmbed): boolean {
  return normalizeGraphMode(embed.mode) === 'display' && graphHasSliders(embed);
}

export function graphModeLabel(embed: GraphEmbed): string {
  return graphHasSliders(embed) ? 'display (interactive)' : 'display';
}
