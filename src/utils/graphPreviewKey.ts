import type { GraphEmbed } from '../types/embeds';
import { normalizeViewport } from './graphViewport';

/** Stable key so graph previews remount when embed definition changes. */
export function graphPreviewKey(embed: GraphEmbed): string {
  return JSON.stringify({
    mode: embed.mode,
    viewport: normalizeViewport(embed.viewport),
    displayHeight: embed.displayHeight,
    displayWidth: embed.displayWidth,
    autoDisplaySize: embed.autoDisplaySize,
    options: embed.options,
    tools: embed.tools,
    expressions: embed.expressions,
    objects: embed.objects,
  });
}
