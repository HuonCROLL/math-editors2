import { InputRule } from '@tiptap/core';
import { InlineMath } from '@tiptap/extension-mathematics';
import katex from 'katex';
import type { KatexOptions } from 'katex';

// Ensure MathLive web component is registered
import 'mathlive';

/**
 * InlineMath extension with inline MathLive editing on click.
 * Renders with KaTeX when not focused; swaps to MathLive when clicked for editing.
 */
export const InlineMathWithMathLive = InlineMath.extend({
  addOptions() {
    return {
      ...this.parent?.(),
      placeholderLatex: undefined as string | undefined,
    };
  },

  addInputRules() {
    const parentRules =
      (this.parent?.() as { addInputRules?: () => InputRule[] } | undefined)?.addInputRules?.() ?? [];

    const inlineDollarRule = new InputRule({
      find: /\$(?!\$)([^$]+?)\$(?!\$)$/,
      handler: ({ range, match, commands }) => {
        const latex = (match[1] || '').trim();
        if (!latex) return null;
        commands.insertContentAt(range, {
          type: this.name,
          attrs: { latex },
        });
        return null;
      },
    });

    return [inlineDollarRule, ...parentRules];
  },

  addNodeView() {
    const { katexOptions } = this.options;
    const placeholderLatex = (this.options as { placeholderLatex?: string }).placeholderLatex;

    return ({ node, getPos, editor }) => {
      const wrapper = document.createElement('span');
      wrapper.className = 'tiptap-inline-math-wrapper';
      wrapper.dataset.type = 'inline-math';
      if (editor.isEditable) {
        wrapper.style.cursor = 'pointer';
      }

      let isEditing = false;
      let mathField: HTMLElement | null = null;
      let editModePos: number | null = null;
      let panelCleanup: (() => void) | null = null;
      let didInitialSelect = false;
      let suppressBlur = false;

      function renderKaTeX(latex: string) {
        wrapper.innerHTML = '';
        const span = document.createElement('span');
        span.className = 'tiptap-mathematics-render';
        if (placeholderLatex && latex === placeholderLatex) {
          span.classList.add('tiptap-math-placeholder');
        }
        try {
          katex.render(latex || '\\ ', span, {
            ...katexOptions,
            throwOnError: false,
          } as KatexOptions);
        } catch {
          span.textContent = latex || '?';
          span.classList.add('inline-math-error');
        }
        wrapper.appendChild(span);
      }

      function enterEditMode() {
        if (!editor.isEditable || isEditing) return;
        const pos = getPos();
        if (typeof pos !== 'number') return;

        isEditing = true;
        editModePos = pos;
        const latex = node.attrs.latex || '';

        wrapper.innerHTML = '';
        const inlineStyle = document.createElement('style');
        inlineStyle.dataset.inlineMathStyle = 'true';
        inlineStyle.textContent = `
          .tiptap-inline-math-wrapper math-field::part(virtual-keyboard-toggle) {
            display: none;
          }
          .tiptap-inline-math-wrapper math-field::part(menu-toggle) {
            display: none;
          }
        `;
        wrapper.appendChild(inlineStyle);
        const mf = document.createElement('math-field');
        (mf as any).value = latex;
        mf.setAttribute('data-math-virtual-keyboard-policy', 'manual');
        mf.style.cssText = `
          display: inline-block;
          min-width: 60px;
          font-size: 1em;
          padding: 2px 6px;
          border: 1px solid #1976d2;
          border-radius: 4px;
          background: #fff;
        `;

        const finishEdit = () => {
          if (!isEditing) return;
          const posToUse = editModePos;
          const newLatex = ((mf as any).value as string) || '';
          isEditing = false;
          editModePos = null;
          didInitialSelect = false;

          if (panelCleanup) {
            panelCleanup();
            panelCleanup = null;
          }

          // Restore KaTeX display immediately so DOM is valid before any async work
          renderKaTeX(newLatex);
          mf.remove();
          mathField = null;

          // Defer doc update to next tick - avoids ProseMirror reconciling during blur
          setTimeout(() => {
            if (typeof posToUse !== 'number') return;
            const node = editor.state.doc.nodeAt(posToUse);
            if (!node || node.type.name !== 'inlineMath') return;

            const from = posToUse;
            const to = from + node.nodeSize;
            const tr = editor.state.tr.replaceWith(from, to, node.type.create({ latex: newLatex }));
            editor.view.dispatch(tr);
            editor.commands.focus();
          }, 10);
        };

        mf.addEventListener('blur', (e: FocusEvent) => {
          if (suppressBlur) return;
          // Don't close when clicking a panel button (focus moves to panel)
          if (panel.contains((e.relatedTarget as Node) || null)) return;
          finishEdit();
        });
        mf.addEventListener('keydown', (e: KeyboardEvent) => {
          if (e.key === 'Escape') {
            e.preventDefault();
            (mf as any).value = node.attrs.latex || '';
            mf.blur();
            return;
          }
          // Single input replaces placeholder
          if (placeholderLatex && (mf as any).value === placeholderLatex) {
            if (e.key === 'Backspace' || e.key === 'Delete') {
              e.preventDefault();
              (mf as any).value = '';
              return;
            }
            if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
              e.preventDefault();
              (mf as any).value = '';
              try {
                (mf as any).insert?.(e.key) ?? (mf as any).executeCommand?.(['insert', e.key]);
              } catch (_) {}
              return;
            }
          }
        });

        // Equation insert panel (floats above content, does not disrupt flow)
        const panel = document.createElement('div');
        panel.className = 'inline-math-insert-panel';
        panel.style.cssText = `
          position: fixed;
          z-index: 9999;
          min-width: 280px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding: 6px;
          background: #fff;
          border-radius: 6px;
          border: 1px solid #e0e0e0;
          box-shadow: 0 2px 12px rgba(0,0,0,0.15);
        `;

        const insertLatex = (latex: string) => {
          try {
            if (typeof (mf as any).insert === 'function') {
              (mf as any).insert(latex);
            } else {
              (mf as any).executeCommand?.(['insert', latex]);
            }
            (mf as any).focus();
          } catch (_) {}
        };

        const btnStyle = `
          min-width: 44px;
          height: 28px;
          padding: 0 8px;
          font-size: 13px;
          border: 1px solid #ccc;
          border-radius: 4px;
          background: #fff;
          cursor: pointer;
          white-space: nowrap;
        `;

        const snippets: { label: string; latex: string }[] = [
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

        const snippetsGrid = document.createElement('div');
        snippetsGrid.style.cssText = 'display: grid; grid-template-columns: repeat(5, minmax(44px, 1fr)); gap: 4px;';
        snippets.forEach(({ label, latex }) => {
          const btn = document.createElement('button');
          btn.textContent = label;
          btn.type = 'button';
          btn.style.cssText = btnStyle;
          btn.addEventListener('mousedown', (e) => {
            e.preventDefault();
            e.stopPropagation();
            insertLatex(latex);
          });
          snippetsGrid.appendChild(btn);
        });
        panel.appendChild(snippetsGrid);

        // Expandable tabs section
        const TRIGONOMETRY: { label: string; latex: string }[] = [
          { label: 'sin', latex: '\\sin' }, { label: 'cos', latex: '\\cos' },
          { label: 'tan', latex: '\\tan' }, { label: 'cot', latex: '\\cot' },
          { label: 'sec', latex: '\\sec' }, { label: 'csc', latex: '\\csc' },
          { label: 'sin⁻¹', latex: '\\arcsin' }, { label: 'cos⁻¹', latex: '\\arccos' },
          { label: 'tan⁻¹', latex: '\\arctan' }, { label: 'sinh', latex: '\\sinh' },
          { label: 'cosh', latex: '\\cosh' }, { label: '°', latex: '\\degree' },
        ];
        const CALCULUS: { label: string; latex: string }[] = [
          { label: 'd/dx', latex: '\\frac{d}{dx}' }, { label: '∂/∂x', latex: '\\frac{\\partial}{\\partial x}' },
          { label: '∫', latex: '\\int' }, { label: '∫∫', latex: '\\iint' },
          { label: '∬∬', latex: '\\iiint' }, { label: '∏', latex: '\\prod_{i=1}^{n}' },
          { label: 'lim', latex: '\\lim_{x \\to \\infty}' }, { label: '∫_a^b', latex: '\\int_{a}^{b}' },
          { label: 'log', latex: '\\log' }, { label: 'ln', latex: '\\ln' },
          { label: 'exp', latex: '\\exp' },
        ];
        const GREEK: { label: string; latex: string }[] = [
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
        const SYMBOLS: { label: string; latex: string }[] = [
          { label: '>', latex: '>' }, { label: '<', latex: '<' },
          { label: '≈', latex: '\\approx' }, { label: '⊥', latex: '\\perp' },
          { label: '∥', latex: '\\parallel' }, { label: '△', latex: '\\triangle' },
          { label: '∠', latex: '\\angle' }, { label: '∪', latex: '\\cup' },
          { label: '∩', latex: '\\cap' },
        ];
        const ACCENTS: { label: string; latex: string }[] = [
          { label: 'x̂', latex: '\\hat{}' }, { label: 'x̄', latex: '\\bar{}' },
          { label: 'ẋ', latex: '\\dot{}' }, { label: 'ẍ', latex: '\\ddot{}' },
          { label: 'x̃', latex: '\\tilde{}' }, { label: 'x⃗', latex: '\\vec{}' },
          { label: 'overline', latex: '\\overline{}' }, { label: 'underline', latex: '\\underline{}' },
          { label: '^{}', latex: '^{}' }, { label: '_{}', latex: '_{}' },
          { label: 'x²', latex: '^{2}' }, { label: 'x₁', latex: '_{1}' },
        ];
        const MATRICES: { label: string; latex: string }[] = [
          { label: '( )', latex: '\\begin{pmatrix} \\\\ \\end{pmatrix}' },
          { label: '[ ]', latex: '\\begin{bmatrix} \\\\ \\end{bmatrix}' },
          { label: '{ }', latex: '\\begin{Bmatrix} \\\\ \\end{Bmatrix}' },
          { label: '| |', latex: '\\begin{vmatrix} \\\\ \\end{vmatrix}' },
          { label: '2×2', latex: '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}' },
          { label: '⟨x⟩', latex: '\\langle \\rangle' },
          { label: '→', latex: '\\vec{v}' }, { label: '⟶', latex: '\\overrightarrow{}' },
          { label: '|x|', latex: '|\\mathbf{x}|' },
        ];

        const CATEGORIES: { label: string; snippets: { label: string; latex: string }[] }[] = [
          { label: 'Trig', snippets: TRIGONOMETRY },
          { label: 'Calculus', snippets: CALCULUS },
          { label: 'Greek', snippets: GREEK },
          { label: 'Symbols', snippets: SYMBOLS },
          { label: 'Accents', snippets: ACCENTS },
          { label: 'Matrices', snippets: MATRICES },
        ];

        const expandable = document.createElement('div');
        expandable.style.cssText = 'display: none; flex-direction: column; gap: 4px;';
        const tabBar = document.createElement('div');
        tabBar.style.cssText = 'display: flex; gap: 2px; flex-wrap: wrap;';
        const tabContent = document.createElement('div');
        tabContent.style.cssText = 'display: grid; grid-template-columns: repeat(5, minmax(44px, 1fr)); gap: 4px; max-height: 120px; overflow-y: auto;';

        const renderTabContent = (index: number) => {
          tabContent.innerHTML = '';
          const cat = CATEGORIES[index];
          if (!cat) return;
          cat.snippets.forEach(({ label, latex }) => {
            const b = document.createElement('button');
            b.textContent = label;
            b.type = 'button';
            b.style.cssText = btnStyle;
            b.addEventListener('mousedown', (e) => {
              e.preventDefault();
              e.stopPropagation();
              insertLatex(latex);
            });
            tabContent.appendChild(b);
          });
        };

        CATEGORIES.forEach((cat, i) => {
          const tabBtn = document.createElement('button');
          tabBtn.textContent = cat.label;
          tabBtn.type = 'button';
          tabBtn.style.cssText = 'font-size: 11px; padding: 2px 6px; border: 1px solid #999; border-radius: 3px; background: #e8e8e8; cursor: pointer;';
          tabBtn.addEventListener('mousedown', (e) => {
            e.preventDefault();
            e.stopPropagation();
            CATEGORIES.forEach((_, j) => {
              (tabBar.children[j] as HTMLElement).style.background = j === i ? '#1976d2' : '#e8e8e8';
              (tabBar.children[j] as HTMLElement).style.color = j === i ? '#fff' : 'inherit';
            });
            renderTabContent(i);
          });
          tabBar.appendChild(tabBtn);
        });
        renderTabContent(0);
        (tabBar.children[0] as HTMLElement).style.background = '#1976d2';
        (tabBar.children[0] as HTMLElement).style.color = '#fff';

        expandable.appendChild(tabBar);
        expandable.appendChild(tabContent);

        const plusBar = document.createElement('button');
        plusBar.textContent = '+';
        plusBar.type = 'button';
        plusBar.title = 'More symbols';
        plusBar.style.cssText = `
          width: 100%;
          height: 24px;
          font-size: 16px;
          font-weight: bold;
          border: 1px dashed #999;
          border-radius: 4px;
          background: #eee;
          cursor: pointer;
          color: #666;
        `;
        plusBar.addEventListener('mousedown', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const shown = expandable.style.display === 'flex';
          expandable.style.display = shown ? 'none' : 'flex';
          plusBar.textContent = shown ? '+' : '−';
        });

        panel.appendChild(plusBar);
        panel.appendChild(expandable);

        const editRow = document.createElement('div');
        editRow.style.cssText = 'display: inline;';
        editRow.appendChild(mf);
        wrapper.appendChild(editRow);
        document.body.appendChild(panel);

        const positionPanel = () => {
          const rect = mf.getBoundingClientRect();
          const panelRect = panel.getBoundingClientRect();
          const margin = 8;
          const viewportWidth = window.innerWidth;
          const viewportHeight = window.innerHeight;

          let left = rect.right + margin;
          if (left + panelRect.width > viewportWidth - margin) {
            left = rect.left - panelRect.width - margin;
          }
          left = Math.max(margin, Math.min(left, viewportWidth - panelRect.width - margin));

          let top = rect.top;
          if (top + panelRect.height > viewportHeight - margin) {
            top = viewportHeight - panelRect.height - margin;
          }
          top = Math.max(margin, top);

          panel.style.left = `${left}px`;
          panel.style.top = `${top}px`;
        };

        const scrollParent = wrapper.closest('.tiptap-editor') as HTMLElement | null;
        const handleReposition = () => positionPanel();
        scrollParent?.addEventListener('scroll', handleReposition);
        window.addEventListener('scroll', handleReposition, true);
        window.addEventListener('resize', handleReposition);
        mf.addEventListener('input', handleReposition);

        const resizeObserver =
          typeof ResizeObserver !== 'undefined'
            ? new ResizeObserver(() => positionPanel())
            : null;
        resizeObserver?.observe(mf);

        positionPanel();
        requestAnimationFrame(positionPanel);
        panelCleanup = () => {
          panel.remove();
          scrollParent?.removeEventListener('scroll', handleReposition);
          window.removeEventListener('scroll', handleReposition, true);
          window.removeEventListener('resize', handleReposition);
          mf.removeEventListener('input', handleReposition);
          resizeObserver?.disconnect();
        };
        mathField = mf;
        (mf as any).focus();
        // Select all so user can immediately type to replace (especially placeholder)
        if (!didInitialSelect) {
          didInitialSelect = true;
          requestAnimationFrame(() => {
            try { (mf as any).executeCommand?.('selectAll'); } catch (_) {}
          });
        }
      }

      function handleClick(e: MouseEvent) {
        if (!editor.isEditable) return;
        e.preventDefault();
        e.stopPropagation();
        if (!isEditing) {
          enterEditMode();
        }
      }

      wrapper.addEventListener('click', handleClick);
      renderKaTeX(node.attrs.latex);

      return {
        dom: wrapper,
        stopEvent() {
          return isEditing; // When MathLive is focused, don't let ProseMirror handle any events
        },
        ignoreMutation() {
          return true; // We manage our own DOM; prevent ProseMirror from reconciling
        },
        update(updatedNode) {
          if (node.attrs.latex !== updatedNode.attrs.latex && !isEditing) {
            node = updatedNode;
            renderKaTeX(updatedNode.attrs.latex);
          }
          return true;
        },
        destroy() {
          wrapper.removeEventListener('click', handleClick);
          mathField?.removeEventListener('blur', () => {});
        },
      };
    };
  },
});
