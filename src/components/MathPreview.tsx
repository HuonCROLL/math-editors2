import React, { useEffect, useMemo, useRef } from 'react';
import DOMPurify from 'dompurify';
import katex from 'katex';
import type { EditorEmbeds } from '../types/embeds';
import { chemAwareSanitizeConfig, prepareChemAwareHtml } from '../utils/chemStructurePreview';
import {
  mountGraphPreviewsInElement,
  unmountGraphPreviewsInElement,
} from '../utils/graphPreviewMount';
import { preprocessMathInHtml } from '../utils/mathHtmlPreprocess';
import 'katex/dist/katex.min.css';

function renderStoredMathNodesToHtml(src: string) {
  if (!src.includes('data-type="inline-math"') && !src.includes('data-type="block-math"')) {
    return src;
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(src, 'text/html');
  const nodes = Array.from(
    doc.querySelectorAll<HTMLElement>('[data-type="inline-math"][data-latex], [data-type="block-math"][data-latex]'),
  );

  nodes.forEach((node) => {
    const latex = node.getAttribute('data-latex') ?? '';
    const isBlock = node.getAttribute('data-type') === 'block-math';
    const el = doc.createElement(isBlock ? 'div' : 'span');
    try {
      el.innerHTML = katex.renderToString(latex, {
        throwOnError: false,
        displayMode: isBlock,
      });
    } catch {
      el.textContent = latex;
    }
    node.replaceWith(el);
  });

  return doc.body.innerHTML;
}

interface Props {
  text: string;
  className?: string;
  embeds?: EditorEmbeds | null;
}

const MathPreview: React.FC<Props> = ({ text, className, embeds }) => {
  const containerRef = useRef<HTMLSpanElement>(null);

  const html = useMemo(() => {
    const withMathNodes = preprocessMathInHtml(text ?? '');
    const withEmbeds = prepareChemAwareHtml(withMathNodes, embeds);
    const rendered = renderStoredMathNodesToHtml(withEmbeds);
    return DOMPurify.sanitize(rendered, chemAwareSanitizeConfig());
  }, [text, embeds]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    mountGraphPreviewsInElement(el, embeds, { answerInputReadOnly: true });
    return () => {
      unmountGraphPreviewsInElement(el);
    };
  }, [html, embeds]);

  return (
    <span
      ref={containerRef}
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default MathPreview;
