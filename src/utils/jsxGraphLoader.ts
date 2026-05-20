import type JXG from 'jsxgraph';

let jsxGraphPromise: Promise<typeof JXG> | null = null;

/** Lazy-load JSXGraph (and its CSS should be imported by the host app). */
export async function loadJsxGraph(): Promise<typeof JXG> {
  if (!jsxGraphPromise) {
    jsxGraphPromise = import('jsxgraph').then((mod) => {
      const resolved = (mod as { default?: typeof JXG }).default ?? (mod as typeof JXG);
      return resolved;
    });
  }
  return jsxGraphPromise;
}
