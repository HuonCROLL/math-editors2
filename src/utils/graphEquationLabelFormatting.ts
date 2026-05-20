import type { GraphEmbed, GraphObject, GraphOptions } from '../types/embeds';

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const IDENTIFIER_RE = /^[A-Za-z][A-Za-z0-9_]*$/;

export function isValidGraphVariableName(name: string): boolean {
  return IDENTIFIER_RE.test(name.trim());
}

/** LaTeX-ish token for an identifier (possibly braced) with single-char bare form. */
function latexIdPattern(id: string): string {
  const e = escapeRegExp(id.trim());
  if (!e) return '(?!x)x';
  if (/^[a-zA-Z]$/.test(id.trim())) {
    const bare = `(?<![\\\\a-zA-Z])${e}(?![a-zA-Z])`;
    return `(?:\\{${e}\\}|${bare})`;
  }
  return `\\{${e}\\}`;
}

/**
 * Slider / parameter names from the embed, plus the independent (horizontal) axis label.
 * Used to strip redundant `\\cdot` between a parameter and that axis (e.g. `a\\cdot x` → `ax`).
 */
export function collectGraphImplicitMulIdentifiers(options: GraphOptions, objects: GraphObject[] | undefined): {
  sliderIds: string[];
  independentAxisLabel: string;
} {
  const xAxisRaw = options.xAxisLabel?.trim() || 'x';
  const xAxis = isValidGraphVariableName(xAxisRaw) ? xAxisRaw : 'x';
  const sliderIds = new Set<string>();
  for (const o of objects ?? []) {
    if (o.type !== 'slider') continue;
    const v = o.bindsTo?.trim() || o.name?.trim();
    if (v && isValidGraphVariableName(v)) {
      sliderIds.add(v);
      if (o.name?.trim() && isValidGraphVariableName(o.name.trim())) sliderIds.add(o.name.trim());
    }
  }
  return {
    sliderIds: [...sliderIds].filter((s) => s.length > 0),
    independentAxisLabel: xAxis,
  };
}

function findFunctionRanges(text: string): Array<{ start: number; end: number }> {
  const out: Array<{ start: number; end: number }> = [];
  const fnRe = /\\?[A-Za-z][A-Za-z0-9_]*\s*\(/g;
  let m: RegExpExecArray | null = null;
  while ((m = fnRe.exec(text))) {
    const open = text.indexOf('(', m.index);
    if (open < 0) continue;
    let depth = 0;
    let close = -1;
    for (let i = open; i < text.length; i += 1) {
      const ch = text[i];
      if (ch === '(') depth += 1;
      else if (ch === ')') {
        depth -= 1;
        if (depth === 0) {
          close = i;
          break;
        }
      }
    }
    if (close >= 0) out.push({ start: m.index, end: close + 1 });
  }
  return out;
}

function applyReplacementOutsideFunctionRanges(
  text: string,
  re: RegExp,
  replacement: string,
): string {
  const ranges = findFunctionRanges(text);
  if (ranges.length === 0) return text.replace(re, replacement);

  let out = '';
  let cursor = 0;
  for (const range of ranges) {
    if (cursor < range.start) {
      out += text.slice(cursor, range.start).replace(re, replacement);
    }
    out += text.slice(range.start, range.end);
    cursor = range.end;
  }
  if (cursor < text.length) out += text.slice(cursor).replace(re, replacement);
  return out;
}

/**
 * Remove `\cdot` between named slider parameters and the independent (horizontal) axis
 * symbol so `a\cdot x^2` renders like `ax^2` while leaving `\sin(x)` etc. untouched.
 */
export function stripSliderTimesIndependentAxis(
  latex: string,
  independentAxisLabel: string,
  sliderIdentifiers: readonly string[],
): string {
  if (!latex || sliderIdentifiers.length === 0) return latex;
  const axisCandidate = independentAxisLabel.trim() || 'x';
  const axis = isValidGraphVariableName(axisCandidate) ? axisCandidate : 'x';
  const axisRight = latexIdPattern(axis);
  let out = latex;
  const sliders = [
    ...new Set(
      sliderIdentifiers
        .map((s) => s.trim())
        .filter((s) => s.length > 0 && s !== axis && isValidGraphVariableName(s)),
    ),
  ].sort((a, b) => b.length - a.length);
  for (const name of sliders) {
    const left = latexIdPattern(name);
    const dotRe = new RegExp(`(${left})\\s*\\\\cdot\\s*(${axisRight})`, 'g');
    out = applyReplacementOutsideFunctionRanges(out, dotRe, '$1$2');
  }
  return out;
}

/**
 * For function evaluation, convert adjacent variable-axis terms into explicit multiplication.
 * Example: `ax^2` -> `a*x^2`, while leaving function calls like `sin(x)` untouched.
 */
export function insertImplicitMultiplicationForEvaluation(
  expression: string,
  independentAxisLabel: string,
  variableIdentifiers: readonly string[],
): string {
  if (!expression || variableIdentifiers.length === 0) return expression;
  const axisCandidate = independentAxisLabel.trim() || 'x';
  const axis = isValidGraphVariableName(axisCandidate) ? axisCandidate : 'x';
  const axisRight = escapeRegExp(axis);
  let out = expression;
  const vars = [
    ...new Set(
      variableIdentifiers
        .map((v) => v.trim())
        .filter((v) => v.length > 0 && v !== axis && isValidGraphVariableName(v)),
    ),
  ].sort((a, b) => b.length - a.length);

  for (const name of vars) {
    const left = escapeRegExp(name);
    const implicitRe = new RegExp(`(?<![A-Za-z0-9_])(${left})\\s*(${axisRight})(?![A-Za-z0-9_])`, 'g');
    out = applyReplacementOutsideFunctionRanges(out, implicitRe, '$1*$2');
  }
  return out;
}

/** Format LaTeX shown at the graph origin (uses independent axis + slider names only). */
export function formatGraphOriginLabelLatex(latex: string, embed: GraphEmbed): string {
  const opts = embed.options ?? {};
  const { sliderIds, independentAxisLabel } = collectGraphImplicitMulIdentifiers(
    opts,
    embed.objects ?? [],
  );
  return stripSliderTimesIndependentAxis(latex, independentAxisLabel, sliderIds);
}
