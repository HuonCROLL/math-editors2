import React, { useEffect, useState } from 'react';
import type { MathfieldElement } from 'mathlive';

type Snippet = { label: string; latex: string };

const SNIPPETS: Snippet[] = [
  { label: '+', latex: '+' },
  { label: '−', latex: '-' },
  { label: '×', latex: '\\times' },
  { label: 'x²', latex: 'x^{2}' },
  { label: 'xⁿ', latex: 'x^{a}' },
  { label: '÷', latex: '\\div' },
  { label: '√', latex: '\\sqrt{}' },
  { label: 'ⁿ√', latex: '\\sqrt[n]{}' },
  { label: 'a⁄b', latex: '\\frac{a}{b}' },
  { label: 'π', latex: '\\pi' },
  { label: 'θ', latex: '\\theta' },
  { label: '≤', latex: '\\leq' },
  { label: '≥', latex: '\\geq' },
];

const TRIGONOMETRY: Snippet[] = [
  { label: 'sin', latex: '\\sin' }, { label: 'cos', latex: '\\cos' },
  { label: 'tan', latex: '\\tan' }, { label: 'cot', latex: '\\cot' },
  { label: 'sec', latex: '\\sec' }, { label: 'csc', latex: '\\csc' },
  { label: 'sin⁻¹', latex: '\\arcsin' }, { label: 'cos⁻¹', latex: '\\arccos' },
  { label: 'tan⁻¹', latex: '\\arctan' }, { label: 'sinh', latex: '\\sinh' },
  { label: 'cosh', latex: '\\cosh' }, { label: '°', latex: '\\degree' },
];

const CALCULUS: Snippet[] = [
  { label: 'd/dx', latex: '\\frac{d}{dx}' }, { label: '∂/∂x', latex: '\\frac{\\partial}{\\partial x}' },
  { label: '∫', latex: '\\int' }, { label: '∫ₐᵇ', latex: '\\int_{a}^{b}' },
  { label: '[ ]ₐᵇ', latex: '\\left[\\right]_{a}^{b}' }, { label: 'lim', latex: '\\lim_{x \\to \\infty}' },
  { label: 'log₁₀', latex: '\\log_{10}' }, { label: 'logₐ', latex: '\\log_{a}' },
  { label: 'ln', latex: '\\ln' }, { label: 'exp', latex: '\\exp' },
];

const GREEK: Snippet[] = [
  { label: 'α', latex: '\\alpha' }, { label: 'β', latex: '\\beta' },
  { label: 'γ', latex: '\\gamma' }, { label: 'δ', latex: '\\delta' },
  { label: 'ε', latex: '\\varepsilon' }, { label: 'θ', latex: '\\theta' },
  { label: 'λ', latex: '\\lambda' }, { label: 'μ', latex: '\\mu' },
  { label: 'π', latex: '\\pi' }, { label: 'σ', latex: '\\sigma' },
  { label: 'φ', latex: '\\phi' }, { label: 'ω', latex: '\\omega' },
  { label: 'Ω', latex: '\\Omega' }, { label: 'Δ', latex: '\\Delta' },
  { label: 'Σ', latex: '\\Sigma' }, { label: '∞', latex: '\\infty' },
];

const CATEGORIES: { label: string; snippets: Snippet[] }[] = [
  { label: 'Trig', snippets: TRIGONOMETRY },
  { label: 'Calc', snippets: CALCULUS },
  { label: 'Greek', snippets: GREEK },
];

const btnStyle: React.CSSProperties = {
  minWidth: 44,
  height: 28,
  padding: '0 8px',
  fontSize: 13,
  border: '1px solid #ccc',
  borderRadius: 4,
  background: '#fff',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
};

type Props = {
  mathFieldRef: React.RefObject<MathfieldElement | null>;
  open: boolean;
  onClose: () => void;
};

export default function EquationInsertPanel({ mathFieldRef, open, onClose }: Props) {
  const [tabIndex, setTabIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  const insertLatex = (latex: string) => {
    const mf = mathFieldRef.current;
    if (!mf) return;
    try {
      if (typeof (mf as any).insert === 'function') {
        (mf as any).insert(latex);
      } else {
        (mf as any).executeCommand?.(['insert', latex]);
      }
      (mf as any).focus?.();
    } catch (_) {}
  };

  if (!open) return null;

  const snippets = tabIndex === null ? [] : CATEGORIES[tabIndex]?.snippets ?? [];

  return (
    <div
      className="inline-math-insert-panel"
      style={{
        minWidth: 300,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        padding: 8,
        background: '#fff',
        borderRadius: 6,
        border: '1px solid #e0e0e0',
        boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
        zIndex: 9999,
      }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(40px, 1fr))', gap: 4 }}>
        {SNIPPETS.map(({ label, latex }) => (
          <button
            key={`${label}-${latex}`}
            type="button"
            style={btnStyle}
            onMouseDown={(e) => {
              e.preventDefault();
              insertLatex(latex);
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, flexWrap: 'wrap' }}>
        {CATEGORIES.map((cat, i) => (
          <React.Fragment key={cat.label}>
            {i > 0 && <span style={{ color: '#999', fontSize: 12 }}>|</span>}
            <button
              type="button"
              style={{
                fontSize: 12,
                padding: '2px 4px',
                border: 0,
                borderRadius: 3,
                background: i === tabIndex ? 'rgba(25, 118, 210, 0.10)' : 'transparent',
                color: i === tabIndex ? '#1976d2' : '#444',
                cursor: 'pointer',
              }}
              onMouseDown={(e) => {
                e.preventDefault();
                setTabIndex((current) => (current === i ? null : i));
              }}
            >
              {cat.label}
            </button>
          </React.Fragment>
        ))}
      </div>

      {tabIndex !== null && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(6, minmax(40px, 1fr))',
            gap: 4,
            maxHeight: 120,
            overflowY: 'auto',
          }}
        >
          {snippets.map(({ label, latex }) => (
            <button
              key={`${label}-${latex}`}
              type="button"
              style={btnStyle}
              onMouseDown={(e) => {
                e.preventDefault();
                insertLatex(latex);
              }}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
