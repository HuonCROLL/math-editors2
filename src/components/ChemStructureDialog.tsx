import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { Editor } from 'ketcher-react';
import { ChemicalMimeType, type Ketcher } from 'ketcher-core';
import { StandaloneStructServiceProvider } from 'ketcher-standalone';
import type { ChemStructureEmbed, ChemStructureMode, ChemStructureRepresentation } from '../types/embeds';
import {
  denormalizeTeachingDiagramKetForEditing,
  normalizeChemStructureSource,
  normalizeStructurePreviewKet,
  renderTeachingDiagramSvg,
} from '../utils/chemTeachingDiagram';
import 'ketcher-react/dist/index.css';

export type ChemStructureDialogMode = 'insert' | 'edit';

export interface ChemStructureDialogProps {
  open: boolean;
  mode: ChemStructureDialogMode;
  /** Existing KET source when editing; empty for new structures. */
  initialSourceValue?: string;
  structureMode?: ChemStructureMode;
  representation?: ChemStructureRepresentation;
  onClose: () => void;
  onSave: (embed: ChemStructureEmbed) => void | Promise<void>;
}

const structServiceProvider = new StandaloneStructServiceProvider();

async function blobToSvgString(blob: Blob): Promise<string> {
  return blob.text();
}

function applyChemRenderOptions(
  ketcher: Ketcher,
  structureMode: ChemStructureMode,
  representation: ChemStructureRepresentation,
) {
  const options = {
    carbonExplicitly: structureMode === 'teaching-diagram' || representation === 'full',
    showHydrogenLabels: 'off',
  };
  const editor = ketcher.editor as unknown as {
    render?: { updateOptions?: (opts: string) => unknown; update?: (force?: boolean) => unknown };
    setOptions?: (opts: string) => unknown;
    update?: (action: true, ignoreHistory?: boolean) => unknown;
  };
  const serialized = JSON.stringify(options);

  editor.setOptions?.(serialized);
  editor.render?.updateOptions?.(serialized);
  editor.render?.update?.(true);
  editor.update?.(true, true);
}

async function getSourceForRepresentation(
  ketcher: Ketcher,
  sourceValue: string,
  structureMode: ChemStructureMode,
  representation: ChemStructureRepresentation,
): Promise<string> {
  if (structureMode === 'teaching-diagram') {
    return sourceValue;
  }

  try {
    const result = await ketcher.structService.toggleExplicitHydrogens({
      struct: sourceValue,
      output_format: ChemicalMimeType.KET,
      mode: representation === 'full' ? 'unfold' : 'fold',
    });
    return result.struct || sourceValue;
  } catch (err) {
    console.warn('Failed to normalize explicit hydrogens for Ketcher preview', err);
    return sourceValue;
  }
}

async function buildEmbedFromKetcher(
  ketcher: Ketcher,
  structureMode: ChemStructureMode,
  representation: ChemStructureRepresentation,
): Promise<ChemStructureEmbed> {
  const currentSourceValue = await ketcher.getKet();
  const representedSourceValue = await getSourceForRepresentation(ketcher, currentSourceValue, structureMode, representation);
  const sourceValue = normalizeChemStructureSource(representedSourceValue, structureMode);
  const smiles = await ketcher.getSmiles();
  applyChemRenderOptions(ketcher, structureMode, representation);
  const previewSourceValue = structureMode === 'teaching-diagram' ? sourceValue : normalizeStructurePreviewKet(sourceValue);
  const previewSvg =
    structureMode === 'teaching-diagram'
      ? renderTeachingDiagramSvg(previewSourceValue)
      : await blobToSvgString(await ketcher.generateImage(previewSourceValue, { outputFormat: 'svg' }));

  return {
    type: 'chemical-structure',
    mode: structureMode,
    sourceFormat: 'ket',
    sourceValue,
    smiles,
    previewSvg,
    editable_format: 'ket',
    editable_data: sourceValue,
    preview_svg: previewSvg,
    representation,
  };
}

const ChemStructureDialog: React.FC<ChemStructureDialogProps> = ({
  open,
  mode,
  initialSourceValue = '',
  structureMode = 'teaching-diagram',
  representation = 'skeletal',
  onClose,
  onSave,
}) => {
  const ketcherRef = useRef<Ketcher | null>(null);
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setReady(false);
      setError(null);
      ketcherRef.current = null;
    }
  }, [open]);

  const handleInit = useCallback(
    async (ketcher: Ketcher) => {
      ketcherRef.current = ketcher;
      setReady(true);
      setError(null);
      applyChemRenderOptions(ketcher, structureMode, representation);
      if (initialSourceValue) {
        try {
          await ketcher.setMolecule(
            structureMode === 'teaching-diagram'
              ? denormalizeTeachingDiagramKetForEditing(initialSourceValue)
              : initialSourceValue,
          );
          applyChemRenderOptions(ketcher, structureMode, representation);
        } catch (err) {
          console.warn('Failed to load initial structure into Ketcher', err);
        }
      }
    },
    [initialSourceValue, representation, structureMode],
  );

  const handleSave = async () => {
    const ketcher = ketcherRef.current;
    if (!ketcher) return;

    setSaving(true);
    setError(null);
    try {
      const embed = await buildEmbedFromKetcher(ketcher, structureMode, representation);
      await onSave(embed);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save structure');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      fullWidth
      PaperProps={{
        sx: { width: 'min(96vw, 1100px)', maxWidth: '96vw', height: 'min(90vh, 820px)' },
      }}
    >
      <DialogTitle>{mode === 'edit' ? 'Edit chemical structure' : 'Insert chemical structure'}</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', p: 0, overflow: 'hidden' }}>
        <Box
          data-chem-structure-mode={structureMode}
          sx={{
            flex: 1,
            minHeight: 520,
            position: 'relative',
          }}
        >
          {open && (
            <Editor
              staticResourcesUrl="/"
              structServiceProvider={structServiceProvider}
              errorHandler={(message: string) => setError(message)}
              onInit={handleInit}
            />
          )}
          {!ready && open && (
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'rgba(255,255,255,0.7)',
                zIndex: 1,
              }}
            >
              <CircularProgress />
            </Box>
          )}
        </Box>
        {error && (
          <Box sx={{ px: 2, py: 1, color: 'error.main', fontSize: '0.875rem' }}>{error}</Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={saving}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSave} disabled={!ready || saving}>
          {saving ? 'Saving…' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChemStructureDialog;
