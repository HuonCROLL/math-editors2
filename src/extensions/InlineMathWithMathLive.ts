import katex from 'katex';
import type { KatexOptions } from 'katex';
import { InlineMathWithParens } from './InlineMathWithParens';

// Ensure MathLive web component is registered
import 'mathlive';

/**
 * InlineMath extension with inline MathLive editing on click.
 * Renders with KaTeX when not focused; swaps to MathLive when clicked for editing.
 */
export const InlineMathWithMathLive = InlineMathWithParens.extend({
  addOptions() {
    return {
      ...this.parent?.(),
      placeholderLatex: undefined as string | undefined,
    };
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
      let pendingFinishTimeout: number | null = null;

      function renderKaTeX(latex: string) {
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
        // Remove existing children individually instead of innerHTML='' to avoid
        // synchronously triggering MathLive's disconnectedCallback (which nulls
        // internal refs) before MathLive's async ResizeObserver cleanup runs.
        Array.from(wrapper.childNodes).forEach(child => child.remove());
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

          // MathLive performs ResizeObserver cleanup during/just after blur. Keep the
          // math-field mounted until that cycle has finished, then let ProseMirror's
          // node update replace it with the KaTeX render.
          pendingFinishTimeout = window.setTimeout(() => {
            pendingFinishTimeout = null;
            mathField = null;

            if (typeof posToUse !== 'number') return;
            const currentNode = editor.state.doc.nodeAt(posToUse);
            if (!currentNode || currentNode.type.name !== 'inlineMath') {
              renderKaTeX(newLatex);
              return;
            }

            const from = posToUse;
            const to = from + currentNode.nodeSize;
            const tr = editor.state.tr.replaceWith(from, to, currentNode.type.create({ latex: newLatex }));
            editor.view.dispatch(tr);
            editor.commands.focus();
          }, 50);
        };

        // Keep pointer events on the math-field from bubbling to the wrapper handler below.
        mf.addEventListener('pointerdown', (e) => {
          e.stopPropagation();
        });

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
          min-width: 300px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 8px;
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
          min-width: 40px;
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
          { label: '+', latex: '+' },
          { label: '−', latex: '-' },
          { label: '×', latex: '\\times' },
          { label: 'x²', latex: 'x^{2}' },
          { label: 'xⁿ', latex: 'x^{a}' },
          { label: '÷', latex: '\\div' },
          { label: '√', latex: '\\sqrt{}' },
          { label: 'a⁄b', latex: '\\frac{a}{b}' },
          { label: 'π', latex: '\\pi' },
          { label: 'θ', latex: '\\theta' },
          { label: 'Δ', latex: '\\Delta' },
          { label: 'Σ', latex: '\\Sigma' },
          { label: '≤', latex: '\\leq' },
          { label: '≥', latex: '\\geq' },
        ];

        const snippetsGrid = document.createElement('div');
        snippetsGrid.style.cssText = 'display: grid; grid-template-columns: repeat(6, minmax(40px, 1fr)); gap: 4px;';
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
          { label: '∫', latex: '\\int' }, { label: '∫ₐᵇ', latex: '\\int_{a}^{b}' },
          { label: '[ ]ₐᵇ', latex: '\\left[\\right]_{a}^{b}' }, { label: 'lim', latex: '\\lim_{x \\to \\infty}' },
          { label: 'log₁₀', latex: '\\log_{10}' }, { label: 'logₐ', latex: '\\log_{a}' },
          { label: 'ln', latex: '\\ln' }, { label: 'exp', latex: '\\exp' },
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
        const CHEMISTRY: { label: string; latex: string }[] = [
          { label: 'H₂O', latex: '\\mathrm{H_2O}' }, { label: 'CO₂', latex: '\\mathrm{CO_2}' },
          { label: 'NaCl', latex: '\\mathrm{NaCl}' }, { label: 'O₂', latex: '\\mathrm{O_2}' },
          { label: '→', latex: '\\rightarrow' }, { label: '⇌', latex: '\\rightleftharpoons' },
          { label: 'ΔH', latex: '\\Delta H' }, { label: 'mol', latex: '\\mathrm{mol}' },
          { label: 'aq', latex: '\\mathrm{(aq)}' }, { label: 's', latex: '\\mathrm{(s)}' },
          { label: 'l', latex: '\\mathrm{(l)}' }, { label: 'g', latex: '\\mathrm{(g)}' },
        ];

        const CATEGORIES: { label: string; snippets: { label: string; latex: string }[] }[] = [
          { label: 'Trig', snippets: TRIGONOMETRY },
          { label: 'Calc', snippets: CALCULUS },
          { label: 'Greek', snippets: GREEK },
          { label: 'Chem', snippets: CHEMISTRY },
        ];

        const expandable = document.createElement('div');
        expandable.style.cssText = 'display: flex; flex-direction: column; gap: 6px;';
        const tabBar = document.createElement('div');
        tabBar.style.cssText = 'display: flex; align-items: center; justify-content: center; gap: 6px; flex-wrap: wrap;';
        const tabContent = document.createElement('div');
        tabContent.style.cssText = 'display: none; grid-template-columns: repeat(6, minmax(40px, 1fr)); gap: 4px; max-height: 120px; overflow-y: auto;';
        let activeCategoryIndex: number | null = null;

        const renderTabContent = (index: number | null) => {
          tabContent.innerHTML = '';
          if (index === null) {
            tabContent.style.display = 'none';
            return;
          }
          const cat = CATEGORIES[index];
          if (!cat) return;
          tabContent.style.display = 'grid';
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
          if (i > 0) {
            const separator = document.createElement('span');
            separator.textContent = '|';
            separator.style.cssText = 'color: #999; font-size: 12px;';
            tabBar.appendChild(separator);
          }
          const tabBtn = document.createElement('button');
          tabBtn.textContent = cat.label;
          tabBtn.type = 'button';
          tabBtn.style.cssText = 'font-size: 12px; padding: 2px 4px; border: 0; border-radius: 3px; background: transparent; color: #444; cursor: pointer;';
          tabBtn.addEventListener('mousedown', (e) => {
            e.preventDefault();
            e.stopPropagation();
            activeCategoryIndex = activeCategoryIndex === i ? null : i;
            Array.from(tabBar.querySelectorAll('button')).forEach((button, j) => {
              (button as HTMLElement).style.background = j === activeCategoryIndex ? 'rgba(25, 118, 210, 0.10)' : 'transparent';
              (button as HTMLElement).style.color = j === activeCategoryIndex ? '#1976d2' : '#444';
            });
            renderTabContent(activeCategoryIndex);
            positionPanel();
          });
          tabBar.appendChild(tabBtn);
        });
        renderTabContent(null);

        expandable.appendChild(tabBar);
        expandable.appendChild(tabContent);

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
        // Select all only for placeholder text so the user can type to replace it.
        if (!didInitialSelect) {
          didInitialSelect = true;
          if (placeholderLatex && latex === placeholderLatex) {
            requestAnimationFrame(() => {
              try { (mf as any).executeCommand?.('selectAll'); } catch (_) {}
            });
          }
        }
      }

      function handleWrapperPointerDown(e: PointerEvent) {
        if (!editor.isEditable) return;
        if ((e.target as HTMLElement).closest('math-field')) return;
        if (!isEditing) {
          e.preventDefault();
          enterEditMode();
        }
      }

      wrapper.addEventListener('pointerdown', handleWrapperPointerDown);
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
          if (pendingFinishTimeout !== null) {
            window.clearTimeout(pendingFinishTimeout);
          }
          wrapper.removeEventListener('pointerdown', handleWrapperPointerDown);
          mathField?.removeEventListener('blur', () => {});
        },
      };
    };
  },
});
