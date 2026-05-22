import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts', 'src/preview.ts', 'src/chemTeachingDiagram.ts', 'src/vite.ts'],
  format: ['cjs', 'esm'],
  splitting: true,
  dts: true,
  sourcemap: true,
  clean: true,
  external: [
    'react',
    'react-dom',
    '@mui/material',
    '@mui/icons-material',
    '@emotion/react',
    '@emotion/styled',
    '@tiptap/*',
    'dompurify',
    'katex',
    'mathlive',
    'ketcher-react',
    'ketcher-core',
    'ketcher-standalone',
    'jsxgraph',
  ]
})
