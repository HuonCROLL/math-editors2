import React from 'react';
import * as react_jsx_runtime from 'react/jsx-runtime';
import { E as EditorEmbeds, C as ChemStructureMode, a as ChemStructureRepresentation, b as ChemStructureEmbed, G as GraphEmbed, c as GraphViewport, d as GraphOptions, e as GraphMode } from './embeds-7IYPpSoC.mjs';
export { f as ChemStructureSourceFormat, g as ChemStructureUpsert, h as GraphAsymptoteObject, i as GraphCurveObject, j as GraphCurveResponse, k as GraphEmbedUpsert, l as GraphEndpointMarker, m as GraphExpression, n as GraphLabelObject, o as GraphLineObject, p as GraphLineResponse, q as GraphObject, r as GraphPoint, s as GraphPointObject, t as GraphRendererKind, u as GraphResponse, v as GraphShadedRegionObject, w as GraphSliderObject, x as GraphTool } from './embeds-7IYPpSoC.mjs';
import { Editor } from '@tiptap/react';
import { MathfieldElement } from 'mathlive';
export { CHEM_STRUCTURE_ALLOWED_ATTR, CHEM_STRUCTURE_ALLOWED_TAGS, GraphAnswerInput, GraphPreview, GraphRenderer, MathPreview, MountGraphPreviewsOptions, RichTextWithMath, chemAwareSanitizeConfig, hydrateChemStructuresInHtml, hydrateGraphsInHtml, mountGraphPreviewsInElement, namespaceChemPreviewSvg, prepareChemAwareHtml, unmountGraphPreviewsInElement } from './preview.mjs';
export { denormalizeTeachingDiagramKetForEditing, normalizeChemStructureSource, normalizeStructurePreviewKet, normalizeTeachingDiagramKet, renderTeachingDiagramSvg } from './chemTeachingDiagram.mjs';
import * as _tiptap_core from '@tiptap/core';
import { Node, Extension } from '@tiptap/core';
import * as _tiptap_extension_mathematics from '@tiptap/extension-mathematics';
import { MathematicsOptions } from '@tiptap/extension-mathematics';
import * as _tiptap_extension_text_style from '@tiptap/extension-text-style';
import { EditorView } from 'prosemirror-view';

interface Props$4 {
    value: string;
    onChange: (latex: string) => void;
    minWidthPx?: number;
    minWidthPercent?: number;
    minHeightPx?: number;
    maxHeightPx?: number;
    defaultPanelOpen?: boolean;
    inlineInsertPanel?: boolean;
    openPanelOnFocus?: boolean;
}
declare const MathLiveEditor: React.FC<Props$4>;

type Props$3 = {
    value: string;
    onChange: (html: string) => void;
    placeholder?: string;
    toolbarMode?: 'studentSimple' | 'tutorFull';
    minHeightPx?: number;
    maxHeightPx?: number;
    embeds?: EditorEmbeds;
    onEmbedsChange?: (embeds: EditorEmbeds) => void;
};
declare function ExplanationEditor({ value, onChange, placeholder, toolbarMode, minHeightPx, maxHeightPx, embeds, onEmbedsChange, }: Props$3): react_jsx_runtime.JSX.Element;

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
    /** Chemical structure embeds manifest (paired with chem-structure spans in HTML). */
    embeds?: EditorEmbeds;
    onEmbedsChange?: (embeds: EditorEmbeds) => void;
    menuBarWrapperSx?: any;
    toolbarMode?: 'studentSimple' | 'tutorFull';
}
declare const TiptapEditor: React.FC<Props$2>;

interface Props$1 {
    editor: Editor | null;
    showQuestionButton?: boolean;
    /** When provided, Equation button inserts inline math (e.g. empty placeholder) */
    onInsertEquation?: () => void;
    /** When provided, opens Ketcher dialog to insert a chemical structure */
    onInsertChemStructure?: () => void;
    /** When provided, opens graph dialog to insert a graph embed */
    onInsertGraph?: () => void;
    toolbarMode?: 'studentSimple' | 'tutorFull';
}
declare const MenuBar: React.FC<Props$1>;

