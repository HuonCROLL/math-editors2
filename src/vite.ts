import { createRequire } from 'module';

export type MathEditorsViteAlias = {
  find: string | RegExp;
  replacement: string;
};

const requireFromPackage = createRequire(import.meta.url);
const raphaelBundledBuild = requireFromPackage.resolve('raphael/raphael.min.js');

export const mathEditorsViteAliases: MathEditorsViteAlias[] = [
  { find: /^raphael$/, replacement: raphaelBundledBuild },
  { find: /^raphael\/raphael\.no-deps(\.min)?\.js$/, replacement: raphaelBundledBuild },
];

export const mathEditorsOptimizeDeps = [
  'ketcher-react',
  'ketcher-core',
  'ketcher-standalone',
  'raphael',
];
