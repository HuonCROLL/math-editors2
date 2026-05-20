import React from 'react';
import DOMPurify from 'dompurify';
import katex from 'katex';
import renderMathInElement from 'katex/contrib/auto-render';
import type { EditorEmbeds } from '../types/embeds';
import { chemAwareSanitizeConfig, prepareChemAwareHtml } from '../utils/chemStructurePreview';
import {
  mountGraphPreviewsInElement,
  unmountGraphPreviewsInElement,
} from '../utils/graphPreviewMount';
import { preprocessMathInHtml } from '../utils/mathHtmlPreprocess';
import 'katex/dist/katex.min.css';

type Props = {
  html: string;
  className?: string;
  /** 'scroll' for normal reading, 'clip' for thumbnail snapshots */
  mode?: 'scroll' | 'clip';
  embeds?: EditorEmbeds | null;
};

export default function RichTextWithMath({ html, className, mode = 'scroll', embeds }: Props) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const mergedClassName = ['richtext-with-math', className].filter(Boolean).join(' ');

  const decodeHtmlEntities = (text: string): string => {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
  };

  const transformedHtml = React.useMemo(() => {
    const decoded = decodeHtmlEntities(html ?? '');
    const withImages = decoded
      .replace(/\bcontainerstyle\s*=\s*"([^"]*)"/gi, (_m, css) => `style="${css}"`)
      .replace(/\bwrapperstyle\s*=\s*"[^"]*"/gi, '');
    return prepareChemAwareHtml(preprocessMathInHtml(withImages), embeds);
  }, [html, embeds]);

  const renderStoredMathNodes = React.useCallback((root: HTMLElement) => {
    const nodes = Array.from(
      root.querySelectorAll<HTMLElement>(
        '[data-type="inline-math"][data-latex], [data-type="block-math"][data-latex]',
      ),
    );

    nodes.forEach((node) => {
      const latex = node.getAttribute('data-latex') ?? '';
      const isBlock = node.getAttribute('data-type') === 'block-math';

      const replacement = document.createElement(isBlock ? 'div' : 'span');
      try {
        replacement.innerHTML = katex.renderToString(latex, {
          throwOnError: false,
          displayMode: isBlock,
        });
      } catch {
        replacement.textContent = latex;
      }
      node.replaceWith(replacement);
    });
  }, []);

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    el.innerHTML = DOMPurify.sanitize(transformedHtml, chemAwareSanitizeConfig());
    renderStoredMathNodes(el);

    renderMathInElement(el, {
      delimiters: [
        { left: '\\[', right: '\\]', display: true },
        { left: '\\(', right: '\\)', display: false },
      ],
      throwOnError: false,
    });

    mountGraphPreviewsInElement(el, embeds);

    return () => {
      unmountGraphPreviewsInElement(el);
    };
  }, [transformedHtml, renderStoredMathNodes, embeds]);

  return (
    <div
      ref={containerRef}
      className={mergedClassName}
      style={{
        overflowX: mode === 'clip' ? 'hidden' : 'auto',
        overflowY: 'hidden',
        maxWidth: '100%',
        wordBreak: 'break-word',
      }}
    />
  );
}