type Props = {
    mathFieldRef: React.RefObject<MathfieldElement | null>;
    open: boolean;
    onClose: () => void;
};
declare function EquationInsertPanel({ mathFieldRef, open, onClose }: Props): react_jsx_runtime.JSX.Element | null;

type ChemStructureDialogMode = 'insert' | 'edit';
interface ChemStructureDialogProps {
    open: boolean;
    mode: ChemStructureDialogMode;
    /** Existing KET source when editing; empty for new structures. */
    initialSourceValue?: string;
    structureMode?: ChemStructureMode;
    representation?: ChemStructureRepresentation;
    onClose: () => void;
    onSave: (embed: ChemStructureEmbed) => void | Promise<void>;
}

/**
 * Lazy-loads Ketcher so host apps do not pull it into the initial editor bundle.
 * Host apps must import Ketcher styles once, e.g. `import 'ketcher-react/dist/index.css'`.
 */
declare const ChemStructureDialogLazy: React.FC<ChemStructureDialogProps>;

/** Stable key so graph previews remount when embed definition changes. */
declare function graphPreviewKey(embed: GraphEmbed): string;

type GraphEmbedDialogProps = {
    open: boolean;
    initialEmbed: GraphEmbed;
    onClose: () => void;
    onSave: (embed: GraphEmbed) => void;
};
declare const GraphEmbedDialog: React.FC<GraphEmbedDialogProps>;

/** Collect all chem-structure ids referenced in one or more HTML strings. */
declare function collectChemStructureIds(...htmlFields: string[]): Set<string>;
/** Insert or replace a chem structure entry in the embeds manifest. */
declare function upsertChemStructure(embeds: EditorEmbeds, structureId: string, embed: ChemStructureEmbed): EditorEmbeds;
/** Remove a chem structure entry from the embeds manifest. */
declare function removeChemStructure(embeds: EditorEmbeds, structureId: string): EditorEmbeds;
/** Drop chem_structures entries not referenced in any provided HTML field. */
declare function pruneUnusedChemStructures(embeds: EditorEmbeds, ...htmlFields: string[]): EditorEmbeds;
/** Look up a chem structure embed by id. */
declare function getChemStructureEmbed(embeds: EditorEmbeds | undefined, structureId: string): ChemStructureEmbed | undefined;
/** Collect all graph embed ids referenced in one or more HTML strings. */
declare function collectGraphEmbedIds(...htmlFields: string[]): Set<string>;
/** Insert or replace a graph entry in the embeds manifest. */
declare function upsertGraphEmbed(embeds: EditorEmbeds, embedId: string, embed: GraphEmbed): EditorEmbeds;
/** Remove a graph entry from the embeds manifest. */
declare function removeGraphEmbed(embeds: EditorEmbeds, embedId: string): EditorEmbeds;
/** Drop graph entries not referenced in any provided HTML field. */
declare function pruneUnusedGraphs(embeds: EditorEmbeds, ...htmlFields: string[]): EditorEmbeds;
/** Look up a graph embed by id. */
declare function getGraphEmbed(embeds: EditorEmbeds | undefined, embedId: string): GraphEmbed | undefined;

/** Generate a unique chemical-structure reference id for HTML + embeds. */
declare function createChemStructureId(): string;

/** Generate a unique graph embed reference id for HTML + embeds. */
declare function createGraphEmbedId(): string;

declare const GRAPH_DISPLAY_MIN_WIDTH = 200;
declare const GRAPH_DISPLAY_MAX_WIDTH = 960;
declare const GRAPH_DISPLAY_MIN_HEIGHT = 120;
declare const GRAPH_DISPLAY_MAX_HEIGHT = 800;
declare const GRAPH_DISPLAY_BASE_WIDTH = 400;
/** Ensure viewport numbers are finite and min < max. */
declare function normalizeViewport(viewport?: Partial<GraphViewport> | null): GraphViewport;
/** Parse a viewport text field; empty or lone '-' keeps the previous value. */
declare function parseViewportField(raw: string, previous: number): number;
declare function viewportFieldsFromEmbed(viewport: GraphViewport): Record<keyof GraphViewport, string>;
/** Build a normalized viewport from draft text fields. */
declare function viewportFromFields(fields: Record<keyof GraphViewport, string>, fallback?: GraphViewport): GraphViewport;
/**
 * Pixel size so on-screen units match the viewport spans and x:y scale ratio.
 * width / height = (xSpan * ratioY) / (ySpan * ratioX) when a scale ratio is set.
 */
