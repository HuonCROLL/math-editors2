import React, { useMemo } from 'react';
import type { GraphEmbed } from '../types/embeds';
import { isDisplayInteractive } from '../utils/graphMode';
import { normalizeViewport } from '../utils/graphViewport';
import { graphPreviewKey } from '../utils/graphPreviewKey';
import GraphRenderer from './GraphRenderer';

export { graphPreviewKey };

export type GraphPreviewProps = {
  embed: GraphEmbed;
  height?: number | string;
  width?: number | string;
};

/** Renders a graph embed preview. */
const GraphPreview: React.FC<GraphPreviewProps> = ({
  embed,
  height = 280,
  width,
}) => {
  const normalized = useMemo(
    () => ({
      ...embed,
      mode: 'display' as const,
      viewport: normalizeViewport(embed.viewport),
    }),
    [embed],
  );

  return (
    <GraphRenderer
      embed={normalized}
      interactive={isDisplayInteractive(normalized)}
      height={height}
      width={width}
    />
  );
};

export default GraphPreview;
