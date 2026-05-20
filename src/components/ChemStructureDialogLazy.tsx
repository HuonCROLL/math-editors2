import React, { Suspense } from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import type { ChemStructureDialogProps } from './ChemStructureDialog';

const LazyChemStructureDialog = React.lazy(() => import('./ChemStructureDialog'));

/**
 * Lazy-loads Ketcher so host apps do not pull it into the initial editor bundle.
 * Host apps must import Ketcher styles once, e.g. `import 'ketcher-react/dist/index.css'`.
 */
const ChemStructureDialogLazy: React.FC<ChemStructureDialogProps> = (props) => {
  if (!props.open) return null;

  return (
    <Suspense
      fallback={
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      }
    >
      <LazyChemStructureDialog {...props} />
    </Suspense>
  );
};

export default ChemStructureDialogLazy;
