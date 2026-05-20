import React, { useCallback, useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import type { GraphEmbed, GraphResponse, GraphTool } from '../types/embeds';
import {
  createGraphBoard,
  destroyBoard,
  syncBoardViewport,
  type JxgBoard,
} from '../utils/graphBoard';
import { graphPreviewKey } from '../utils/graphPreviewKey';

export type GraphAnswerInputProps = {
  embed: GraphEmbed;
  value?: GraphResponse;
  onChange?: (response: GraphResponse) => void;
  height?: number;
  width?: number | string;
  readOnly?: boolean;
};

type DrawState =
  | { tool: 'point' }
  | { tool: 'line'; start: [number, number] | null; previewPoint?: unknown }
  | { tool: 'curve'; points: [number, number][]; drawing: boolean; preview?: unknown };

type JxgPoint = {
  X: () => number;
  Y: () => number;
  on?: (event: string, handler: () => void) => void;
};

function wireDragEmit(el: BoardElement, emit: () => void) {
  for (const id of el.jxgIds) {
    const obj = id as JxgPoint & { point1?: JxgPoint; point2?: JxgPoint };
    obj.on?.('drag', emit);
    obj.on?.('up', emit);
    obj.point1?.on?.('drag', emit);
    obj.point1?.on?.('up', emit);
    obj.point2?.on?.('drag', emit);
    obj.point2?.on?.('up', emit);
  }
}

function getMouseCoords(board: JxgBoard, evt: unknown): [number, number] | null {
  try {
    const coords = board.getUsrCoordsOfMouse(evt as Event);
    if (Array.isArray(coords) && Number.isFinite(coords[0]) && Number.isFinite(coords[1])) {
      return [coords[0], coords[1]];
    }
  } catch {
    // fall through
  }
  return null;
}

function distToSegment(
  px: number,
  py: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): number {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const lenSq = dx * dx + dy * dy;
  if (lenSq === 0) return Math.hypot(px - x1, py - y1);
  let t = ((px - x1) * dx + (py - y1) * dy) / lenSq;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy));
}

function hitTestThreshold(board: JxgBoard): number {
  const bb = board.getBoundingBox();
  const span = Math.max(Math.abs(bb[2] - bb[0]), Math.abs(bb[1] - bb[3]));
  return Math.max(0.35, span * 0.04);
}

function findElementIndexAt(
  elements: BoardElement[],
  board: JxgBoard,
  x: number,
  y: number,
): number {
  const threshold = hitTestThreshold(board);
  for (let i = elements.length - 1; i >= 0; i--) {
    const el = elements[i];
    if (el.kind === 'point' && el.jxgIds[0]) {
      const p = el.jxgIds[0] as { X: () => number; Y: () => number };
      if (Math.hypot(p.X() - x, p.Y() - y) <= threshold) return i;
    } else if (el.kind === 'line' && el.jxgIds[0]) {
      const seg = el.jxgIds[0] as {
        point1: { X: () => number; Y: () => number };
        point2: { X: () => number; Y: () => number };
      };
      if (
        distToSegment(x, y, seg.point1.X(), seg.point1.Y(), seg.point2.X(), seg.point2.Y()) <=
        threshold
      ) {
        return i;
      }
    } else if (el.kind === 'curve' && el.curvePoints?.length) {
      for (const [px, py] of el.curvePoints) {
        if (Math.hypot(px - x, py - y) <= threshold) return i;
      }
      for (let j = 1; j < el.curvePoints.length; j++) {
        const [x1, y1] = el.curvePoints[j - 1];
        const [x2, y2] = el.curvePoints[j];
        if (distToSegment(x, y, x1, y1, x2, y2) <= threshold) return i;
      }
    }
  }
  return -1;
}

type BoardElement = {
  id: string;
  kind: 'point' | 'line' | 'curve';
  jxgIds: unknown[];
  /** Control points for curves created with the curve tool. */
  curvePoints?: [number, number][];
};

function pointsToCurveData(points: [number, number][]): [number[], number[]] {
  return [points.map((p) => p[0]), points.map((p) => p[1])];
}

function createCurveStroke(
  board: JxgBoard,
  points: [number, number][],
  attrs: Record<string, unknown>,
) {
  if (points.length < 2) return null;
  return board.create('curve', pointsToCurveData(points), attrs);
}

