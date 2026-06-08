import type {
  GraphEmbed,
  GraphExpression,
  GraphObject,
  GraphOptions,
  GraphSliderObject,
  GraphViewport,
} from '../types/embeds';
import { loadJsxGraph } from './jsxGraphLoader';
import { graphMathToJs, parseGraphExpression } from './graphExpression';
import {
  collectGraphImplicitMulIdentifiers,
  formatGraphOriginLabelLatex,
  insertImplicitMultiplicationForEvaluation,
} from './graphEquationLabelFormatting';
import { renderFunctionMarkers } from './graphExpressionMarkers';
import { isDisplayInteractive } from './graphMode';
import {
  normalizeViewport,
  resolveScaleRatio,
  viewportForContainer,
} from './graphViewport';

export type JxgBoard = import('jsxgraph').Board;
type JxgSlider = {
  Value: () => number;
};

const DEFAULT_VIEWPORT = normalizeViewport();

/** Convert LaTeX-style math to a JessieCode expression in x (keeps slider names). */
export function latexToJessie(latex: string): string {
  let s = latex.trim();
  s = s.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1)/($2)');
  s = s.replace(/\\cdot/g, '*');
  s = s.replace(/\\times/g, '*');
  s = s.replace(/\\left|\\right/g, '');
  s = s.replace(/\\sqrt\{([^}]+)\}/g, 'sqrt($1)');
  s = s.replace(/\\pi/g, 'pi');
  const eqMatch = s.match(/^(?:y|f\s*\(\s*x\s*\))\s*=\s*(.+)$/i);
  if (eqMatch) s = eqMatch[1];
  return s.trim();
}

/** JSXGraph boundingbox: [xMin, yMax, xMax, yMin] */
export function getBoardBoundingBox(viewport: GraphViewport = DEFAULT_VIEWPORT): [number, number, number, number] {
  const v = normalizeViewport(viewport);
  return [v.xMin, v.yMax, v.xMax, v.yMin];
}

export type CreateGraphBoardOptions = {
  container: HTMLElement;
  embed: GraphEmbed;
  interactive?: boolean;
  width?: number;
  height?: number;
  onBoardReady?: (board: JxgBoard) => void;
};

/** Fit the board bounding box to the container using the embed scale ratio. */
export function syncBoardViewport(
  board: JxgBoard,
  embed: GraphEmbed,
  width: number,
  height: number,
): void {
  if (width < 2 || height < 2) return;
  const viewport = viewportForContainer(
    normalizeViewport(embed.viewport),
    width,
    height,
    resolveScaleRatio(embed.options ?? {}),
  );
  board.setBoundingBox(getBoardBoundingBox(viewport), false);
}

function applyAxisLabels(board: JxgBoard, options: GraphOptions) {
  if (options.showAxes === false) return;
  const axes = board.defaultAxes;
  if (!axes?.x || !axes?.y) return;

  const xLabel = options.xAxisLabel?.trim() || 'x';
  const yLabel = options.yAxisLabel?.trim() || 'y';

  try {
    axes.x.setAttribute({ name: xLabel, withLabel: true });
    axes.y.setAttribute({ name: yLabel, withLabel: true });
  } catch {
    // axis labels are optional
  }
}

/** Create a JSXGraph board from a graph embed definition. */
export async function createGraphBoard({
  container,
  embed,
  interactive,
  width,
  height,
  onBoardReady,
}: CreateGraphBoardOptions): Promise<JxgBoard> {
  const JXG = await loadJsxGraph();
  const viewport = normalizeViewport(embed.viewport);
  const options: GraphOptions = embed.options ?? {};
  const isInteractive = interactive ?? isDisplayInteractive(embed);
  const allowViewManip = isInteractive && !options.locked;

  const w = width ?? container.clientWidth;
  const h = height ?? container.clientHeight;
  const displayViewport =
    w >= 2 && h >= 2
      ? viewportForContainer(viewport, w, h, resolveScaleRatio(options))
      : viewport;

  // JSXGraph axis ticks default to majorHeight: -1 (full-board span), which looks like a
  // grid even when our separate `grid` element is off. Keep ticks short on the axes; the
  // optional `grid` element below draws background lines when showGrid is enabled.
  const axisTickHeight = 8;
  const board = JXG.JSXGraph.initBoard(container, {
    boundingbox: getBoardBoundingBox(displayViewport),
    axis: options.showAxes !== false,
    grid: false,
    defaultAxes: {
      x: {
        ticks: {
          majorHeight: axisTickHeight,
          insertTicks: true,
          drawLabels: true,
        },
      },
      y: {
        ticks: {
          majorHeight: axisTickHeight,
          insertTicks: true,
          drawLabels: true,
        },
      },
    },
    showNavigation: false,
    showCopyright: false,
    keepaspectratio: false,
    pan: { enabled: allowViewManip },
    zoom: { enabled: allowViewManip },
    // Answer-input boards need element drag for moving placed points/line endpoints.
    drag: { enabled: true },
  });

  try {
    board.removeGrids();
  } catch {
    // no-op if grid subsystem is not initialized yet
  }

  if (options.showGrid === true) {
    const stepRaw = Number(options.gridStep);
    const step = Number.isFinite(stepRaw) && stepRaw > 0 ? stepRaw : 1;
    board.create('grid', [], { majorStep: [step, step] });
  }

  applyAxisLabels(board, options);

  const sliders = renderGraphObjects(board, embed.objects ?? [], viewport, options);
  renderGraphExpressions(board, embed, embed.expressions ?? [], sliders, options);

  board.update();
  onBoardReady?.(board);
  return board;
}