declare function computeGraphDisplaySize(viewport: GraphViewport, options?: GraphOptions, baseWidth?: number): {
    width: number;
    height: number;
};
/** Resolved plot size for an embed (auto from viewport or manual override). */
declare function resolveGraphDisplaySize(embed: GraphEmbed): {
    width: number;
    height: number;
};
/** Apply auto display dimensions when auto sizing is enabled. */
declare function withAutoDisplaySize(embed: GraphEmbed, viewport?: GraphViewport): GraphEmbed;

/** Canonical graph mode (unified display). */
type CanonicalGraphMode = 'display';
/** Map legacy modes (including answer-input) to unified display. */
declare function normalizeGraphMode(mode: GraphMode | undefined): CanonicalGraphMode;
declare function graphHasSliders(embed: GraphEmbed): boolean;
/** Sliders enable pan/zoom for students exploring parameters. */
declare function isDisplayInteractive(embed: GraphEmbed): boolean;
declare function graphModeLabel(embed: GraphEmbed): string;

/** Format LaTeX shown at the graph origin (uses independent axis + slider names only). */
declare function formatGraphOriginLabelLatex(latex: string, embed: GraphEmbed): string;

/** Strip LaTeX syntax and return identifier-like tokens used as variables. */
declare function extractGraphVariableNamesFromLatex(latex: string, options?: {
    independentAxis?: string;
    dependentAxis?: string;
}): string[];
/** Names used in latex that are not defined as graph variables (sliders). */
declare function findUndefinedGraphVariables(latex: string, definedNames: readonly string[], axisLabels: {
    x?: string;
    y?: string;
}): string[];

type ChemStructureOpenRequest = {
    mode: 'insert';
} | {
    mode: 'edit';
    structureId: string;
    pos: number;
};
interface ChemStructureOptions {
    getEmbeds: () => EditorEmbeds | undefined;
    onOpenEditor: (request: ChemStructureOpenRequest) => void;
}
declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        chemStructure: {
            insertChemStructure: (structureId: string) => ReturnType;
        };
    }
}
declare const ChemStructure: Node<ChemStructureOptions, any>;

type ChemDialogState = {
    open: false;
} | {
    open: true;
    mode: 'insert' | 'edit';
    structureId: string;
    initialSourceValue: string;
    /** Document position when editing an existing node. */
    editPos?: number;
};
type UseChemStructureEditorArgs = {
    editor: Editor | null;
    embeds?: EditorEmbeds;
    onEmbedsChange?: (embeds: EditorEmbeds) => void;
    /** When false, chem toolbar + click-to-edit are disabled. */
    enabled?: boolean;
};
declare function useChemStructureEditor({ editor, embeds, onEmbedsChange, enabled, }: UseChemStructureEditorArgs): {
    chemEnabled: boolean;
    getEmbeds: () => EditorEmbeds | undefined;
    openChemEditor: (request: ChemStructureOpenRequest) => void;
    insertNewStructure: () => void;
    dialog: ChemDialogState;
    closeDialog: () => void;
    handleDialogSave: (embed: ChemStructureEmbed) => Promise<void>;
};

type GraphEmbedOpenRequest = {
    mode: 'insert';
} | {
    mode: 'edit';
    embedId: string;
    pos?: number;
};
type GraphEmbedResizePayload = {
    width: number;
    height: number;
};
interface GraphEmbedExtensionOptions {
    getEmbeds: () => EditorEmbeds | undefined;
    onOpenEditor: (request: GraphEmbedOpenRequest) => void;
    onResizeEmbed?: (embedId: string, size: GraphEmbedResizePayload) => void;
    /** When false, hide the resize handle (read-only editor). */
    allowResize?: boolean;
}
declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        graphEmbed: {
            insertGraphEmbed: (embedId: string) => ReturnType;
        };
    }
}
declare const GraphEmbedNode: Node<GraphEmbedExtensionOptions, any>;

