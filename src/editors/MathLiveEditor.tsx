import React, { useEffect, useRef, useState } from 'react';

// 🔥 This is the important part: side-effect import so the web component is defined
import 'mathlive';
import type { MathfieldElement } from 'mathlive';
import { IconButton, Tooltip, Box } from '@mui/material';
import EquationInsertPanel from '../components/EquationInsertPanel.js';

interface Props {
  value: string;
  onChange: (latex: string) => void;
}

const MathLiveEditor: React.FC<Props> = ({ value, onChange }) => {
  const mathFieldRef = useRef<MathfieldElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);

  useEffect(() => {
    if (!panelOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      const el = containerRef.current;
      if (el && !el.contains(e.target as Node)) {
        setPanelOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [panelOpen]);

  useEffect(() => {
    const el = mathFieldRef.current;
    if (!el) return;

    // keep MathLive field in sync with React state
    const nextVal = value ?? '';
    if (el.value !== nextVal) {
      el.value = nextVal;
    }

    const handleInput = () => {
      onChange(el.value ?? '');
    };

    el.addEventListener('input', handleInput);
    return () => {
      el.removeEventListener('input', handleInput);
    };
  }, [value, onChange]);

  return (
    <Box
      ref={containerRef}
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 1,
        width: '100%',
        maxWidth: '100%',
        position: 'relative',
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
      {/* Math field - expands to fill space, overflows when content exceeds */}
      <math-field
        ref={mathFieldRef as any}
        data-math-virtual-keyboard-policy="manual"
        style={{
          flex: '1 1 360px',
          minWidth: 360,
          maxWidth: 'calc(100% - 328px)', // sigma (~40) + gap (8) + panel (280)
          boxSizing: 'border-box',
          fontSize: '1.25rem',
          border: '1px solid #ccc',
          borderRadius: 8,
          padding: '8px',
          overflowX: 'auto',
          overflowY: 'hidden',
        }}
        className="mathlive-editor-standalone"
      />

      {/* Sigma button - opens equation panel (flex-shrink: 0 to keep fixed width) */}
      <Tooltip title="Insert equation symbols">
        <IconButton
          size="small"
          onClick={() => setPanelOpen((o) => !o)}
          sx={{
            flexShrink: 0,
            alignSelf: 'flex-start',
            mt: 0.5,
            bgcolor: panelOpen ? 'action.selected' : 'transparent',
            '&:hover': { bgcolor: 'action.hover' },
          }}
          aria-label="Insert symbols"
        >
          <Box component="span" sx={{ fontSize: '1.25rem', fontWeight: 600 }}>
            Σ
          </Box>
        </IconButton>
      </Tooltip>

      {/* Equation panel - fixed width, to the RIGHT; math-field shrinks to make room */}
      {panelOpen && (
        <Box sx={{ flexShrink: 0 }}>
          <EquationInsertPanel
          mathFieldRef={mathFieldRef}
          open={panelOpen}
          onClose={() => setPanelOpen(false)}
        />
        </Box>
      )}
    </Box>
  );
};

export default MathLiveEditor;
