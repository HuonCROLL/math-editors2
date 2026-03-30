import React, { useEffect, useRef, useState } from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';

import 'mathlive';
import type { MathfieldElement } from 'mathlive';
import EquationInsertPanel from '../components/EquationInsertPanel.js';

interface Props {
  value: string;
  onChange: (latex: string) => void;
  minWidthPx?: number;
  minWidthPercent?: number;
  minHeightPx?: number;
  maxHeightPx?: number;
}

const MathLiveEditor: React.FC<Props> = ({
  value,
  onChange,
  minWidthPx = 280,
  minWidthPercent = 70,
  minHeightPx = 120,
  maxHeightPx = 320,
}) => {
  const mathFieldRef = useRef<MathfieldElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const panelWrapperRef = useRef<HTMLDivElement | null>(null);
  const sigmaButtonRef = useRef<HTMLButtonElement | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [panelPlacement, setPanelPlacement] = useState<'right' | 'left' | 'bottom'>('right');
  const [panelTopOffset, setPanelTopOffset] = useState(0);
  const [panelBottomTopOffset, setPanelBottomTopOffset] = useState(0);
  const [panelBottomRightOffset, setPanelBottomRightOffset] = useState(0);
  const [mathFieldWidth, setMathFieldWidth] = useState<number | null>(null);

  useEffect(() => {
    if (!panelOpen) return undefined;
    const handleClickOutside = (event: MouseEvent) => {
      const container = containerRef.current;
      if (container && !container.contains(event.target as Node)) {
        setPanelOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [panelOpen]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const updateEditorWidth = () => {
      const sigmaButton = sigmaButtonRef.current;
      const containerWidth = container.clientWidth;
      const sigmaWidth = sigmaButton?.offsetWidth ?? 32;
      const gap = 8;
      const minEditorWidth = Math.max(minWidthPx, Math.round((containerWidth * minWidthPercent) / 100));
      const available = Math.max(minEditorWidth, containerWidth - sigmaWidth - gap);
      setMathFieldWidth(available);
    };

    updateEditorWidth();

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', updateEditorWidth);
      return () => window.removeEventListener('resize', updateEditorWidth);
    }

    const resizeObserver = new ResizeObserver(() => updateEditorWidth());
    resizeObserver.observe(container);
    if (sigmaButtonRef.current) {
      resizeObserver.observe(sigmaButtonRef.current);
    }
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    if (!panelOpen) return undefined;

    const updatePlacement = () => {
      const container = containerRef.current;
      const sigmaButton = sigmaButtonRef.current;
      const panelWrapper = panelWrapperRef.current;
      if (!container || !sigmaButton) return;

      const viewportPadding = 8;
      const gap = 8;
      const panelWidth = panelWrapper?.getBoundingClientRect().width ?? 280;
      const sigmaRect = sigmaButton.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const rightEdge = sigmaRect.right + gap + panelWidth;
      const hitsParentRightEdge = rightEdge >= containerRect.right - viewportPadding;
      const fitsRightInViewport = rightEdge <= window.innerWidth - viewportPadding;

      if (!hitsParentRightEdge && fitsRightInViewport) {
        setPanelPlacement('right');
      } else if (hitsParentRightEdge) {
        setPanelPlacement('bottom');
      } else {
        setPanelPlacement('left');
      }

      setPanelTopOffset(containerRect.top - sigmaRect.top);
      setPanelBottomTopOffset(containerRect.bottom - sigmaRect.top + gap);
      setPanelBottomRightOffset(containerRect.right - sigmaRect.left - panelWidth);
    };

    let raf1 = 0;
    let raf2 = 0;
    updatePlacement();
    raf1 = window.requestAnimationFrame(() => {
      updatePlacement();
      raf2 = window.requestAnimationFrame(updatePlacement);
    });

    window.addEventListener('resize', updatePlacement);

    let resizeObserver: ResizeObserver | undefined;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => updatePlacement());
      if (containerRef.current) resizeObserver.observe(containerRef.current);
      if (sigmaButtonRef.current) resizeObserver.observe(sigmaButtonRef.current);
      if (panelWrapperRef.current) resizeObserver.observe(panelWrapperRef.current);
    }

    return () => {
      window.removeEventListener('resize', updatePlacement);
      window.cancelAnimationFrame(raf1);
      window.cancelAnimationFrame(raf2);
      resizeObserver?.disconnect();
    };
  }, [panelOpen, value, mathFieldWidth]);

  useEffect(() => {
    const mathField = mathFieldRef.current;
    if (!mathField) return;

    const nextVal = value ?? '';
    if (mathField.value !== nextVal) {
      mathField.value = nextVal;
    }
  }, [value]);

  useEffect(() => {
    const mathField = mathFieldRef.current;
    if (!mathField) return undefined;

    const handleInput = () => {
      onChange(mathField.value ?? '');
    };

    mathField.addEventListener('input', handleInput);
    return () => {
      mathField.removeEventListener('input', handleInput);
    };
  }, [onChange]);

  return (
    <Box
      ref={containerRef}
      sx={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        maxWidth: '100%',
        gap: 1,
      }}
    >
      <style>{`
        .mathlive-editor-standalone::part(virtual-keyboard-toggle) {
          display: none;
        }
        .mathlive-editor-standalone::part(menu-toggle) {
          display: none;
        }
      `}</style>

      <math-field
        ref={mathFieldRef as any}
        className="mathlive-editor-standalone"
        data-math-virtual-keyboard-policy="manual"
        style={{
          display: 'block',
          boxSizing: 'border-box',
          fontSize: '1.25rem',
          width: 'fit-content',
          maxWidth: mathFieldWidth ? `${mathFieldWidth}px` : '100%',
          minWidth: minWidthPx,
          flex: '0 1 auto',
          minHeight: `${minHeightPx}px`,
          maxHeight: `${maxHeightPx}px`,
          border: '1px solid #ccc',
          borderRadius: 8,
          padding: '8px',
          overflowX: 'auto',
          overflowY: 'auto',
        }}
      />

      <Box sx={{ position: 'relative', flexShrink: 0, display: 'flex', alignItems: 'center' }}>
        <Tooltip title="Insert equation symbols">
          <IconButton
            ref={sigmaButtonRef}
            size="small"
            onClick={() => setPanelOpen((open) => !open)}
            aria-label="Insert symbols"
            sx={{
              bgcolor: panelOpen ? 'action.selected' : 'transparent',
              '&:hover': { bgcolor: 'action.hover' },
            }}
          >
            <Box component="span" sx={{ fontSize: '1.25rem', fontWeight: 600 }}>
              Σ
            </Box>
          </IconButton>
        </Tooltip>

        {panelOpen && (
          <Box
            ref={panelWrapperRef}
            sx={{
              position: 'absolute',
              zIndex: 1600,
              ...(panelPlacement === 'bottom'
                ? {
                    top: panelBottomTopOffset,
                    left: panelBottomRightOffset,
                  }
                : {
                    top: panelTopOffset,
                    ...(panelPlacement === 'right'
                      ? {
                          left: 'calc(100% + 8px)',
                        }
                      : {
                          right: 'calc(100% + 8px)',
                        }),
                  }),
            }}
          >
            <EquationInsertPanel
              mathFieldRef={mathFieldRef}
              open={panelOpen}
              onClose={() => setPanelOpen(false)}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default MathLiveEditor;
