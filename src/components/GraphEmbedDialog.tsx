import React, { useEffect, useMemo, useRef, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ButtonBase from '@mui/material/ButtonBase';
import Popover from '@mui/material/Popover';
import Paper from '@mui/material/Paper';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import type {
  GraphCurveObject,
  GraphEmbed,
  GraphEndpointMarker,
  GraphExpression,
  GraphLabelObject,
  GraphLineObject,
  GraphObject,
  GraphPointObject,
  GraphSliderObject,
  GraphViewport,
} from '../types/embeds';
import GraphPreview from './GraphPreview';
import { graphPreviewKey } from '../utils/graphPreviewKey';
import MathLiveEditor from '../editors/MathLiveEditor';
import {
  normalizeViewport,
  parseViewportField,
  resolveGraphDisplaySize,
  viewportFieldsFromEmbed,
  viewportFromFields,
  withAutoDisplaySize,
  GRAPH_DISPLAY_MAX_HEIGHT,
  GRAPH_DISPLAY_MAX_WIDTH,
  GRAPH_DISPLAY_MIN_HEIGHT,
  GRAPH_DISPLAY_MIN_WIDTH,
} from '../utils/graphViewport';
import { findUndefinedGraphVariables } from '../utils/graphEquationVariables';

export type GraphEmbedDialogProps = {
  open: boolean;
  initialEmbed: GraphEmbed;
  onClose: () => void;
  onSave: (embed: GraphEmbed) => void;
};

const MARKER_OPTIONS: { value: GraphEndpointMarker; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'filled', label: 'Filled dot' },
  { value: 'hollow', label: 'Hollow dot' },
  { value: 'arrow', label: 'Arrow' },
];

function exprDomainKey(expr: GraphExpression, index: number): string {
  return expr.id ?? `expr-${index}`;
}

/** Commit domain text to a number; incomplete drafts map to `undefined`. */
function parseDomainFieldCommit(raw: string): number | undefined {
  const t = raw.trim();
  if (t === '' || t === '-' || t === '.' || t === '-.') return undefined;
  const n = Number(t);
  return Number.isFinite(n) ? n : undefined;
}

function parseGraphPixelCommit(raw: string): number | undefined {
  const t = raw.trim();
  if (t === '' || t === '-' || t === '.' || t === '-.') return undefined;
  const n = Number(t);
  return Number.isFinite(n) ? Math.round(n) : undefined;
}

function parseCoordinateCommit(raw: string): number | undefined {
  const t = raw.trim();
  if (t === '' || t === '-' || t === '.' || t === '-.') return undefined;
  const n = Number(t);
  return Number.isFinite(n) ? n : undefined;
}

/** Positive decimal; incomplete drafts keep previous value on commit. */
function parsePositiveDecimalCommit(raw: string, previous: number): number {
  const t = raw.trim();
  if (t === '' || t === '-' || t === '.' || t === '-.') return previous;
  const n = Number(t);
  return Number.isFinite(n) && n > 0 ? n : previous;
}

function sanitizeGraphVariableName(raw: string): string {
  const stripped = raw.replace(/[^A-Za-z0-9_]/g, '');
  return stripped.replace(/^[^A-Za-z]+/, '');
}

type PathView =
  | { objectIndex: number; variant: 'line'; obj: GraphLineObject }
  | { objectIndex: number; variant: 'curve'; obj: GraphCurveObject };

function collectPaths(objects: GraphObject[] | undefined): PathView[] {
  if (!objects?.length) return [];
  const out: PathView[] = [];
  objects.forEach((o, i) => {
    if (o.type === 'line') out.push({ objectIndex: i, variant: 'line', obj: o });
    else if (o.type === 'curve') out.push({ objectIndex: i, variant: 'curve', obj: o });
  });
  return out;
}

function pathPoints(p: PathView): [number, number][] {
  if (p.variant === 'line') return [p.obj.start, p.obj.end];
  return p.obj.controlPoints.map((q) => [...q] as [number, number]);
}

function pathInterpolation(p: PathView): 'smooth' | 'linear' {
  if (p.variant === 'line') return 'linear';
  return p.obj.interpolation ?? 'smooth';
}

function pathToObject(
  points: [number, number][],
  interpolation: 'smooth' | 'linear',
  id?: string,
  color?: string,
): GraphLineObject | GraphCurveObject {
  if (points.length < 2) {
    return { type: 'line', id, start: [0, 0], end: [1, 0], color };
  }
  if (points.length === 2 && interpolation === 'linear') {
    return { type: 'line', id, start: points[0], end: points[1], color };
  }
  return {
    type: 'curve',
    id,
    controlPoints: points,
    interpolation,
    color,
  };
}

function normalizeEmbedMode(embed: GraphEmbed): GraphEmbed {
  const normalized = withAutoDisplaySize({ ...embed, mode: 'display', tools: undefined });
  return {
    ...normalized,
    autoDisplaySize: false,
    options: {
      ...normalized.options,
      stretchToFit: false,
      showGrid: normalized.options?.showGrid ?? true,
      gridStep: normalized.options?.gridStep ?? 1,
    },
  };
}