type GraphDialogState = {
    open: false;
} | {
    open: true;
    mode: 'insert' | 'edit';
    embedId: string;
    initialEmbed: GraphEmbed;
    editPos?: number;
};
type UseGraphEmbedEditorArgs = {
    editor: Editor | null;
    embeds?: EditorEmbeds;
    onEmbedsChange?: (embeds: EditorEmbeds) => void;
    enabled?: boolean;
};
declare function useGraphEmbedEditor({ editor, embeds, onEmbedsChange, enabled, }: UseGraphEmbedEditorArgs): {
    graphEnabled: boolean;
    getEmbeds: () => EditorEmbeds | undefined;
    openGraphEditor: (request: GraphEmbedOpenRequest) => void;
    insertNewGraph: () => void;
    resizeGraphEmbed: (embedId: string, size: {
        width: number;
        height: number;
    }) => void;
    dialog: GraphDialogState;
    closeDialog: () => void;
    handleDialogSave: (embed: GraphEmbed) => void;
};

/**
 * InlineMath extension with inline MathLive editing on click.
 * Renders with KaTeX when not focused; swaps to MathLive when clicked for editing.
 */
declare const InlineMathWithMathLive: _tiptap_core.Node<_tiptap_extension_mathematics.InlineMathOptions, any>;

/**
 * Inline math with only \( ... \) input rules.
 * This intentionally avoids the upstream dollar-delimiter rules.
 */
declare const InlineMathWithParens: _tiptap_core.Node<_tiptap_extension_mathematics.InlineMathOptions, any>;

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

/**
 * Consistent Backspace behavior around atomic math nodes:
 * - First Backspace after inline math selects the node (visible outline).
 * - Second Backspace deletes the selected math node.
 * - Backspace in an empty paragraph after block math selects the block node.
 */
declare function handleMathBackspaceKeyDown(view: EditorView, event: KeyboardEvent): boolean;

export { type CanonicalGraphMode, ChemStructure, ChemStructureDialogLazy as ChemStructureDialog, type ChemStructureDialogMode, type ChemStructureDialogProps, ChemStructureEmbed, ChemStructureMode, type ChemStructureOpenRequest, type ChemStructureOptions, ChemStructureRepresentation, EditorEmbeds, EquationInsertPanel, ExplanationEditor, GRAPH_DISPLAY_BASE_WIDTH, GRAPH_DISPLAY_MAX_HEIGHT, GRAPH_DISPLAY_MAX_WIDTH, GRAPH_DISPLAY_MIN_HEIGHT, GRAPH_DISPLAY_MIN_WIDTH, GraphEmbed, GraphEmbedDialog, type GraphEmbedDialogProps, type GraphEmbedExtensionOptions, GraphEmbedNode, type GraphEmbedOpenRequest, type GraphEmbedResizePayload, GraphMode, GraphOptions, GraphViewport, InlineMathWithMathLive, InlineMathWithParens, MathLiveEditor, MathematicsWithInlineEdit, MenuBar, OverleafPaste, SmartMathPaste, TextStyleFontSize, TiptapEditor, collectChemStructureIds, collectGraphEmbedIds, computeGraphDisplaySize, createChemStructureId, createGraphEmbedId, extractGraphVariableNamesFromLatex, findUndefinedGraphVariables, formatGraphOriginLabelLatex, getChemStructureEmbed, getGraphEmbed, graphHasSliders, graphModeLabel, graphPreviewKey, handleMathBackspaceKeyDown, isDisplayInteractive, normalizeGraphMode, normalizeViewport, parseViewportField, pruneUnusedChemStructures, pruneUnusedGraphs, removeChemStructure, removeGraphEmbed, resolveGraphDisplaySize, upsertChemStructure, upsertGraphEmbed, useChemStructureEditor, useGraphEmbedEditor, viewportFieldsFromEmbed, viewportFromFields, withAutoDisplaySize };
