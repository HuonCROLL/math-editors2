import React from 'react';
import * as react_jsx_runtime from 'react/jsx-runtime';
import { Editor } from '@tiptap/react';
import { MathfieldElement } from 'mathlive';
import * as _tiptap_core from '@tiptap/core';
import { Extension } from '@tiptap/core';
import * as _tiptap_extension_mathematics from '@tiptap/extension-mathematics';
import { MathematicsOptions } from '@tiptap/extension-mathematics';
import * as _tiptap_extension_text_style from '@tiptap/extension-text-style';

interface Props$4 {
    value: string;
    onChange: (latex: string) => void;
    minWidthPx?: number;
    minWidthPercent?: number;
    minHeightPx?: number;
    maxHeightPx?: number;
}
declare const MathLiveEditor: React.FC<Props$4>;

type Props$3 = {
    value: string;
    onChange: (html: string) => void;
    placeholder?: string;
    toolbarMode?: 'studentSimple' | 'tutorFull';
    minHeightPx?: number;
    maxHeightPx?: number;
};
declare function ExplanationEditor({ value, onChange, placeholder, toolbarMode, minHeightPx, maxHeightPx, }: Props$3): react_jsx_runtime.JSX.Element;

type QuestionOpts = boolean | {
    enabled: boolean;
    subjectId?: string | null;
    categoryId?: string | null;
};
interface Props$2 {
    value: string;
    onChange: (html: string) => void;
    readOnly?: boolean;
    /** Enable question placeholders + picker (pass subject/category to scope results) */
    questions?: QuestionOpts;
    menuBarWrapperSx?: any;
    toolbarMode?: 'studentSimple' | 'tutorFull';
}
declare const TiptapEditor: React.FC<Props$2>;

interface Props$1 {
    editor: Editor | null;
    showQuestionButton?: boolean;
    /** When provided, Equation button inserts inline math (e.g. empty placeholder) */
    onInsertEquation?: () => void;
    toolbarMode?: 'studentSimple' | 'tutorFull';
}
declare const MenuBar: React.FC<Props$1>;

type Props = {
    mathFieldRef: React.RefObject<MathfieldElement | null>;
    open: boolean;
    onClose: () => void;
};
declare function EquationInsertPanel({ mathFieldRef, open, onClose }: Props): react_jsx_runtime.JSX.Element | null;

/**
 * InlineMath extension with inline MathLive editing on click.
 * Renders with KaTeX when not focused; swaps to MathLive when clicked for editing.
 */
declare const InlineMathWithMathLive: _tiptap_core.Node<_tiptap_extension_mathematics.InlineMathOptions, any>;

/**
 * Mathematics extension that uses InlineMathWithMathLive for inline math,
 * enabling click-to-edit with MathLive (no popover, no raw LaTeX visible).
 * Block math uses \[...\] delimiters.
 */
declare const MathematicsWithInlineEdit: Extension<MathematicsOptions, any>;

declare const SmartMathPaste: Extension<any, any>;

/**
 * Intercept Overleaf‑style LaTeX pastes and turn \begin{tabular}
 * into a real HTML <table>, which @tiptap/extension-table
 * then parses into editable rows/cells.
 *
 * Supports simple cases: rows separated by '\\', cells by '&'.
 * Ignores \hline / \cline for brevity.
 */
declare const OverleafPaste: Extension<any, any>;

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        fontSize: {
            setFontSize: (fontSize: string) => ReturnType;
            unsetFontSize: () => ReturnType;
        };
    }
}
declare const TextStyleFontSize: _tiptap_core.Mark<_tiptap_extension_text_style.TextStyleOptions, any>;

export { EquationInsertPanel, ExplanationEditor, InlineMathWithMathLive, MathLiveEditor, MathematicsWithInlineEdit, MenuBar, OverleafPaste, SmartMathPaste, TextStyleFontSize, TiptapEditor };