const GraphEmbedDialog: React.FC<GraphEmbedDialogProps> = ({
  open,
  initialEmbed,
  onClose,
  onSave,
}) => {
  const [embed, setEmbed] = useState<GraphEmbed>(() => normalizeEmbedMode(initialEmbed));
  const [viewportText, setViewportText] = useState<Record<keyof GraphViewport, string>>(() =>
    viewportFieldsFromEmbed(normalizeViewport(initialEmbed.viewport)),
  );
  const [previewViewport, setPreviewViewport] = useState<GraphViewport>(() =>
    normalizeViewport(initialEmbed.viewport),
  );
  const [objectsTab, setObjectsTab] = useState(0);
  const [axisPopover, setAxisPopover] = useState<{
    axis: 'x' | 'y';
    anchor: HTMLElement;
  } | null>(null);
  const [axisDraft, setAxisDraft] = useState('');
  const [expressionDomainTexts, setExpressionDomainTexts] = useState<
    Record<string, { min: string; max: string }>
  >({});
  const [graphWText, setGraphWText] = useState<string | null>(null);
  const [graphHText, setGraphHText] = useState<string | null>(null);
  const [pointCoordDrafts, setPointCoordDrafts] = useState<Record<string, { x: string; y: string }>>(
    {},
  );
  const [pathCoordDrafts, setPathCoordDrafts] = useState<Record<string, string>>({});
  const [gridStepText, setGridStepText] = useState<string | null>(null);
  const [scaleRatioXText, setScaleRatioXText] = useState<string | null>(null);
  const [scaleRatioYText, setScaleRatioYText] = useState<string | null>(null);
  const [variablePrompt, setVariablePrompt] = useState<{
    exprIndex: number;
    name: string;
  } | null>(null);
  const declinedVariableKeys = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!axisPopover) return;
    setAxisDraft(
      axisPopover.axis === 'x'
        ? embed.options?.xAxisLabel?.trim() || 'x'
        : embed.options?.yAxisLabel?.trim() || 'y',
    );
  }, [axisPopover, embed.options?.xAxisLabel, embed.options?.yAxisLabel]);

  useEffect(() => {
    if (!open) return;
    const normalized = normalizeEmbedMode({
      ...initialEmbed,
      viewport: normalizeViewport(initialEmbed.viewport),
    });
    setEmbed(normalized);
    setViewportText(viewportFieldsFromEmbed(normalized.viewport));
    setPreviewViewport(normalized.viewport);
    setObjectsTab((t) => (t > 3 ? 0 : t));
    const exs = normalized.expressions ?? [];
    const domainMap: Record<string, { min: string; max: string }> = {};
    exs.forEach((ex, i) => {
      const id = exprDomainKey(ex, i);
      domainMap[id] = {
        min: ex.domainMin !== undefined ? String(ex.domainMin) : '',
        max: ex.domainMax !== undefined ? String(ex.domainMax) : '',
      };
    });
    setExpressionDomainTexts(domainMap);
    setGraphWText(null);
    setGraphHText(null);
    setPointCoordDrafts({});
    setPathCoordDrafts({});
  }, [open, initialEmbed]);

  const previewEmbed = useMemo(
    () => normalizeEmbedMode({ ...embed, viewport: previewViewport }),
    [embed, previewViewport],
  );

  const previewDisplaySize = useMemo(
    () => resolveGraphDisplaySize(previewEmbed),
    [previewEmbed],
  );
  const previewAspect = useMemo(() => {
    const h = previewDisplaySize.height || 1;
    return previewDisplaySize.width / h;
  }, [previewDisplaySize.width, previewDisplaySize.height]);

  const paths = useMemo(() => collectPaths(embed.objects), [embed.objects]);

  useEffect(() => {
    if (embed.autoDisplaySize !== false) {
      setGraphWText(null);
      setGraphHText(null);
    }
  }, [embed.autoDisplaySize]);

  const applyViewportToPreview = () => {
    const next = viewportFromFields(viewportText, previewViewport);
    setPreviewViewport(next);
    setEmbed((prev) => withAutoDisplaySize({ ...prev, viewport: next }, next));
  };

  const sliders = (embed.objects ?? []).filter(
    (o): o is GraphSliderObject => o.type === 'slider',
  );
  const expressions = embed.expressions ?? [];
  const textLabels = (embed.objects ?? []).filter(
    (o): o is GraphLabelObject => o.type === 'label',
  );
  const points = (embed.objects ?? []).filter(
    (o): o is GraphPointObject => o.type === 'point',
  );

  useEffect(() => {
    setExpressionDomainTexts((prev) => {
      const next = { ...prev };
      let changed = false;
      const valid = new Set(expressions.map((ex, i) => exprDomainKey(ex, i)));
      for (const k of Object.keys(next)) {
        if (!valid.has(k)) {
          delete next[k];
          changed = true;
        }
      }
      for (let i = 0; i < expressions.length; i += 1) {
        const ex = expressions[i];
        const id = exprDomainKey(ex, i);
        if (!next[id]) {
          next[id] = {
            min: ex.domainMin !== undefined ? String(ex.domainMin) : '',
            max: ex.domainMax !== undefined ? String(ex.domainMax) : '',
          };
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, [expressions]);

  const updateSlider = (index: number, patch: Partial<GraphSliderObject>) => {
    setEmbed((prev) => {
      const objects = [...(prev.objects ?? [])];
      const sliderIndices = objects
        .map((o, i) => (o.type === 'slider' ? i : -1))
        .filter((i) => i >= 0);
      const objIndex = sliderIndices[index];
      if (objIndex === undefined) return prev;
      objects[objIndex] = { ...objects[objIndex], ...patch } as GraphSliderObject;
      return { ...prev, objects };
    });
  };

  const addSliderWithName = (name: string) => {
    const varName = sanitizeGraphVariableName(name);
    if (!varName) return;
    const exists = sliders.some(
      (s) => (s.bindsTo?.trim() || s.name?.trim()) === varName,
    );
    if (exists) return;
    setEmbed((prev) => ({
      ...prev,
      objects: [
        ...(prev.objects ?? []),
        {
          type: 'slider',
          id: `slider_${Date.now()}`,
          name: varName,
          min: -5,
          max: 5,
          step: 0.1,
          initial: 1,
          integer: false,
          bindsTo: varName,
        },
      ],
    }));
  };

  const addSlider = () => addSliderWithName('a');

  const definedVariableNames = useMemo(
    () =>
      sliders
        .flatMap((s) => [s.bindsTo?.trim(), s.name?.trim()])
        .filter((n): n is string => !!n),
    [sliders],
  );

  const checkEquationForMissingVariables = (exprIndex: number, latex: string) => {
    const missing = findUndefinedGraphVariables(latex, definedVariableNames, {
      x: embed.options?.xAxisLabel,
      y: embed.options?.yAxisLabel,
    });
    if (!missing.length) {
      setVariablePrompt((p) => (p?.exprIndex === exprIndex ? null : p));
      return;
    }
    const name = missing[0];
    const key = `${exprIndex}:${name}`;
    if (declinedVariableKeys.current.has(key)) return;
    setVariablePrompt({ exprIndex, name });
  };

  const dismissVariablePrompt = (exprIndex: number, name: string) => {
    declinedVariableKeys.current.add(`${exprIndex}:${name}`);
    setVariablePrompt(null);
  };

  const confirmCreateVariable = (exprIndex: number, name: string) => {
    addSliderWithName(name);
    declinedVariableKeys.current.delete(`${exprIndex}:${name}`);
    setVariablePrompt(null);
    setObjectsTab(1);
  };

  const removeSlider = (index: number) => {
    setEmbed((prev) => {
      const objects = [...(prev.objects ?? [])];
      const sliderIndices = objects
        .map((o, i) => (o.type === 'slider' ? i : -1))
        .filter((i) => i >= 0);
      const objIndex = sliderIndices[index];
      if (objIndex === undefined) return prev;
      objects.splice(objIndex, 1);
      return { ...prev, objects };
    });
  };

  const updateExpression = (index: number, patch: Partial<GraphExpression>) => {
    setEmbed((prev) => {
      const next = [...(prev.expressions ?? [])];
      next[index] = { ...next[index], ...patch };
      return { ...prev, expressions: next };
    });
  };

  const addExpression = () => {
    setEmbed((prev) => ({
      ...prev,
      expressions: [
        ...(prev.expressions ?? []),
        {
          id: `expr_${Date.now()}`,
          latex: 'y = x^2',
          visible: true,
          startMarker: 'none',
          endMarker: 'none',
        },
      ],
    }));
  };

  const removeExpression = (index: number) => {
    setEmbed((prev) => ({
      ...prev,
      expressions: (prev.expressions ?? []).filter((_, i) => i !== index),
    }));
  };

  const expressionDomainText = (expr: GraphExpression, index: number) => {
    const id = exprDomainKey(expr, index);
    return {
      min: expressionDomainTexts[id]?.min ?? (expr.domainMin !== undefined ? String(expr.domainMin) : ''),
      max: expressionDomainTexts[id]?.max ?? (expr.domainMax !== undefined ? String(expr.domainMax) : ''),
    };
  };

  const commitExpressionDomainField = (
    index: number,
    expr: GraphExpression,
    field: 'min' | 'max',
    raw: string,
  ) => {
    const id = exprDomainKey(expr, index);
    const value = parseDomainFieldCommit(raw);
    updateExpression(index, field === 'min' ? { domainMin: value } : { domainMax: value });
    setExpressionDomainTexts((p) => ({
      ...p,
      [id]: {
        min:
          field === 'min'
            ? value !== undefined
              ? String(value)
              : ''
            : p[id]?.min ?? (expr.domainMin !== undefined ? String(expr.domainMin) : ''),
        max:
          field === 'max'
            ? value !== undefined
              ? String(value)
              : ''
            : p[id]?.max ?? (expr.domainMax !== undefined ? String(expr.domainMax) : ''),
      },
    }));
  };

  const updateTextLabel = (index: number, patch: Partial<GraphLabelObject>) => {
    setEmbed((prev) => {
      const objects = [...(prev.objects ?? [])];
      const labelIndices = objects
        .map((o, i) => (o.type === 'label' ? i : -1))
        .filter((i) => i >= 0);
      const objIndex = labelIndices[index];
      if (objIndex === undefined) return prev;
      objects[objIndex] = { ...objects[objIndex], ...patch } as GraphLabelObject;
      return { ...prev, objects };
    });
  };

  const addTextLabel = () => {
    setEmbed((prev) => ({
      ...prev,
      objects: [
        ...(prev.objects ?? []),
        { type: 'label', id: `label_${Date.now()}`, x: 0, y: 0, text: 'Label' },
      ],
    }));
  };

  const removeTextLabel = (index: number) => {
    setEmbed((prev) => {
      const objects = [...(prev.objects ?? [])];
      const labelIndices = objects
        .map((o, i) => (o.type === 'label' ? i : -1))
        .filter((i) => i >= 0);
      const objIndex = labelIndices[index];
      if (objIndex === undefined) return prev;
      objects.splice(objIndex, 1);
      return { ...prev, objects };
    });
  };

  const updatePoint = (index: number, patch: Partial<GraphPointObject>) => {
    setEmbed((prev) => {
      const objects = [...(prev.objects ?? [])];
      const indices = objects.map((o, i) => (o.type === 'point' ? i : -1)).filter((i) => i >= 0);
      const objIndex = indices[index];
      if (objIndex === undefined) return prev;
      objects[objIndex] = { ...objects[objIndex], ...patch } as GraphPointObject;
      return { ...prev, objects };
    });
  };

  const addPoint = () => {
    setEmbed((prev) => ({
      ...prev,
      objects: [
        ...(prev.objects ?? []),
        { type: 'point', id: `point_${Date.now()}`, x: 0, y: 0, label: '' },
      ],
    }));
  };

  const removePoint = (index: number) => {
    setEmbed((prev) => {
      const objects = [...(prev.objects ?? [])];
      const indices = objects.map((o, i) => (o.type === 'point' ? i : -1)).filter((i) => i >= 0);
      const objIndex = indices[index];
      if (objIndex === undefined) return prev;
      objects.splice(objIndex, 1);
      return { ...prev, objects };
    });
  };

  const addPath = () => {
    setEmbed((prev) => ({
      ...prev,
      objects: [
        ...(prev.objects ?? []),
        {
          type: 'line',
          id: `path_${Date.now()}`,
          start: [-2, 0] as [number, number],
          end: [2, 0] as [number, number],
        },
      ],
    }));
  };

  const removePath = (objectIndex: number) => {
    setEmbed((prev) => {
      const objects = [...(prev.objects ?? [])];
      const o = objects[objectIndex];
      if (!o || (o.type !== 'line' && o.type !== 'curve')) return prev;
      objects.splice(objectIndex, 1);
      return { ...prev, objects };
    });
  };

  const replacePath = (
    objectIndex: number,
    points: [number, number][],
    interpolation: 'smooth' | 'linear',
  ) => {
    setEmbed((prev) => {
      const objects = [...(prev.objects ?? [])];
      const old = objects[objectIndex];
      const id =
        old?.type === 'line' || old?.type === 'curve' ? old.id : `path_${Date.now()}`;
      const color = old?.type === 'line' || old?.type === 'curve' ? old.color : undefined;
      objects[objectIndex] = pathToObject(points, interpolation, id, color) as GraphObject;
      return { ...prev, objects };
    });
  };

  const updatePathPoint = (
    objectIndex: number,
    pointIndex: number,
    coord: 'x' | 'y',
    raw: string,
  ) => {
    const p = paths.find((x) => x.objectIndex === objectIndex);
    if (!p) return;
    const pts = pathPoints(p);
    const prevPt = pts[pointIndex] ?? [0, 0];
    pts[pointIndex] = [
      coord === 'x' ? parseViewportField(raw, prevPt[0]) : prevPt[0],
      coord === 'y' ? parseViewportField(raw, prevPt[1]) : prevPt[1],
    ];
    replacePath(objectIndex, pts, pathInterpolation(p));
  };

  const setPathInterpolation = (objectIndex: number, interpolation: 'smooth' | 'linear') => {
    const p = paths.find((x) => x.objectIndex === objectIndex);
    if (!p) return;
    let pts = pathPoints(p);
    if (interpolation === 'smooth' && pts.length === 2) {
      pts = [pts[0], [(pts[0][0] + pts[1][0]) / 2, (pts[0][1] + pts[1][1]) / 2], pts[1]];
    }
    replacePath(objectIndex, pts, interpolation);
  };

  const addPathControlPoint = (objectIndex: number) => {
    setEmbed((prev) => {
      const objects = [...(prev.objects ?? [])];
      const o = objects[objectIndex];
      if (!o || (o.type !== 'line' && o.type !== 'curve')) return prev;
      const id = o.id;
      if (o.type === 'line') {
        const pts: [number, number][] = [o.start, o.end, [o.end[0] + 1, o.end[1]]];
        objects[objectIndex] = {
          type: 'curve',
          id,
          controlPoints: pts,
          interpolation: 'linear',
        };
        return { ...prev, objects };
      }
      const last = o.controlPoints[o.controlPoints.length - 1] ?? [0, 0];
      objects[objectIndex] = {
        ...o,
        controlPoints: [...o.controlPoints, [last[0] + 1, last[1]]],
      };
      return { ...prev, objects };
    });
  };

  const handleSave = () => {
    const viewport = viewportFromFields(viewportText, previewViewport);
    const expressionsForSave = (embed.expressions ?? []).map((expr, index) => {
      const text = expressionDomainText(expr, index);
      return {
        ...expr,
        domainMin: parseDomainFieldCommit(text.min),
        domainMax: parseDomainFieldCommit(text.max),
      };
    });
    onSave(
      normalizeEmbedMode({
        ...embed,
        expressions: expressionsForSave,
        viewport,
        type: 'graph',
        renderer: 'jsxgraph',
      }),
    );
    onClose();
  };

  const sectionTitle = (t: string) => (
    <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 0.08 }}>
      {t}
    </Typography>
  );

  const viewSection = (
    <Stack spacing={1.5}>
      {sectionTitle('View')}
      <Stack direction="row" spacing={1} flexWrap="wrap">
        <TextField
          label="x-min"
          type="text"
          inputMode="decimal"
          size="small"
          value={viewportText.xMin}
          onChange={(e) => setViewportText((prev) => ({ ...prev, xMin: e.target.value }))}
          onBlur={applyViewportToPreview}
          onKeyDown={(e) => e.key === 'Enter' && applyViewportToPreview()}
          sx={{ width: 110 }}
        />
        <TextField
          label="x-max"
          type="text"
          inputMode="decimal"
          size="small"
          value={viewportText.xMax}
          onChange={(e) => setViewportText((prev) => ({ ...prev, xMax: e.target.value }))}
          onBlur={applyViewportToPreview}
          onKeyDown={(e) => e.key === 'Enter' && applyViewportToPreview()}
          sx={{ width: 110 }}
        />
        <TextField
          label="y-min"
          type="text"
          inputMode="decimal"
          size="small"
          value={viewportText.yMin}
          onChange={(e) => setViewportText((prev) => ({ ...prev, yMin: e.target.value }))}
          onBlur={applyViewportToPreview}
          onKeyDown={(e) => e.key === 'Enter' && applyViewportToPreview()}
          sx={{ width: 110 }}
        />
        <TextField
          label="y-max"
          type="text"
          inputMode="decimal"
          size="small"
          value={viewportText.yMax}
          onChange={(e) => setViewportText((prev) => ({ ...prev, yMax: e.target.value }))}
          onBlur={applyViewportToPreview}
          onKeyDown={(e) => e.key === 'Enter' && applyViewportToPreview()}
          sx={{ width: 110 }}
        />
      </Stack>
    </Stack>
  );

  const equationsPanel = (
    <Stack spacing={2}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="subtitle2">Equations</Typography>
        <Button size="small" startIcon={<AddIcon />} onClick={addExpression}>
          Add equation
        </Button>
      </Stack>
      {expressions.map((expr, index) => (
        <Stack
          key={exprDomainKey(expr, index)}
          spacing={1}
          sx={{ p: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}
          onBlur={(e) => {
            const next = e.relatedTarget as Node | null;
            if (next && e.currentTarget.contains(next)) return;
            checkEquationForMissingVariables(index, expr.latex);
          }}
        >
          <Stack direction="row" spacing={1} alignItems="flex-start">
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <MathLiveEditor
                value={expr.latex}
                onChange={(latex) => {
                  updateExpression(index, { latex });
                  if (variablePrompt?.exprIndex === index) {
                    setVariablePrompt(null);
                  }
                }}
                minWidthPx={200}
                minWidthPercent={100}
                minHeightPx={44}
                maxHeightPx={88}
                inlineInsertPanel
                openPanelOnFocus
              />
            </Box>
            <IconButton size="small" onClick={() => removeExpression(index)} aria-label="Remove">
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Stack>
          {variablePrompt?.exprIndex === index && (
            <Paper variant="outlined" sx={{ p: 1.25, bgcolor: 'action.hover' }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Variable &quot;{variablePrompt.name}&quot; is not defined. Create it?
              </Typography>
              <Stack direction="row" spacing={1}>
                <Button
                  size="small"
                  variant="contained"
                  onClick={() => confirmCreateVariable(index, variablePrompt.name)}
                >
                  Yes
                </Button>
                <Button
                  size="small"
                  onClick={() => dismissVariablePrompt(index, variablePrompt.name)}
                >
                  No
                </Button>
              </Stack>
            </Paper>
          )}
          <TextField
            label="Graph label (at origin)"
            size="small"
            fullWidth
            value={expr.label ?? ''}
            placeholder="Optional — only shown when set"
            onChange={(e) =>
              updateExpression(index, {
                label: e.target.value.trim() === '' ? undefined : e.target.value,
              })
            }
          />
          <Stack direction="row" spacing={1} flexWrap="wrap" alignItems="center">
            <TextField
              label="Domain x min"
              size="small"
              type="text"
              inputMode="decimal"
              value={expressionDomainText(expr, index).min}
              placeholder="−∞"
              onChange={(e) => {
                const id = exprDomainKey(expr, index);
                setExpressionDomainTexts((p) => ({
                  ...p,
                  [id]: {
                    min: e.target.value,
                    max:
                      p[id]?.max ??
                      (expr.domainMax !== undefined ? String(expr.domainMax) : ''),
                  },
                }));
              }}
              onBlur={(e) => {
                commitExpressionDomainField(index, expr, 'min', e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key !== 'Enter') return;
                (e.target as HTMLInputElement).blur();
              }}
              sx={{ width: 100 }}
            />
            <TextField
              label="Domain x max"
              size="small"
              type="text"
              inputMode="decimal"
              value={expressionDomainText(expr, index).max}
              placeholder="+∞"
              onChange={(e) => {
                const id = exprDomainKey(expr, index);
                setExpressionDomainTexts((p) => ({
                  ...p,
                  [id]: {
                    min:
                      p[id]?.min ??
                      (expr.domainMin !== undefined ? String(expr.domainMin) : ''),
                    max: e.target.value,
                  },
                }));
              }}
              onBlur={(e) => {
                commitExpressionDomainField(index, expr, 'max', e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key !== 'Enter') return;
                (e.target as HTMLInputElement).blur();
              }}
              sx={{ width: 100 }}
            />
            <FormControl size="small" sx={{ minWidth: 100 }}>
              <InputLabel id={`es-${exprDomainKey(expr, index)}`}>Start</InputLabel>
              <Select
                labelId={`es-${exprDomainKey(expr, index)}`}
                label="Start"
                value={expr.startMarker ?? 'none'}
                onChange={(e) =>
                  updateExpression(index, { startMarker: e.target.value as GraphEndpointMarker })
                }
              >
                {MARKER_OPTIONS.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 100 }}>
              <InputLabel id={`ee-${exprDomainKey(expr, index)}`}>End</InputLabel>
              <Select
                labelId={`ee-${exprDomainKey(expr, index)}`}
                label="End"
                value={expr.endMarker ?? 'none'}
                onChange={(e) =>
                  updateExpression(index, { endMarker: e.target.value as GraphEndpointMarker })
                }
              >
                {MARKER_OPTIONS.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
          <Typography variant="caption" color="text.secondary">
            y = f(x), relations, or bare expression. Leave a domain box empty for −∞ (min) or +∞ (max); markers apply to function plots.
          </Typography>
        </Stack>
      ))}
    </Stack>
  );

  const slidersPanel = (
    <Stack spacing={2}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="subtitle2">Variables</Typography>
        <Button size="small" startIcon={<AddIcon />} onClick={addSlider}>
          Add variable
        </Button>
      </Stack>
      <Typography variant="caption" color="text.secondary">
        Variables appear on the graph; students can adjust them when the graph is interactive.
      </Typography>
      {sliders.map((slider, index) => (
        <Stack
          key={slider.id ?? index}
          spacing={1}
          sx={{ p: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}
        >
          <Stack direction="row" spacing={1} flexWrap="wrap" alignItems="center">
            <TextField
              label="Variable"
              size="small"
              value={slider.name}
              onChange={(e) => {
                const name = sanitizeGraphVariableName(e.target.value);
                updateSlider(index, { name, bindsTo: name });
              }}
              inputProps={{ title: 'Letters, numbers, underscore' }}
              sx={{ width: 92 }}
            />
            <TextField
              label="Min"
              size="small"
              value={String(slider.min)}
              onChange={(e) =>
                updateSlider(index, { min: parseViewportField(e.target.value, slider.min) })
              }
              sx={{ width: 72 }}
            />
            <TextField
              label="Max"
              size="small"
              value={String(slider.max)}
              onChange={(e) =>
                updateSlider(index, { max: parseViewportField(e.target.value, slider.max) })
              }
              sx={{ width: 72 }}
            />
            <TextField
              label="Initial"
              size="small"
              value={String(slider.initial)}
              onChange={(e) =>
                updateSlider(index, {
                  initial: parseViewportField(e.target.value, slider.initial),
                })
              }
              sx={{ width: 72 }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={!!slider.integer}
                  onChange={(e) => {
                    const integer = e.target.checked;
                    updateSlider(index, {
                      integer,
                      step: integer ? 1 : 0.1,
                      min: integer ? Math.round(slider.min) : slider.min,
                      max: integer ? Math.round(slider.max) : slider.max,
                      initial: integer ? Math.round(slider.initial) : slider.initial,
                    });
                  }}
                />
              }
              label="Integer"
              sx={{ m: 0, ml: 0.25 }}
            />
            <IconButton size="small" onClick={() => removeSlider(index)} aria-label="Remove">
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Stack>
      ))}
    </Stack>
  );

  const geometryPanel = (
    <Stack spacing={2}>
      <FormControlLabel
        control={
          <Checkbox
            checked={!!embed.options?.snapToGrid}
            onChange={(e) =>
              setEmbed((prev) => ({
                ...prev,
                options: { ...prev.options, snapToGrid: e.target.checked },
              }))
            }
          />
        }
        label="Snap to grid"
      />
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="stretch">
        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            pr: { md: 2 },
            borderRight: { md: '1px solid' },
            borderColor: { md: 'divider' },
          }}
        >
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
            <Typography variant="subtitle2">Points</Typography>
            <Button size="small" startIcon={<AddIcon />} onClick={addPoint}>
              Add point
            </Button>
          </Stack>
          <Stack spacing={1.5}>
            {points.map((point, index) => (
              <Stack
                key={point.id ?? index}
                direction="row"
                spacing={1}
                alignItems="center"
                flexWrap="wrap"
                sx={{ p: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}
              >
                <TextField
                  label="x"
                  size="small"
                  value={pointCoordDrafts[point.id ?? `point-${index}`]?.x ?? String(point.x)}
                  onChange={(e) => {
                    const key = point.id ?? `point-${index}`;
                    setPointCoordDrafts((prev) => ({
                      ...prev,
                      [key]: { x: e.target.value, y: prev[key]?.y ?? String(point.y) },
                    }));
                  }}
                  onBlur={(e) => {
                    const key = point.id ?? `point-${index}`;
                    const next = parseCoordinateCommit(e.target.value);
                    if (next !== undefined) updatePoint(index, { x: next });
                    setPointCoordDrafts((prev) => {
                      const out = { ...prev };
                      delete out[key];
                      return out;
                    });
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
                  }}
                  sx={{ width: 72 }}
                />
                <TextField
                  label="y"
                  size="small"
                  value={pointCoordDrafts[point.id ?? `point-${index}`]?.y ?? String(point.y)}
                  onChange={(e) => {
                    const key = point.id ?? `point-${index}`;
                    setPointCoordDrafts((prev) => ({
                      ...prev,
                      [key]: { x: prev[key]?.x ?? String(point.x), y: e.target.value },
                    }));
                  }}
                  onBlur={(e) => {
                    const key = point.id ?? `point-${index}`;
                    const next = parseCoordinateCommit(e.target.value);
                    if (next !== undefined) updatePoint(index, { y: next });
                    setPointCoordDrafts((prev) => {
                      const out = { ...prev };
                      delete out[key];
                      return out;
                    });
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
                  }}
                  sx={{ width: 72 }}
                />
                <TextField
                  label="Label"
                  size="small"
                  value={point.label ?? ''}
                  onChange={(e) => updatePoint(index, { label: e.target.value })}
                  sx={{ width: 100 }}
                />
                <IconButton size="small" onClick={() => removePoint(index)} aria-label="Remove">
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Stack>
            ))}
          </Stack>
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
            <Typography variant="subtitle2">Lines &amp; curves</Typography>
            <Button size="small" startIcon={<AddIcon />} onClick={addPath}>
              Add path
            </Button>
          </Stack>
          <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
            Two points + linear = segment; more points or smooth = spline.
          </Typography>
          <Stack spacing={1.5}>
            {paths.map((path, listIndex) => {
              const pts = pathPoints(path);
              const interp = pathInterpolation(path);
              return (
                <Stack
                  key={`${path.objectIndex}-${listIndex}`}
                  spacing={1}
                  sx={{ p: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}
                >
                  <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                      <InputLabel id={`path-style-${path.objectIndex}`}>Style</InputLabel>
                      <Select
                        labelId={`path-style-${path.objectIndex}`}
                        label="Style"
                        value={interp}
                        onChange={(e) =>
                          setPathInterpolation(
                            path.objectIndex,
                            e.target.value as 'smooth' | 'linear',
                          )
                        }
                      >
                        <MenuItem value="linear">Linear</MenuItem>
                        <MenuItem value="smooth">Smooth</MenuItem>
                      </Select>
                    </FormControl>
                    <Button size="small" onClick={() => addPathControlPoint(path.objectIndex)}>
                      Add point
                    </Button>
                    <Box sx={{ flex: 1 }} />
                    <IconButton
                      size="small"
                      onClick={() => removePath(path.objectIndex)}
                      aria-label="Remove path"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                  {pts.map((pt, ptIndex) => (
                    <Stack key={ptIndex} direction="row" spacing={1} alignItems="center">
                      <Typography variant="caption" color="text.secondary" sx={{ width: 28 }}>
                        P{ptIndex + 1}
                      </Typography>
                      <TextField
                        label="x"
                        size="small"
                        value={
                          pathCoordDrafts[`path-${path.objectIndex}-${ptIndex}-x`] ?? String(pt[0])
                        }
                        onChange={(e) =>
                          setPathCoordDrafts((prev) => ({
                            ...prev,
                            [`path-${path.objectIndex}-${ptIndex}-x`]: e.target.value,
                          }))
                        }
                        onBlur={(e) => {
                          const key = `path-${path.objectIndex}-${ptIndex}-x`;
                          const next = parseCoordinateCommit(e.target.value);
                          if (next !== undefined) {
                            updatePathPoint(path.objectIndex, ptIndex, 'x', String(next));
                          }
                          setPathCoordDrafts((prev) => {
                            const out = { ...prev };
                            delete out[key];
                            return out;
                          });
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
                        }}
                        sx={{ width: 72 }}
                      />
                      <TextField
                        label="y"
                        size="small"
                        value={
                          pathCoordDrafts[`path-${path.objectIndex}-${ptIndex}-y`] ?? String(pt[1])
                        }
                        onChange={(e) =>
                          setPathCoordDrafts((prev) => ({
                            ...prev,
                            [`path-${path.objectIndex}-${ptIndex}-y`]: e.target.value,
                          }))
                        }
                        onBlur={(e) => {
                          const key = `path-${path.objectIndex}-${ptIndex}-y`;
                          const next = parseCoordinateCommit(e.target.value);
                          if (next !== undefined) {
                            updatePathPoint(path.objectIndex, ptIndex, 'y', String(next));
                          }
                          setPathCoordDrafts((prev) => {
                            const out = { ...prev };
                            delete out[key];
                            return out;
                          });
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
                        }}
                        sx={{ width: 72 }}
                      />
                    </Stack>
                  ))}
                </Stack>
              );
            })}
          </Stack>
        </Box>
      </Stack>
    </Stack>
  );

  const labelsPanel = (
    <Stack spacing={2}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="subtitle2">Text labels</Typography>
        <Button size="small" startIcon={<AddIcon />} onClick={addTextLabel}>
          Add label
        </Button>
      </Stack>
      <Typography variant="caption" color="text.secondary">
        Free text at coordinates. Equation labels use the equation panel.
      </Typography>
      {textLabels.map((label, index) => (
        <Stack
          key={label.id ?? index}
          direction="row"
          spacing={1}
          alignItems="center"
          flexWrap="wrap"
          sx={{ p: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}
        >
          <TextField
            label="Text"
            size="small"
            value={label.text}
            onChange={(e) => updateTextLabel(index, { text: e.target.value })}
            sx={{ flex: 1, minWidth: 120 }}
          />
          <TextField
            label="x"
            size="small"
            value={String(label.x)}
            onChange={(e) =>
              updateTextLabel(index, { x: parseViewportField(e.target.value, label.x) })
            }
            sx={{ width: 72 }}
          />
          <TextField
            label="y"
            size="small"
            value={String(label.y)}
            onChange={(e) =>
              updateTextLabel(index, { y: parseViewportField(e.target.value, label.y) })
            }
            sx={{ width: 72 }}
          />
          <IconButton size="small" onClick={() => removeTextLabel(index)} aria-label="Remove">
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Stack>
      ))}
    </Stack>
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xl" fullWidth scroll="paper">
      <DialogTitle>Graph settings</DialogTitle>
      <DialogContent dividers sx={{ pt: 2 }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={3}
          alignItems={{ xs: 'stretch', md: 'flex-start' }}
        >
          <Box
            sx={{
              flex: { md: '0 0 auto' },
              width: { md: Math.min(previewDisplaySize.width + 48, 580) },
              maxWidth: '100%',
            }}
          >
            <Typography variant="subtitle2" gutterBottom>
              Preview
            </Typography>
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              flexWrap="wrap"
              sx={{
                mb: 1,
                py: 0.75,
                px: 1,
                bgcolor: 'action.hover',
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    checked={embed.options?.showAxes !== false}
                    onChange={(e) =>
                      setEmbed((prev) => ({
                        ...prev,
                        options: { ...prev.options, showAxes: e.target.checked },
                      }))
                    }
                  />
                }
                label="Show axes"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    checked={embed.options?.showGrid === true}
                    onChange={(e) =>
                      setEmbed((prev) => ({
                        ...prev,
                        options: { ...prev.options, showGrid: e.target.checked },
                      }))
                    }
                  />
                }
                label="Show grid"
              />
              <TextField
                size="small"
                label="Step"
                type="text"
                inputMode="decimal"
                disabled={embed.options?.showGrid !== true}
                value={gridStepText ?? String(embed.options?.gridStep ?? 1)}
                onFocus={(e) => setGridStepText(e.target.value)}
                onChange={(e) => setGridStepText(e.target.value)}
                onBlur={(e) => {
                  const prev = embed.options?.gridStep ?? 1;
                  const step = parsePositiveDecimalCommit(e.target.value, prev);
                  setGridStepText(null);
                  setEmbed((p) => ({
                    ...p,
                    options: { ...p.options, gridStep: step },
                  }));
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
                }}
                sx={{ width: 92 }}
              />
            </Stack>

            {open && (
              <Box
                sx={{
                  position: 'relative',
                  width: previewDisplaySize.width,
                  maxWidth: '100%',
                  mx: 'auto',
                  height: previewDisplaySize.height,
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 1,
                  overflow: 'hidden',
                }}
              >
                <GraphPreview
                  key={graphPreviewKey(previewEmbed)}
                  embed={previewEmbed}
                  height={previewDisplaySize.height}
                  width={`${previewDisplaySize.width}px`}
                />
                <ButtonBase
                  type="button"
                  disableRipple
                  aria-label="Edit horizontal axis label"
                  onClick={(e) => setAxisPopover({ axis: 'y', anchor: e.currentTarget })}
                  sx={{
                    position: 'absolute',
                    bottom: 2,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: Math.min(200, previewDisplaySize.width * 0.55),
                    height: 40,
                    borderRadius: 1,
                    zIndex: 2,
                    opacity: 0,
                    '&:hover': { opacity: 0.15, bgcolor: 'primary.main' },
                  }}
                />
                <ButtonBase
                  type="button"
                  disableRipple
                  aria-label="Edit vertical axis label"
                  onClick={(e) => setAxisPopover({ axis: 'x', anchor: e.currentTarget })}
                  sx={{
                    position: 'absolute',
                    left: 2,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: 44,
                    height: Math.min(160, previewDisplaySize.height * 0.5),
                    borderRadius: 1,
                    zIndex: 2,
                    opacity: 0,
                    '&:hover': { opacity: 0.15, bgcolor: 'primary.main' },
                  }}
                />
                <Paper
                  elevation={2}
                  sx={{
                    position: 'absolute',
                    right: 8,
                    bottom: 8,
                    p: 1,
                    zIndex: 2,
                    bgcolor: 'background.paper',
                  }}
                >
                  <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                    Scale ratio
                  </Typography>
                  <Stack direction="row" spacing={0.5} alignItems="center" flexWrap="wrap">
                    <Typography variant="caption">x</Typography>
                    <TextField
                      size="small"
                      type="text"
                      inputMode="decimal"
                      value={scaleRatioXText ?? String(embed.options?.scaleRatio?.x ?? 1)}
                      onFocus={(e) => {
                        e.stopPropagation();
                        setScaleRatioXText(e.target.value);
                      }}
                      onChange={(e) => {
                        e.stopPropagation();
                        setScaleRatioXText(e.target.value);
                      }}
                      onBlur={(e) => {
                        e.stopPropagation();
                        const prevX = embed.options?.scaleRatio?.x ?? 1;
                        const prevY = embed.options?.scaleRatio?.y ?? 1;
                        const x = parsePositiveDecimalCommit(e.target.value, prevX);
                        setScaleRatioXText(null);
                        setEmbed((p) =>
                          withAutoDisplaySize(
                            {
                              ...p,
                              options: {
                                ...p.options,
                                stretchToFit: false,
                                scaleRatio: { x, y: prevY },
                              },
                            },
                            previewViewport,
                          ),
                        );
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
                      }}
                      onClick={(e) => e.stopPropagation()}
                      sx={{ width: 68 }}
                    />
                    <Typography variant="caption">y</Typography>
                    <TextField
                      size="small"
                      type="text"
                      inputMode="decimal"
                      value={scaleRatioYText ?? String(embed.options?.scaleRatio?.y ?? 1)}
                      onFocus={(e) => {
                        e.stopPropagation();
                        setScaleRatioYText(e.target.value);
                      }}
                      onChange={(e) => {
                        e.stopPropagation();
                        setScaleRatioYText(e.target.value);
                      }}
                      onBlur={(e) => {
                        e.stopPropagation();
                        const prevX = embed.options?.scaleRatio?.x ?? 1;
                        const prevY = embed.options?.scaleRatio?.y ?? 1;
                        const y = parsePositiveDecimalCommit(e.target.value, prevY);
                        setScaleRatioYText(null);
                        setEmbed((p) =>
                          withAutoDisplaySize(
                            {
                              ...p,
                              options: {
                                ...p.options,
                                stretchToFit: false,
                                scaleRatio: { x: prevX, y },
                              },
                            },
                            previewViewport,
                          ),
                        );
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
                      }}
                      onClick={(e) => e.stopPropagation()}
                      sx={{ width: 68 }}
                    />
                  </Stack>
                </Paper>
              </Box>
            )}

            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" sx={{ mt: 1.5 }}>
              <Typography variant="body2" color="text.secondary">
                Graph size
              </Typography>
              <TextField
                label="W"
                type="text"
                inputMode="numeric"
                size="small"
                value={graphWText ?? String(previewDisplaySize.width)}
                disabled={embed.autoDisplaySize !== false}
                onFocus={(e) => setGraphWText(e.target.value)}
                onChange={(e) => setGraphWText(e.target.value)}
                onBlur={(e) => {
                  const n = parseGraphPixelCommit(e.target.value);
                  setGraphWText(null);
                  if (n === undefined) return;
                  const w = Math.min(
                    GRAPH_DISPLAY_MAX_WIDTH,
                    Math.max(GRAPH_DISPLAY_MIN_WIDTH, n),
                  );
                  const h = Math.min(
                    GRAPH_DISPLAY_MAX_HEIGHT,
                    Math.max(GRAPH_DISPLAY_MIN_HEIGHT, Math.round(w / Math.max(0.0001, previewAspect))),
                  );
                  setEmbed((prev) => ({
                    ...prev,
                    autoDisplaySize: false,
                    displayWidth: w,
                    displayHeight: h,
                  }));
                }}
                onKeyDown={(e) => {
                  if (e.key !== 'Enter') return;
                  (e.target as HTMLInputElement).blur();
                }}
                sx={{ width: 100 }}
              />
              <Typography variant="body2" color="text.secondary">
                ×
              </Typography>
              <TextField
                label="H"
                type="text"
                inputMode="numeric"
                size="small"
                value={graphHText ?? String(previewDisplaySize.height)}
                disabled={embed.autoDisplaySize !== false}
                onFocus={(e) => setGraphHText(e.target.value)}
                onChange={(e) => setGraphHText(e.target.value)}
                onBlur={(e) => {
                  const n = parseGraphPixelCommit(e.target.value);
                  setGraphHText(null);
                  if (n === undefined) return;
                  const h = Math.min(
                    GRAPH_DISPLAY_MAX_HEIGHT,
                    Math.max(GRAPH_DISPLAY_MIN_HEIGHT, n),
                  );
                  const w = Math.min(
                    GRAPH_DISPLAY_MAX_WIDTH,
                    Math.max(GRAPH_DISPLAY_MIN_WIDTH, Math.round(h * previewAspect)),
                  );
                  setEmbed((prev) => ({
                    ...prev,
                    autoDisplaySize: false,
                    displayHeight: h,
                    displayWidth: w,
                  }));
                }}
                onKeyDown={(e) => {
                  if (e.key !== 'Enter') return;
                  (e.target as HTMLInputElement).blur();
                }}
                sx={{ width: 100 }}
              />
              <Typography variant="caption" color="text.secondary">
                px
              </Typography>
            </Stack>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
              Click the bottom or left edge of the graph to edit axis names.
            </Typography>
          </Box>

          <Stack spacing={2.5} sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="h6" component="h2">
              Graph settings
            </Typography>
            {viewSection}

            {sectionTitle('Objects')}
            <Tabs
              value={objectsTab}
              onChange={(_, v) => setObjectsTab(v)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              <Tab label="Equations" />
              <Tab label="Variables" />
              <Tab label="Points & lines" />
              <Tab label="Labels" />
            </Tabs>
            <Box
              sx={{
                minHeight: 240,
                maxHeight: 'min(55vh, 520px)',
                overflow: 'auto',
                pr: 0.5,
              }}
            >
              {objectsTab === 0 && equationsPanel}
              {objectsTab === 1 && slidersPanel}
              {objectsTab === 2 && geometryPanel}
              {objectsTab === 3 && labelsPanel}
            </Box>
          </Stack>
        </Stack>
      </DialogContent>
      <Popover
        open={Boolean(axisPopover)}
        anchorEl={axisPopover?.anchor ?? null}
        onClose={() => setAxisPopover(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Paper sx={{ p: 2, width: 280 }}>
          <Typography variant="subtitle2" gutterBottom>
            {axisPopover?.axis === 'x' ? 'Horizontal axis label' : 'Vertical axis label'}
          </Typography>
          <TextField
            size="small"
            fullWidth
            autoFocus
            value={axisDraft}
            onChange={(e) => setAxisDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key !== 'Enter') return;
              if (!axisPopover) return;
              const def = axisPopover.axis === 'x' ? 'x' : 'y';
              const v = axisDraft.trim();
              setEmbed((prev) => ({
                ...prev,
                options: {
                  ...prev.options,
                  [axisPopover.axis === 'x' ? 'xAxisLabel' : 'yAxisLabel']:
                    v === '' || v === def ? undefined : v,
                },
              }));
              setAxisPopover(null);
            }}
          />
          <Stack direction="row" justifyContent="flex-end" spacing={1} sx={{ mt: 1.5 }}>
            <Button size="small" onClick={() => setAxisPopover(null)}>
              Cancel
            </Button>
            <Button
              size="small"
              variant="contained"
              onClick={() => {
                if (!axisPopover) return;
                const def = axisPopover.axis === 'x' ? 'x' : 'y';
                const v = axisDraft.trim();
                setEmbed((prev) => ({
                  ...prev,
                  options: {
                    ...prev.options,
                    [axisPopover.axis === 'x' ? 'xAxisLabel' : 'yAxisLabel']:
                      v === '' || v === def ? undefined : v,
                  },
                }));
                setAxisPopover(null);
              }}
            >
              OK
            </Button>
          </Stack>
        </Paper>
      </Popover>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GraphEmbedDialog;
