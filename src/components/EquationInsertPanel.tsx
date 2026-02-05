import React, { useEffect, useState } from 'react';
import type { MathfieldElement } from 'mathlive';

type Snippet = { label: string; latex: string };

const SNIPPETS: Snippet[] = [
  { label: '×', latex: '\\times' },
  { label: '÷', latex: '\\div' },
  { label: 'a/b', latex: '\\frac{a}{b}' },
  { label: '≤', latex: '\\leq' },
  { label: '≥', latex: '\\geq' },
  { label: '√', latex: '\\sqrt{}' },
  { label: '∞', latex: '\\infty' },
  { label: 'Δ', latex: '\\Delta' },
  { label: 'Σ', latex: '\\Sigma' },
  { label: '>', latex: '>' },
  { label: '<', latex: '<' },
  { label: '≈', latex: '\\approx' },
  { label: '⊥', latex: '\\perp' },
  { label: '∥', latex: '\\parallel' },
  { label: '△', latex: '\\triangle' },
  { label: '∠', latex: '\\angle' },
  { label: '∪', latex: '\\cup' },
  { label: '∩', latex: '\\cap' },
  { label: '→', latex: '\\vec{v}' },
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
  { label: '∫', latex: '\\int' }, { label: '∫∫', latex: '\\iint' },
  { label: '∬∬', latex: '\\iiint' }, { label: '∏', latex: '\\prod_{i=1}^{n}' },
  { label: 'lim', latex: '\\lim_{x \\to \\infty}' }, { label: '∫_a^b', latex: '\\int_{a}^{b}' },
  { label: 'log', latex: '\\log' }, { label: 'ln', latex: '\\ln' },
  { label: 'exp', latex: '\\exp' },
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
  { label: 'ℝ', latex: '\\mathbb{R}' }, { label: 'ℕ', latex: '\\mathbb{N}' },
  { label: 'ℤ', latex: '\\mathbb{Z}' },
];

const SYMBOLS: Snippet[] = [
  { label: '>', latex: '>' }, { label: '<', latex: '<' },
  { label: '≈', latex: '\\approx' }, { label: '⊥', latex: '\\perp' },
  { label: '∥', latex: '\\parallel' }, { label: '△', latex: '\\triangle' },
  { label: '∠', latex: '\\angle' }, { label: '∪', latex: '\\cup' },
  { label: '∩', latex: '\\cap' },
];

const ACCENTS: Snippet[] = [
  { label: 'x̂', latex: '\\hat{}' }, { label: 'x̄', latex: '\\bar{}' },
  { label: 'ẋ', latex: '\\dot{}' }, { label: 'ẍ', latex: '\\ddot{}' },
  { label: 'x̃', latex: '\\tilde{}' }, { label: 'x⃗', latex: '\\vec{}' },
  { label: 'overline', latex: '\\overline{}' }, { label: 'underline', latex: '\\underline{}' },
  { label: '^{}', latex: '^{}' }, { label: '_{}', latex: '_{}' },
  { label: 'x²', latex: '^{2}' }, { label: 'x₁', latex: '_{1}' },
];

const MATRICES: Snippet[] = [
  { label: '( )', latex: '\\begin{pmatrix} \\\\ \\end{pmatrix}' },
  { label: '[ ]', latex: '\\begin{bmatrix} \\\\ \\end{bmatrix}' },
  { label: '{ }', latex: '\\begin{Bmatrix} \\\\ \\end{Bmatrix}' },
  { label: '| |', latex: '\\begin{vmatrix} \\\\ \\end{vmatrix}' },
  { label: '2×2', latex: '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}' },
  { label: '⟨x⟩', latex: '\\langle \\rangle' },
  { label: '→', latex: '\\vec{v}' }, { label: '⟶', latex: '\\overrightarrow{}' },
  { label: '|x|', latex: '|\\mathbf{x}|' },
];

const CATEGORIES: { label: string; snippets: Snippet[] }[] = [
  { label: 'Trig', snippets: TRIGONOMETRY },
  { label: 'Calculus', snippets: CALCULUS },
  { label: 'Greek', snippets: GREEK },
  { label: 'Symbols', snippets: SYMBOLS },
  { label: 'Accents', snippets: ACCENTS },
  { label: 'Matrices', snippets: MATRICES },
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
  const [tabIndex, setTabIndex] = useState(0);
  const [expandOpen, setExpandOpen] = useState(false);

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

  const snippets = CATEGORIES[tabIndex]?.snippets ?? [];

  return (
    <div
      className="inline-math-insert-panel"
      style={{
        minWidth: 280,
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        padding: 6,
        background: '#fff',
        borderRadius: 6,
        border: '1px solid #e0e0e0',
        boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
        zIndex: 9999,
      }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          type="button"
          aria-label="Close"
          title="Close"
          style={{
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            fontSize: 16,
            lineHeight: 1,
            padding: 2,
            color: '#666',
          }}
          onMouseDown={(e) => e.preventDefault()}
          onClick={onClose}
        >
          ×
        </button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(44px, 1fr))', gap: 4 }}>
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

      <button
        type="button"
        title="More symbols"
        style={{
          width: '100%',
          height: 24,
          fontSize: 16,
          fontWeight: 'bold',
          border: '1px dashed #999',
          borderRadius: 4,
          background: '#eee',
          cursor: 'pointer',
          color: '#666',
        }}
        onMouseDown={(e) => {
          e.preventDefault();
          setExpandOpen((v) => !v);
        }}
      >
        {expandOpen ? '−' : '+'}
      </button>

      {expandOpen && (
        <>
          <div style={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {CATEGORIES.map((cat, i) => (
              <button
                key={cat.label}
                type="button"
                style={{
                  fontSize: 11,
                  padding: '2px 6px',
                  border: '1px solid #999',
                  borderRadius: 3,
                  background: i === tabIndex ? '#1976d2' : '#e8e8e8',
                  color: i === tabIndex ? '#fff' : 'inherit',
                  cursor: 'pointer',
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  setTabIndex(i);
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, minmax(44px, 1fr))',
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
        </>
      )}
    </div>
  );
}