function graphLabelsEnabled(options: GraphOptions): boolean {
  return options.showLabels !== false;
}

function expressionGraphAttrs(expr: GraphExpression): Record<string, unknown> {
  return {
    strokeColor: expr.color ?? '#2563eb',
    strokeWidth: 2,
  };
}

/** Place the equation label at the coordinate origin. */
function renderExpressionOriginLabel(board: JxgBoard, expr: GraphExpression, embed: GraphEmbed) {
  const options = embed.options ?? {};
  const raw = expr.label?.trim();
  if (!graphLabelsEnabled(options) || !raw) return;
  const text = formatGraphOriginLabelLatex(raw, embed);
  board.create('text', [0, 0, text], {
    fontSize: 14,
    anchorX: 'left',
    anchorY: 'bottom',
  });
}

function renderGraphExpressions(
  board: JxgBoard,
  embed: GraphEmbed,
  expressions: GraphExpression[],
  sliders: Map<string, JxgSlider>,
  options: GraphOptions,
) {
  const hasSliders = sliders.size > 0;
  const { independentAxisLabel, sliderIds } = collectGraphImplicitMulIdentifiers(
    options,
    embed.objects ?? [],
  );

  expressions.forEach((expr) => {
    if (expr.visible === false) return;
    const parsed = parseGraphExpression(expr.latex);
    if (!parsed) return;

    const attrs = expressionGraphAttrs(expr);

    try {
      if (parsed.kind === 'relation') {
        board.create('implicitcurve', [parsed.implicit], attrs);
        renderExpressionOriginLabel(board, expr, embed);
        return;
      }

      const body = insertImplicitMultiplicationForEvaluation(
        parsed.body,
        independentAxisLabel,
        sliderIds,
      );
      const hasDomain =
        expr.domainMin !== undefined || expr.domainMax !== undefined;
      // A missing bound is treated as an implicit infinity, plotted to the
      // visible edge of the board (−∞ for min, +∞ for max).
      let xMin = expr.domainMin;
      let xMax = expr.domainMax;
      if (hasDomain) {
        const bb = board.getBoundingBox();
        if (xMin === undefined) xMin = bb[0];
        if (xMax === undefined) xMax = bb[2];
      }

      if (hasSliders) {
        const args: (string | number)[] = [body];
        if (hasDomain && xMin !== undefined && xMax !== undefined) {
          args.push(xMin, xMax);
        }
        board.create('functiongraph', args, attrs);
      } else {
        const fn = (x: number) => evaluateExpressionJs(body, x, sliders);
        const args: unknown[] = [fn];
        if (hasDomain && xMin !== undefined && xMax !== undefined) {
          args.push(xMin, xMax);
        }
        board.create('functiongraph', args as [typeof fn, number?, number?], attrs);
      }

      renderFunctionMarkers(board, expr, body, sliders, attrs.strokeColor as string);
      renderExpressionOriginLabel(board, expr, embed);
    } catch {
      if (parsed.kind === 'relation') return;
      try {
        const body = insertImplicitMultiplicationForEvaluation(
          parsed.body,
          independentAxisLabel,
          sliderIds,
        );
        const fn = (x: number) => evaluateExpressionJs(body, x, sliders);
        board.create('functiongraph', [fn], attrs);
        renderFunctionMarkers(board, expr, body, sliders, attrs.strokeColor as string);
        renderExpressionOriginLabel(board, expr, embed);
      } catch {
        // skip invalid expressions
      }
    }
  });
}

function evaluateExpressionJs(
  expression: string,
  x: number,
  sliders: Map<string, JxgSlider>,
): number {
  const js = graphMathToJs(expression);
  const scope: Record<string, number> = { x };
  sliders.forEach((slider, name) => {
    const v = slider.Value();
    scope[name] = Number.isFinite(v) ? v : 0;
  });
  const argNames = Object.keys(scope);
  const argValues = argNames.map((k) => scope[k]);
  // eslint-disable-next-line @typescript-eslint/no-implied-eval
  const fn = new Function(...argNames, `return (${js});`);
  const result = fn(...argValues);
  return typeof result === 'number' && Number.isFinite(result) ? result : NaN;
}

