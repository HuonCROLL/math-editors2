import type { GraphEndpointMarker, GraphExpression } from '../types/embeds';
import { graphMathToJs } from './graphExpression';
import type { JxgBoard } from './graphBoard';

type SliderMap = Map<string, { Value: () => number }>;

export function evaluateExpressionAt(
  body: string,
  x: number,
  sliders: SliderMap,
): number | null {
  const js = graphMathToJs(body);
  const scope: Record<string, number> = { x };
  sliders.forEach((slider, name) => {
    const v = slider.Value();
    scope[name] = Number.isFinite(v) ? v : 0;
  });
  const argNames = Object.keys(scope);
  const argValues = argNames.map((k) => scope[k]);
  try {
    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    const fn = new Function(...argNames, `return (${js});`);
    const result = fn(...argValues);
    return typeof result === 'number' && Number.isFinite(result) ? result : null;
  } catch {
    return null;
  }
}

function getExpressionDomain(
  board: JxgBoard,
  expr: GraphExpression,
): { min: number; max: number } {
  const bb = board.getBoundingBox();
  const viewMin = bb[0];
  const viewMax = bb[2];
  let min = expr.domainMin ?? viewMin;
  let max = expr.domainMax ?? viewMax;
  if (min > max) [min, max] = [max, min];
  min = Math.max(viewMin, min);
  max = Math.min(viewMax, max);
  return { min, max };
}

function createEndpointMarker(
  board: JxgBoard,
  x: number,
  y: number,
  kind: GraphEndpointMarker,
  color: string,
  body: string,
  sliders: SliderMap,
  towardPositive: boolean,
) {
  if (kind === 'none') return;

  if (kind === 'filled') {
    board.create('point', [x, y], {
      size: 4,
      strokeColor: color,
      fillColor: color,
      fixed: true,
      withLabel: false,
    });
    return;
  }

  if (kind === 'hollow') {
    board.create('point', [x, y], {
      size: 4,
      strokeColor: color,
      fillColor: '#ffffff',
      fillOpacity: 0,
      strokeWidth: 2,
      fixed: true,
      withLabel: false,
    });
    return;
  }

  const bb = board.getBoundingBox();
  const span = Math.max((bb[2] - bb[0]) / 24, (bb[1] - bb[3]) / 24, 0.35);
  const yBefore = evaluateExpressionAt(body, x - span * 0.15, sliders);
  const yAfter = evaluateExpressionAt(body, x + span * 0.15, sliders);
  const slope =
    yBefore !== null && yAfter !== null ? (yAfter - yBefore) / (span * 0.3) : 0;
  // Tail should be inside the plotted domain so we don't draw a dangling
  // segment outside the curve endpoint.
  const dirInside = towardPositive ? 1 : -1;
  const xTail = x + dirInside * span;
  const yTail = y + slope * dirInside * span;
  board.create('segment', [
    [xTail, yTail],
    [x, y],
  ], {
    strokeColor: color,
    strokeWidth: 2,
    lastArrow: { type: 2, size: 8 },
    fixed: true,
    withLabel: false,
  });
}

/** Draw start/end markers for a function graph over its domain. */
export function renderFunctionMarkers(
  board: JxgBoard,
  expr: GraphExpression,
  body: string,
  sliders: SliderMap,
  color: string,
) {
  const startKind = expr.startMarker ?? 'none';
  const endKind = expr.endMarker ?? 'none';
  if (startKind === 'none' && endKind === 'none') return;

  const { min, max } = getExpressionDomain(board, expr);
  if (startKind !== 'none') {
    const y = evaluateExpressionAt(body, min, sliders);
    if (y !== null) {
      createEndpointMarker(board, min, y, startKind, color, body, sliders, true);
    }
  }
  if (endKind !== 'none') {
    const y = evaluateExpressionAt(body, max, sliders);
    if (y !== null) {
      createEndpointMarker(board, max, y, endKind, color, body, sliders, false);
    }
  }
}