const GraphAnswerInput: React.FC<GraphAnswerInputProps> = ({
  embed,
  value,
  onChange,
  height = 360,
  width,
  readOnly = false,
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const boardRef = useRef<JxgBoard | null>(null);
  const lastBoardSizeRef = useRef({ width: 0, height: 0 });
  const elementsRef = useRef<BoardElement[]>([]);
  const historyRef = useRef<GraphResponse[]>([]);
  const [activeTool, setActiveTool] = useState<GraphTool>('point');
  const activeToolRef = useRef<GraphTool>('point');
  const drawStateRef = useRef<DrawState>({ tool: 'point' });
  const valueRef = useRef(value);
  valueRef.current = value;
  const handleBoardDownRef = useRef<(evt: PointerEvent) => void>(() => {});
  const handleBoardUpRef = useRef<() => void>(() => {});
  const handleBoardMoveRef = useRef<(evt: PointerEvent) => void>(() => {});
  const curveDrawingRef = useRef(false);
  const curvePreviewRef = useRef<unknown>(null);
  const embedRef = useRef(embed);
  embedRef.current = embed;
  const embedKey = graphPreviewKey(embed);

  const enabledTools = embed.tools ?? ['point', 'line', 'curve', 'eraser', 'undo', 'reset'];

  const snapToGrid = !!embed.options?.snapToGrid;

  const pointAttrs = useCallback(
    (color: string, size = 4) => ({
      size,
      strokeColor: color,
      fillColor: color,
      fixed: readOnly,
      withLabel: false,
      snapToGrid,
    }),
    [readOnly, snapToGrid],
  );

  const clearCurvePreview = useCallback((board: JxgBoard) => {
    if (!curvePreviewRef.current) return;
    try {
      board.removeObject(curvePreviewRef.current as never);
    } catch {
      // ignore
    }
    curvePreviewRef.current = null;
  }, []);

  const updateCurvePreview = useCallback(
    (board: JxgBoard, points: [number, number][]) => {
      clearCurvePreview(board);
      if (points.length < 2) return;
      curvePreviewRef.current = createCurveStroke(board, points, {
        strokeColor: '#16a34a',
        strokeWidth: 2,
        dash: 2,
      });
    },
    [clearCurvePreview],
  );

  useEffect(() => {
    const board = boardRef.current;
    const prev = drawStateRef.current;
    if (prev.tool === 'line' && prev.previewPoint && board) {
      try {
        board.removeObject(prev.previewPoint as never);
      } catch {
        // ignore
      }
    }
    if (curveDrawingRef.current && board) {
      curveDrawingRef.current = false;
      clearCurvePreview(board);
    }

    activeToolRef.current = activeTool;
    if (activeTool === 'line') {
      drawStateRef.current = { tool: 'line', start: null, previewPoint: undefined };
    } else if (activeTool === 'curve') {
      drawStateRef.current = { tool: 'curve', points: [], drawing: false };
    } else {
      drawStateRef.current = { tool: 'point' };
    }
  }, [activeTool, clearCurvePreview]);

  const emitChange = useCallback(
    (response: GraphResponse) => {
      onChange?.(response);
    },
    [onChange],
  );

  const responseFromElements = useCallback((): GraphResponse => {
    const points: GraphResponse['points'] = [];
    const lines: GraphResponse['lines'] = [];
    const curves: GraphResponse['curves'] = [];

    for (const el of elementsRef.current) {
      const board = boardRef.current;
      if (!board) continue;
      if (el.kind === 'point' && el.jxgIds[0]) {
        const p = el.jxgIds[0] as { X: () => number; Y: () => number };
        points.push({ x: p.X(), y: p.Y() });
      } else if (el.kind === 'line' && el.jxgIds[0]) {
        const seg = el.jxgIds[0] as {
          point1: { X: () => number; Y: () => number };
          point2: { X: () => number; Y: () => number };
        };
        lines.push({
          start: [seg.point1.X(), seg.point1.Y()],
          end: [seg.point2.X(), seg.point2.Y()],
        });
      } else if (el.kind === 'curve' && el.curvePoints?.length) {
        curves.push({ controlPoints: el.curvePoints, interpolation: 'smooth' });
      }
    }

    return { points, lines, curves };
  }, []);

  const registerElement = useCallback(
    (_board: JxgBoard, el: BoardElement) => {
      elementsRef.current.push(el);
      if (!readOnly) {
        wireDragEmit(el, () => emitChange(responseFromElements()));
      }
    },
    [emitChange, readOnly, responseFromElements],
  );

  const pushHistory = useCallback(() => {
    historyRef.current.push(JSON.parse(JSON.stringify(valueRef.current ?? {})));
    if (historyRef.current.length > 50) historyRef.current.shift();
  }, []);

  const clearBoardElements = useCallback(() => {
    const board = boardRef.current;
    if (!board) return;
    for (const el of elementsRef.current) {
      for (const id of el.jxgIds) {
        try {
          board.removeObject(id as never);
        } catch {
          // ignore
        }
      }
    }
    elementsRef.current = [];
  }, []);

  const restoreFromResponse = useCallback(
    async (response: GraphResponse | undefined) => {
      const board = boardRef.current;
      if (!board) return;
      clearBoardElements();

      for (const pt of response?.points ?? []) {
        const p = board.create('point', [pt.x, pt.y], pointAttrs('#dc2626'));
        registerElement(board, { id: `pt_${Math.random()}`, kind: 'point', jxgIds: [p] });
      }

      for (const line of response?.lines ?? []) {
        const p1 = board.create('point', line.start, pointAttrs('#2563eb', 3));
        const p2 = board.create('point', line.end, pointAttrs('#2563eb', 3));
        const seg = board.create('segment', [p1, p2], {
          strokeColor: '#2563eb',
          strokeWidth: 2,
          fixed: readOnly,
          withLabel: false,
        });
        registerElement(board, {
          id: `ln_${Math.random()}`,
          kind: 'line',
          jxgIds: [seg, p1, p2],
        });
      }

      for (const curve of response?.curves ?? []) {
        const stroke = createCurveStroke(board, curve.controlPoints, {
          strokeColor: '#16a34a',
          strokeWidth: 2,
        });
        if (!stroke) continue;
        registerElement(board, {
          id: `cv_${Math.random()}`,
          kind: 'curve',
          jxgIds: [stroke],
          curvePoints: curve.controlPoints,
        });
      }

    },
    [clearBoardElements, pointAttrs, readOnly, registerElement],
  );

  const boardListenersRef = useRef<{
    onDown: (evt: PointerEvent) => void;
    onUp: () => void;
    onMove: (evt: PointerEvent) => void;
    onDrag: (evt: PointerEvent) => void;
  } | null>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const el = containerRef.current;
    if (!wrapper || !el) return;

    let cancelled = false;
    let resizeRaf = 0;
    const toolbarHeight = readOnly ? 0 : 48;
    const boardHeight = Math.max(120, height - toolbarHeight);
    lastBoardSizeRef.current = { width: 0, height: 0 };

    const applyBoardSize = (width: number, h: number) => {
      const last = lastBoardSizeRef.current;
      if (
        boardRef.current &&
        Math.abs(width - last.width) < 2 &&
        Math.abs(h - last.height) < 2
      ) {
        return;
      }
      lastBoardSizeRef.current = { width, height: h };

      if (boardRef.current) {
        boardRef.current.resizeContainer(width, h);
        syncBoardViewport(
          boardRef.current,
          { ...embedRef.current, mode: 'answer-input' },
          width,
          h,
        );
        boardRef.current.update();
        return;
      }

      createGraphBoard({
        container: el,
        embed: { ...embedRef.current, mode: 'answer-input' },
        width,
        height: h,
      }).then((board) => {
        if (cancelled) {
          destroyBoard(board);
          return;
        }
        boardRef.current = board;
        board.resizeContainer(width, h);
        syncBoardViewport(board, { ...embedRef.current, mode: 'answer-input' }, width, h);
        board.update();

        if (!readOnly) {
          const onDown = (evt: PointerEvent) => handleBoardDownRef.current(evt);
          const onUp = () => handleBoardUpRef.current();
          const onMove = (evt: PointerEvent) => handleBoardMoveRef.current(evt);
          const onDrag = (evt: PointerEvent) => handleBoardMoveRef.current(evt);
          board.on('down', onDown);
          board.on('up', onUp);
          board.on('move', onMove);
          board.on('drag', onDrag);
          boardListenersRef.current = { onDown, onUp, onMove, onDrag };
        }

        void restoreFromResponse(valueRef.current);
      });
    };

    const syncBoardSize = () => {
      if (cancelled) return;
      const width = Math.round(wrapper.clientWidth);
      if (width < 2) return;
      applyBoardSize(width, boardHeight);
    };

    const scheduleSync = () => {
      cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(() => {
        requestAnimationFrame(syncBoardSize);
      });
    };

    scheduleSync();

    const resizeObserver = new ResizeObserver(scheduleSync);
    resizeObserver.observe(wrapper);

    return () => {
      cancelled = true;
      cancelAnimationFrame(resizeRaf);
      resizeObserver.disconnect();
      lastBoardSizeRef.current = { width: 0, height: 0 };
      const board = boardRef.current;
      const listeners = boardListenersRef.current;
      if (board && listeners) {
        board.off('down', listeners.onDown);
        board.off('up', listeners.onUp);
        board.off('move', listeners.onMove);
        board.off('drag', listeners.onDrag);
        boardListenersRef.current = null;
      }
      destroyBoard(board);
      boardRef.current = null;
    };
  }, [embedKey, height, readOnly, restoreFromResponse]);

  useEffect(() => {
    void restoreFromResponse(value);
  }, [value, restoreFromResponse]);

  const snapCoord = useCallback(
    (x: number, y: number): [number, number] => {
      if (!snapToGrid) return [x, y];
      return [Math.round(x), Math.round(y)];
    },
    [snapToGrid],
  );

  const appendCurvePoint = useCallback(
    (board: JxgBoard, state: Extract<DrawState, { tool: 'curve' }>, x: number, y: number) => {
      const [sx, sy] = snapCoord(x, y);
      const last = state.points[state.points.length - 1];
      if (!last || Math.hypot(last[0] - sx, last[1] - sy) > 0.12) {
        state.points.push([sx, sy]);
        updateCurvePreview(board, state.points);
      }
    },
    [snapCoord, updateCurvePreview],
  );

  const finalizeCurve = useCallback(() => {
    const board = boardRef.current;
    const state = drawStateRef.current;
    if (!board || state.tool !== 'curve' || !curveDrawingRef.current) return;

    curveDrawingRef.current = false;
    clearCurvePreview(board);

    if (state.points.length < 2) {
      drawStateRef.current = { tool: 'curve', points: [], drawing: false };
      return;
    }

    pushHistory();
    const stroke = createCurveStroke(board, state.points, {
      strokeColor: '#16a34a',
      strokeWidth: 2,
    });
    if (!stroke) {
      drawStateRef.current = { tool: 'curve', points: [], drawing: false };
      return;
    }
    registerElement(board, {
      id: `cv_${Date.now()}`,
      kind: 'curve',
      jxgIds: [stroke],
      curvePoints: [...state.points],
    });
    drawStateRef.current = { tool: 'curve', points: [], drawing: false };
    emitChange(responseFromElements());
  }, [
    clearCurvePreview,
    emitChange,
    pushHistory,
    registerElement,
    responseFromElements,
  ]);

  const handleBoardDown = useCallback(
    (evt: PointerEvent) => {
      if (readOnly) return;
      const board = boardRef.current;
      if (!board) return;

      const tool = activeToolRef.current;
      const coords = getMouseCoords(board, evt);
      if (!coords) return;
      const [sx, sy] = snapCoord(coords[0], coords[1]);

      if (tool === 'eraser') {
        const index = findElementIndexAt(elementsRef.current, board, sx, sy);
        if (index < 0) return;
        pushHistory();
        const el = elementsRef.current[index];
        for (const id of el.jxgIds) {
          try {
            board.removeObject(id as never);
          } catch {
            // ignore
          }
        }
        elementsRef.current.splice(index, 1);
        emitChange(responseFromElements());
        return;
      }

      if (tool === 'point') {
        pushHistory();
        const p = board.create('point', [sx, sy], pointAttrs('#dc2626'));
        registerElement(board, { id: `pt_${Date.now()}`, kind: 'point', jxgIds: [p] });
        emitChange(responseFromElements());
        return;
      }

      if (tool === 'line') {
        const state = drawStateRef.current;
        if (state.tool !== 'line') {
          drawStateRef.current = { tool: 'line', start: null, previewPoint: undefined };
        }
        const lineState = drawStateRef.current as {
          tool: 'line';
          start: [number, number] | null;
          previewPoint?: unknown;
        };
        if (!lineState.start) {
          lineState.start = [sx, sy];
          lineState.previewPoint = board.create('point', [sx, sy], pointAttrs('#2563eb', 3));
        } else {
          if (lineState.previewPoint) {
            try {
              board.removeObject(lineState.previewPoint as never);
            } catch {
              // ignore
            }
            lineState.previewPoint = undefined;
          }
          pushHistory();
          const p1 = board.create('point', lineState.start, pointAttrs('#2563eb', 3));
          const p2 = board.create('point', [sx, sy], pointAttrs('#2563eb', 3));
          const seg = board.create('segment', [p1, p2], {
            strokeColor: '#2563eb',
            strokeWidth: 2,
            fixed: readOnly,
            withLabel: false,
          });
          registerElement(board, {
            id: `ln_${Date.now()}`,
            kind: 'line',
            jxgIds: [seg, p1, p2],
          });
          lineState.start = null;
          emitChange(responseFromElements());
        }
        return;
      }

      if (tool === 'curve') {
        curveDrawingRef.current = true;
        drawStateRef.current = { tool: 'curve', points: [[sx, sy]], drawing: true };
      }
    },
    [
      emitChange,
      pointAttrs,
      pushHistory,
      readOnly,
      registerElement,
      responseFromElements,
      snapCoord,
    ],
  );

  const handleBoardMove = useCallback(
    (evt: PointerEvent) => {
      if (readOnly || !curveDrawingRef.current) return;
      const state = drawStateRef.current;
      if (state.tool !== 'curve') return;
      const board = boardRef.current;
      if (!board) return;
      const coords = getMouseCoords(board, evt);
      if (!coords) return;
      appendCurvePoint(board, state, coords[0], coords[1]);
    },
    [appendCurvePoint, readOnly],
  );

  const handleBoardUp = useCallback(() => {
    if (readOnly || !curveDrawingRef.current) return;
    finalizeCurve();
  }, [finalizeCurve, readOnly]);

  useEffect(() => {
    if (readOnly) return;

    const onWindowMove = (evt: MouseEvent) => {
      if (!curveDrawingRef.current) return;
      const board = boardRef.current;
      if (!board) return;
      const state = drawStateRef.current;
      if (state.tool !== 'curve') return;
      const coords = getMouseCoords(board, evt);
      if (!coords) return;
      appendCurvePoint(board, state, coords[0], coords[1]);
    };

    const onWindowUp = () => {
      if (!curveDrawingRef.current) return;
      finalizeCurve();
    };

    window.addEventListener('mousemove', onWindowMove);
    window.addEventListener('mouseup', onWindowUp);
    return () => {
      window.removeEventListener('mousemove', onWindowMove);
      window.removeEventListener('mouseup', onWindowUp);
    };
  }, [appendCurvePoint, finalizeCurve, readOnly]);

  const handleEraser = useCallback(() => {
    setActiveTool('eraser');
  }, []);

  const handleUndo = useCallback(() => {
    const prev = historyRef.current.pop();
    if (prev) {
      void restoreFromResponse(prev);
      emitChange(prev);
    }
  }, [emitChange, restoreFromResponse]);

  const handleReset = useCallback(() => {
    pushHistory();
    clearBoardElements();
    emitChange({ points: [], lines: [], curves: [] });
  }, [clearBoardElements, emitChange, pushHistory]);

  handleBoardDownRef.current = handleBoardDown;
  handleBoardUpRef.current = handleBoardUp;
  handleBoardMoveRef.current = handleBoardMove;

  return (
    <Box className="graph-answer-input" sx={{ width: width ?? '100%' }}>
      {!readOnly && (
        <ButtonGroup size="small" sx={{ mb: 1, flexWrap: 'wrap' }}>
          {enabledTools.includes('point') && (
            <Button
              variant={activeTool === 'point' ? 'contained' : 'outlined'}
              onClick={() => setActiveTool('point')}
            >
              Point
            </Button>
          )}
          {enabledTools.includes('line') && (
            <Button
              variant={activeTool === 'line' ? 'contained' : 'outlined'}
              onClick={() => setActiveTool('line')}
            >
              Line
            </Button>
          )}
          {enabledTools.includes('curve') && (
            <Button
              variant={activeTool === 'curve' ? 'contained' : 'outlined'}
              onClick={() => setActiveTool('curve')}
            >
              Curve
            </Button>
          )}
          {enabledTools.includes('eraser') && (
            <Button
              variant={activeTool === 'eraser' ? 'contained' : 'outlined'}
              onClick={handleEraser}
            >
              Eraser
            </Button>
          )}
          {enabledTools.includes('undo') && (
            <Button onClick={handleUndo}>Undo</Button>
          )}
          {enabledTools.includes('reset') && (
            <Button onClick={handleReset} color="warning">
              Reset
            </Button>
          )}
        </ButtonGroup>
      )}
      <Box
        ref={wrapperRef}
        className="graph-answer-input__board-wrap"
        sx={{
          width: '100%',
          height: height - (readOnly ? 0 : 48),
          minHeight: 120,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <Box
          ref={containerRef}
          className="jsxgraph-board-container"
          sx={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}
        />
      </Box>
    </Box>
  );
};

export default GraphAnswerInput;
