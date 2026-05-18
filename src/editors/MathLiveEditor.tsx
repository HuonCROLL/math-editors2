import React, { useEffect, useRef, useState } from 'react';
import { Box, Tooltip } from '@mui/material';

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
  minWidthPx = 220,
  minWidthPercent = 55,
  minHeightPx = 48,
  maxHeightPx = 120,
}) => {
  const mathFieldRef = useRef<MathfieldElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const panelWrapperRef = useRef<HTMLDivElement | null>(null);
  const insertButtonRef = useRef<HTMLButtonElement | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [mathFieldWidth, setMathFieldWidth] = useState<number | null>(null);
  const estimatedContentWidth = Math.max(minWidthPx, Math.min(640, 120 + (value ?? '').length * 11));
  const resolvedMathFieldWidth = mathFieldWidth
    ? Math.min(mathFieldWidth, estimatedContentWidth)
    : estimatedContentWidth;

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
      const containerWidth = container.clientWidth;
      const minEditorWidth = Math.max(minWidthPx, Math.round((containerWidth * minWidthPercent) / 100));
      const available = Math.min(Math.max(minEditorWidth, containerWidth), containerWidth);
      setMathFieldWidth(available);
    };

    updateEditorWidth();

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', updateEditorWidth);
      return () => window.removeEventListener('resize', updateEditorWidth);
    }

    const resizeObserver = new ResizeObserver(() => updateEditorWidth());
    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, [minWidthPercent, minWidthPx]);

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

    const insertMathSpace = (event: KeyboardEvent) => {
      if (event.key !== ' ' || event.ctrlKey || event.metaKey || event.altKey) return;
      event.preventDefault();
      (mathField as any).insert?.('\\;') ?? (mathField as any).executeCommand?.(['insert', '\\;']);
    };
    const handleInput = () => {
      onChange(mathField.value ?? '');
    };

    mathField.addEventListener('keydown', insertMathSpace);
    mathField.addEventListener('input', handleInput);
    return () => {
      mathField.removeEventListener('keydown', insertMathSpace);
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
      }}
    >
      <style>{`
        .mathlive-editor-standalone::part(virtual-keyboard-toggle) {
          display: none;
        }
        .mathlive-editor-standalone::part(menu-toggle) {
          display: none;
        }
        math-field.mathlive-editor-standalone {
          color-scheme: light;
          --selection-background-color: hsl(210, 65%, 88%);
          --contains-highlight-background-color: hsl(210, 40%, 94%);
          --selection-color: #111827;
          vertical-align: middle;
        }
        math-field.mathlive-editor-standalone::part(content) {
          align-items: center;
        }
      `}</style>

      <Box
        sx={{
          position: 'relative',
          width: `${resolvedMathFieldWidth}px`,
          maxWidth: '100%',
          minWidth: `${minWidthPx}px`,
          flex: '0 1 auto',
        }}
      >
        <math-field
          ref={mathFieldRef as any}
          className="mathlive-editor-standalone"
          data-math-virtual-keyboard-policy="manual"
          style={{
            display: 'block',
            boxSizing: 'border-box',
            fontSize: '1.25rem',
            width: '100%',
            minHeight: `${minHeightPx}px`,
            maxHeight: `${maxHeightPx}px`,
            border: '1px solid #ccc',
            borderRadius: 8,
            padding: '6px 48px 6px 10px',
            overflowX: 'auto',
            overflowY: 'auto',
          }}
        />

        <Tooltip title="Insert equation symbols">
          <Box
            component="button"
            ref={insertButtonRef}
            type="button"
            aria-label="Insert symbols"
            onMouseDown={(event) => {
              event.preventDefault();
              event.stopPropagation();
            }}
            onClick={() => setPanelOpen((open) => !open)}
            sx={{
              position: 'absolute',
              right: 6,
              top: '50%',
              transform: 'translateY(-50%)',
              border: 0,
              borderRadius: '6px',
              px: 0.75,
              py: 0.25,
              bgcolor: panelOpen ? 'rgba(25, 118, 210, 0.10)' : 'transparent',
              color: panelOpen ? 'primary.main' : 'text.secondary',
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontSize: '0.9rem',
              fontWeight: 700,
              fontStyle: 'normal',
              lineHeight: 1.2,
              '&:hover': { bgcolor: 'action.hover' },
            }}
          >
            f(x)
          </Box>
        </Tooltip>

        {panelOpen && (
          <Box
            ref={panelWrapperRef}
            sx={{
              position: 'absolute',
              zIndex: 1600,
              top: 'calc(100% + 8px)',
              left: 0,
              width: '100%',
              minWidth: 280,
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