function renderGraphObjects(
  board: JxgBoard,
  objects: GraphObject[],
  viewport: GraphViewport,
  options: GraphOptions,
): Map<string, JxgSlider> {
  const sliders = new Map<string, JxgSlider>();

  let sliderIndex = 0;
  for (const obj of objects) {
    if (obj.type !== 'slider') continue;
    const slider = createSlider(board, obj, viewport, sliderIndex);
    sliderIndex += 1;
    const varName = (obj.bindsTo?.trim() || obj.name?.trim() || 'a');
    sliders.set(varName, slider);
    if (obj.name && obj.name !== varName) sliders.set(obj.name.trim(), slider);
  }

  for (const obj of objects) {
    if (obj.type === 'slider') continue;
    renderSingleObject(board, obj, options);
  }

  return sliders;
}

function createSlider(
  board: JxgBoard,
  obj: GraphSliderObject,
  viewport: GraphViewport,
  index: number,
): JxgSlider {
  const name = (obj.bindsTo?.trim() || obj.name?.trim() || 'a');
  const min = Number(obj.min);
  const max = Number(obj.max);
  const lo = Number.isFinite(min) && Number.isFinite(max) ? Math.min(min, max) : -5;
  const hi = Number.isFinite(min) && Number.isFinite(max) ? Math.max(min, max) : 5;
  const isInteger = !!obj.integer;
  const loVal = isInteger ? Math.round(lo) : lo;
  const hiVal = isInteger ? Math.round(hi) : hi;
  const initialRaw = Number(obj.initial);
  let initial = Number.isFinite(initialRaw)
    ? Math.min(hiVal, Math.max(loVal, initialRaw))
    : loVal;
  if (isInteger) initial = Math.round(initial);

  const y = viewport.yMax - 2 - index * 1.5;
  const x1 = viewport.xMin + 1;
  const x2 = viewport.xMin + 4;

  const snapWidth = isInteger ? 1 : (obj.step ?? 0.1);

  // JSXGraph slider range is [min, initial, max] — not [min, max].
  return board.create(
    'slider',
    [
      [x1, y],
      [x2, y],
      [loVal, initial, hiVal],
    ],
    {
      name,
      snapWidth,
      precision: isInteger ? 0 : 2,
      withLabel: true,
      face: 'o',
      baseline: {
        strokeWidth: 1,
      },
      label: {
        offset: [0, 12],
      },
    },
  ) as JxgSlider;
}

function renderSingleObject(board: JxgBoard, obj: GraphObject, options: GraphOptions) {
  const showLabels = graphLabelsEnabled(options);

  switch (obj.type) {
    case 'point': {
      const pointLabel = obj.label?.trim() ?? '';
      board.create('point', [obj.x, obj.y], {
        name: pointLabel,
        withLabel: showLabels && pointLabel.length > 0,
        size: 3,
        strokeColor: obj.color ?? '#dc2626',
        fillColor: obj.color ?? '#dc2626',
      });
      break;
    }
    case 'line':
      board.create('segment', [obj.start, obj.end], {
        strokeColor: obj.color ?? '#2563eb',
        strokeWidth: 2,
      });
      break;
    case 'curve': {
      const pts = obj.controlPoints;
      if (pts.length < 2) break;
      const color = obj.color ?? '#16a34a';
      const stroke = { strokeColor: color, strokeWidth: 2 };
      if (obj.interpolation === 'linear') {
        board.create('curve', [pts.map((p) => p[0]), pts.map((p) => p[1])], stroke);
      } else {
        // cardinalspline parents: [control points, tension tau]
        board.create('cardinalspline', [pts, 0.5, 'centripetal'], stroke);
      }
      break;
    }
    case 'label':
      if (!showLabels) break;
      board.create('text', [obj.x, obj.y, obj.text], { fontSize: 14 });
      break;
    case 'asymptote':
      if (obj.orientation === 'vertical') {
        board.create('line', [[obj.value, 0], [obj.value, 1]], {
          strokeColor: obj.color ?? '#6b7280',
          dash: 2,
          straightFirst: true,
          straightLast: true,
        });
      } else {
        board.create('line', [[0, obj.value], [1, obj.value]], {
          strokeColor: obj.color ?? '#6b7280',
          dash: 2,
          straightFirst: true,
          straightLast: true,
        });
      }
      break;
    case 'shaded-region':
      try {
        const ineq = obj.inequality.replace(/\s+/g, '');
        if (ineq.includes('x>')) {
          const val = parseFloat(ineq.split('x>')[1]);
          board.create('inequality', [`x > ${val}`], {
            fillColor: obj.color ?? '#93c5fd',
            fillOpacity: 0.3,
          });
        } else if (ineq.includes('x<')) {
          const val = parseFloat(ineq.split('x<')[1]);
          board.create('inequality', [`x < ${val}`], {
            fillColor: obj.color ?? '#93c5fd',
            fillOpacity: 0.3,
          });
        }
      } catch {
        // skip
      }
      break;
    default:
      break;
  }
}

export async function destroyBoard(board: JxgBoard | null | undefined) {
  if (!board) return;
  try {
    const JXG = await loadJsxGraph();
    JXG.JSXGraph.freeBoard(board);
  } catch {
    // board may already be freed
  }
}
