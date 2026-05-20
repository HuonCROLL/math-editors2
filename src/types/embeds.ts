/** Source format for a stored chemical structure (Ketcher JSON). */
export type ChemStructureSourceFormat = 'ket';
export type ChemStructureMode = 'structure' | 'teaching-diagram';
export type ChemStructureRepresentation = 'skeletal' | 'full';

/** A single chemical structure stored in the embeds manifest. */
export interface ChemStructureEmbed {
  type?: 'chemical-structure';
  mode?: ChemStructureMode;
  sourceFormat: ChemStructureSourceFormat;
  sourceValue: string;
  smiles: string;
  previewSvg: string;
  editable_format?: ChemStructureSourceFormat;
  editable_data?: string;
  preview_svg?: string;
  representation?: ChemStructureRepresentation;
}

/**
 * Graph modes. Use `display` (equations, objects, optional sliders).
 * `answer-input`, `static-display`, and `interactive-display` are legacy and normalized to `display`.
 */
export type GraphMode =
  | 'display'
  | 'answer-input'
  | 'static-display'
  | 'interactive-display';

/** Endpoint decoration for plotted curves (y = f(x) with optional domain). */
export type GraphEndpointMarker = 'none' | 'filled' | 'hollow' | 'arrow';

export type GraphRenderer = 'jsxgraph';

export type GraphTool = 'point' | 'line' | 'curve' | 'eraser' | 'undo' | 'reset';

export interface GraphViewport {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
}

export interface GraphScaleRatio {
  x: number;
  y: number;
}

export interface GraphOptions {
  showAxes?: boolean;
  showGrid?: boolean;
  /** Major grid spacing in board units when grid is shown. */
  gridStep?: number;
  /** Stretch axes to fill the graph area (ignore scale ratio). */
  stretchToFit?: boolean;
  /** Screen scale for axis units as x : y (default 1 : 1). */
  scaleRatio?: GraphScaleRatio;
  /** @deprecated Use scaleRatio or stretchToFit. */
  equalScale?: boolean;
  snapToGrid?: boolean;
  interactive?: boolean;
  locked?: boolean;
  /** Label shown on the horizontal axis (defaults to "x"). */
  xAxisLabel?: string;
  /** Label shown on the vertical axis (defaults to "y"). */
  yAxisLabel?: string;
  /** Show labels on points, equations, and text objects (default on). */
  showLabels?: boolean;
}

export interface GraphExpression {
  id: string;
  latex: string;
  /** Label shown on the graph when labelling is enabled. */
  label?: string;
  color?: string;
  visible?: boolean;
  /** Restrict function plots to this x-interval (y = f(x) only). */
  domainMin?: number;
  domainMax?: number;
  startMarker?: GraphEndpointMarker;
  endMarker?: GraphEndpointMarker;
}

export interface GraphPointObject {
  type: 'point';
  id?: string;
  x: number;
  y: number;
  label?: string;
  color?: string;
}

export interface GraphLineObject {
  type: 'line';
  id?: string;
  start: [number, number];
  end: [number, number];
  color?: string;
}

export interface GraphCurveObject {
  type: 'curve';
  id?: string;
  controlPoints: [number, number][];
  interpolation?: 'smooth' | 'linear';
  color?: string;
}

export interface GraphShadedRegionObject {
  type: 'shaded-region';
  id?: string;
  /** Inequality expression, e.g. "x > 2" */
  inequality: string;
  color?: string;
}

export interface GraphLabelObject {
  type: 'label';
  id?: string;
  x: number;
  y: number;
  text: string;
}

export interface GraphAsymptoteObject {
  type: 'asymptote';
  id?: string;
  /** 'vertical' | 'horizontal' */
  orientation: 'vertical' | 'horizontal';
  value: number;
  color?: string;
}

export interface GraphSliderObject {
  type: 'slider';
  id?: string;
  name: string;
  min: number;
  max: number;
  step?: number;
  initial: number;
  /** When true, slider snaps to whole numbers (step = 1). */
  integer?: boolean;
  /** JessieCode / expression binding, e.g. coefficient in y = a*x^2 */
  bindsTo?: string;
}

export type GraphObject =
  | GraphPointObject
  | GraphLineObject
  | GraphCurveObject
  | GraphShadedRegionObject
  | GraphLabelObject
  | GraphAsymptoteObject
  | GraphSliderObject;

/** Graph definition stored in embeds.graphs. */
export interface GraphEmbed {
  type: 'graph';
  renderer: GraphRenderer;
  mode: GraphMode;
  viewport: GraphViewport;
  /** Pixel height of the graph plot area in the editor / preview. */
  displayHeight?: number;
  /** Pixel width of the graph in the editor / preview. */
  displayWidth?: number;
  /** When true (default), width/height follow viewport and scale ratio. */
  autoDisplaySize?: boolean;
  tools?: GraphTool[];
  options?: GraphOptions;
  expressions?: GraphExpression[];
  objects?: GraphObject[];
}

/** Student answer for an answer-input graph. */
export interface GraphPoint {
  x: number;
  y: number;
}

export interface GraphLineResponse {
  start: [number, number];
  end: [number, number];
}

export interface GraphCurveResponse {
  controlPoints: [number, number][];
  interpolation: 'smooth' | 'linear';
}

export interface GraphResponse {
  points?: GraphPoint[];
  lines?: GraphLineResponse[];
  curves?: GraphCurveResponse[];
}

/** Embeds manifest attached to rich HTML content (e.g. questions.embeds). */
export interface EditorEmbeds {
  chem_structures?: Record<string, ChemStructureEmbed>;
  graphs?: Record<string, GraphEmbed>;
}

export type ChemStructureUpsert = {
  structureId: string;
  embed: ChemStructureEmbed;
};

export type GraphEmbedUpsert = {
  embedId: string;
  embed: GraphEmbed;
};
