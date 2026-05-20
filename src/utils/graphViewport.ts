import type { GraphEmbed, GraphOptions, GraphScaleRatio, GraphViewport } from '../types/embeds';

export const GRAPH_DISPLAY_MIN_WIDTH = 200;
export const GRAPH_DISPLAY_MAX_WIDTH = 960;
export const GRAPH_DISPLAY_MIN_HEIGHT = 120;
export const GRAPH_DISPLAY_MAX_HEIGHT = 800;
export const GRAPH_DISPLAY_BASE_WIDTH = 400;

const DEFAULT_VIEWPORT: GraphViewport = {
  xMin: -10,
  xMax: 10,
  yMin: -10,
  yMax: 10,
};

/** Ensure viewport numbers are finite and min < max. */
export function normalizeViewport(viewport?: Partial<GraphViewport> | null): GraphViewport {
  const xMin = finiteOr(viewport?.xMin, DEFAULT_VIEWPORT.xMin);
  const xMax = finiteOr(viewport?.xMax, DEFAULT_VIEWPORT.xMax);
  const yMin = finiteOr(viewport?.yMin, DEFAULT_VIEWPORT.yMin);
  const yMax = finiteOr(viewport?.yMax, DEFAULT_VIEWPORT.yMax);

  return {
    xMin: xMin < xMax ? xMin : xMax - 1,
    xMax: xMax > xMin ? xMax : xMin + 1,
    yMin: yMin < yMax ? yMin : yMax - 1,
    yMax: yMax > yMin ? yMax : yMin + 1,
  };
}

function finiteOr(value: unknown, fallback: number): number {
  const n = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(n) ? n : fallback;
}

/** Parse a viewport text field; empty or lone '-' keeps the previous value. */
export function parseViewportField(raw: string, previous: number): number {
  const trimmed = raw.trim();
  if (trimmed === '' || trimmed === '-') return previous;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : previous;
}

export function viewportFieldsFromEmbed(viewport: GraphViewport): Record<keyof GraphViewport, string> {
  return {
    xMin: String(viewport.xMin),
    xMax: String(viewport.xMax),
    yMin: String(viewport.yMin),
    yMax: String(viewport.yMax),
  };
}

/** Build a normalized viewport from draft text fields. */
export function viewportFromFields(
  fields: Record<keyof GraphViewport, string>,
  fallback?: GraphViewport,
): GraphViewport {
  const base = normalizeViewport(fallback);
  return normalizeViewport({
    xMin: parseViewportField(fields.xMin, base.xMin),
    xMax: parseViewportField(fields.xMax, base.xMax),
    yMin: parseViewportField(fields.yMin, base.yMin),
    yMax: parseViewportField(fields.yMax, base.yMax),
  });
}

/** Resolve scale ratio from options; null means stretch to the container. */
export function resolveScaleRatio(options: GraphOptions = {}): GraphScaleRatio | null {
  if (options.stretchToFit) return null;
  if (options.scaleRatio) {
    const { x, y } = options.scaleRatio;
    if (x > 0 && y > 0 && Number.isFinite(x) && Number.isFinite(y)) {
      return { x, y };
    }
  }
  if (options.equalScale === false) return null;
  return { x: 1, y: 1 };
}

/**
 * Expand the visible viewport so axis units match the container aspect ratio and x:y scale.
 * The stored viewport bounds are unchanged; this only affects rendering.
 */
export function viewportForContainer(
  viewport: GraphViewport,
  width: number,
  height: number,
  scaleRatio: GraphScaleRatio | null,
): GraphViewport {
  const v = normalizeViewport(viewport);
  if (!scaleRatio || width < 2 || height < 2) return v;

  const xSpan = v.xMax - v.xMin;
  const ySpan = v.yMax - v.yMin;
  const xCenter = (v.xMin + v.xMax) / 2;
  const yCenter = (v.yMin + v.yMax) / 2;

  const targetXOverY = (width * scaleRatio.y) / (height * scaleRatio.x);
  const currentXOverY = xSpan / ySpan;

  if (currentXOverY > targetXOverY) {
    const newYSpan = xSpan / targetXOverY;
    return normalizeViewport({
      xMin: v.xMin,
      xMax: v.xMax,
      yMin: yCenter - newYSpan / 2,
      yMax: yCenter + newYSpan / 2,
    });
  }

  const newXSpan = ySpan * targetXOverY;
  return normalizeViewport({
    xMin: xCenter - newXSpan / 2,
    xMax: xCenter + newXSpan / 2,
    yMin: v.yMin,
    yMax: v.yMax,
  });
}

function clampDisplayWidth(width: number): number {
  return Math.min(
    GRAPH_DISPLAY_MAX_WIDTH,
    Math.max(GRAPH_DISPLAY_MIN_WIDTH, Math.round(width)),
  );
}

function clampDisplayHeight(height: number): number {
  return Math.min(
    GRAPH_DISPLAY_MAX_HEIGHT,
    Math.max(GRAPH_DISPLAY_MIN_HEIGHT, Math.round(height)),
  );
}

/**
 * Pixel size so on-screen units match the viewport spans and x:y scale ratio.
 * width / height = (xSpan * ratioY) / (ySpan * ratioX) when a scale ratio is set.
 */
export function computeGraphDisplaySize(
  viewport: GraphViewport,
  options: GraphOptions = {},
  baseWidth = GRAPH_DISPLAY_BASE_WIDTH,
): { width: number; height: number } {
  const v = normalizeViewport(viewport);
  const xSpan = v.xMax - v.xMin;
  const ySpan = v.yMax - v.yMin;

  let width = baseWidth;
  let height: number;

  if (options.stretchToFit || !resolveScaleRatio(options)) {
    height = (width * ySpan) / xSpan;
  } else {
    const ratio = resolveScaleRatio(options)!;
    height = (width * ySpan * ratio.x) / (xSpan * ratio.y);
  }

  const scaleDown = Math.min(
    1,
    GRAPH_DISPLAY_MAX_WIDTH / width,
    GRAPH_DISPLAY_MAX_HEIGHT / height,
  );
  if (scaleDown < 1) {
    width *= scaleDown;
    height *= scaleDown;
  }

  return { width: clampDisplayWidth(width), height: clampDisplayHeight(height) };
}

/** Resolved plot size for an embed (auto from viewport or manual override). */
export function resolveGraphDisplaySize(embed: GraphEmbed): { width: number; height: number } {
  if (
    embed.autoDisplaySize === false &&
    embed.displayWidth &&
    embed.displayWidth > 0 &&
    embed.displayHeight &&
    embed.displayHeight > 0
  ) {
    return {
      width: clampDisplayWidth(embed.displayWidth),
      height: clampDisplayHeight(embed.displayHeight),
    };
  }

  return computeGraphDisplaySize(
    embed.viewport,
    embed.options ?? {},
    embed.displayWidth && embed.displayWidth > 0
      ? embed.displayWidth
      : GRAPH_DISPLAY_BASE_WIDTH,
  );
}

/** Apply auto display dimensions when auto sizing is enabled. */
export function withAutoDisplaySize(
  embed: GraphEmbed,
  viewport?: GraphViewport,
): GraphEmbed {
  if (embed.autoDisplaySize === false) return embed;
  const size = computeGraphDisplaySize(
    viewport ?? embed.viewport,
    embed.options ?? {},
    embed.displayWidth && embed.displayWidth > 0
      ? embed.displayWidth
      : GRAPH_DISPLAY_BASE_WIDTH,
  );
  return { ...embed, displayWidth: size.width, displayHeight: size.height };
}
