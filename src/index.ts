// Editors
export { default as MathLiveEditor } from './editors/MathLiveEditor';
export { default as ExplanationEditor } from './editors/ExplanationEditor';
export { default as TiptapEditor } from './editors/TiptapEditor';

// Components
export { default as MenuBar } from './components/MenuBar';
export { default as EquationInsertPanel } from './components/EquationInsertPanel';
/** Lazy-loaded (Ketcher is not pulled in until the dialog opens). */
export { default as ChemStructureDialog } from './components/ChemStructureDialogLazy';
export type { ChemStructureDialogProps, ChemStructureDialogMode } from './components/ChemStructureDialog';
export { default as GraphRenderer } from './components/GraphRenderer';
export { default as GraphAnswerInput } from './components/GraphAnswerInput';
export { default as GraphPreview } from './components/GraphPreview';
export { default as GraphEmbedDialog } from './components/GraphEmbedDialog';
export type { GraphEmbedDialogProps } from './components/GraphEmbedDialog';

// Types
export type {
  ChemStructureEmbed,
  ChemStructureMode,
  ChemStructureRepresentation,
  ChemStructureSourceFormat,
  ChemStructureUpsert,
  EditorEmbeds,
  GraphEmbed,
  GraphEmbedUpsert,
  GraphEndpointMarker,
  GraphExpression,
  GraphMode,
  GraphObject,
  GraphOptions,
  GraphPoint,
  GraphPointObject,
  GraphCurveObject,
  GraphCurveResponse,
  GraphLineObject,
  GraphLineResponse,
  GraphRenderer as GraphRendererKind,
  GraphResponse,
  GraphShadedRegionObject,
  GraphSliderObject,
  GraphTool,
  GraphViewport,
  GraphAsymptoteObject,
  GraphLabelObject,
} from './types/embeds';

// Utils
export {
  collectChemStructureIds,
  getChemStructureEmbed,
  pruneUnusedChemStructures,
  removeChemStructure,
  upsertChemStructure,
  collectGraphEmbedIds,
  getGraphEmbed,
  pruneUnusedGraphs,
  removeGraphEmbed,
  upsertGraphEmbed,
} from './utils/embeds';
export {
  denormalizeTeachingDiagramKetForEditing,
  normalizeChemStructureSource,
  normalizeStructurePreviewKet,
  normalizeTeachingDiagramKet,
  renderTeachingDiagramSvg,
} from './utils/chemTeachingDiagram';
export { createChemStructureId } from './utils/chemStructureIds';
export { createGraphEmbedId } from './utils/graphIds';
export {
  computeGraphDisplaySize,
  GRAPH_DISPLAY_BASE_WIDTH,
  GRAPH_DISPLAY_MAX_HEIGHT,
  GRAPH_DISPLAY_MAX_WIDTH,
  GRAPH_DISPLAY_MIN_HEIGHT,
  GRAPH_DISPLAY_MIN_WIDTH,
  normalizeViewport,
  parseViewportField,
  resolveGraphDisplaySize,
  viewportFieldsFromEmbed,
  viewportFromFields,
  withAutoDisplaySize,
} from './utils/graphViewport';
export { graphPreviewKey } from './utils/graphPreviewKey';
export {
  normalizeGraphMode,
  graphHasSliders,
  isDisplayInteractive,
  graphModeLabel,
} from './utils/graphMode';
export { formatGraphOriginLabelLatex } from './utils/graphEquationLabelFormatting';
export {
  extractGraphVariableNamesFromLatex,
  findUndefinedGraphVariables,
} from './utils/graphEquationVariables';
export type { CanonicalGraphMode } from './utils/graphMode';
export {
  hydrateChemStructuresInHtml,
  namespaceChemPreviewSvg,
  chemAwareSanitizeConfig,
  prepareChemAwareHtml,
  CHEM_STRUCTURE_ALLOWED_ATTR,
  CHEM_STRUCTURE_ALLOWED_TAGS,
} from './utils/chemStructurePreview';
export { hydrateGraphsInHtml } from './utils/graphPreview';
export {
  mountGraphPreviewsInElement,
  unmountGraphPreviewsInElement,
} from './utils/graphPreviewMount';
export type { MountGraphPreviewsOptions } from './utils/graphPreviewMount';
export { default as RichTextWithMath } from './components/RichTextWithMath';
export { default as MathPreview } from './components/MathPreview';

// Hooks
export { useChemStructureEditor } from './hooks/useChemStructureEditor';
export { useGraphEmbedEditor } from './hooks/useGraphEmbedEditor';

// Extensions
export { ChemStructure } from './extensions/ChemStructure';
export type { ChemStructureOpenRequest, ChemStructureOptions } from './extensions/ChemStructure';
export { GraphEmbedNode } from './extensions/GraphEmbed';
export type {
  GraphEmbedOpenRequest,
  GraphEmbedExtensionOptions,
  GraphEmbedResizePayload,
} from './extensions/GraphEmbed';

// Extensions (math)
export { InlineMathWithMathLive } from './extensions/InlineMathWithMathLive';
export { InlineMathWithParens } from './extensions/InlineMathWithParens';
export { MathematicsWithInlineEdit } from './extensions/MathematicsWithInlineEdit';
export { SmartMathPaste } from './extensions/SmartMathPaste';
export { OverleafPaste } from './extensions/OverleafPaste';
export { TextStyleFontSize } from './extensions/TextStyleFontSize';

export { handleMathBackspaceKeyDown } from './utils/mathBackspace';

// Styles (consumers import this in their app)
