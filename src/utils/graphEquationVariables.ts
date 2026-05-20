const IDENTIFIER_RE = /^[A-Za-z][A-Za-z0-9_]*$/;

function isValidGraphVariableName(name: string): boolean {
  return IDENTIFIER_RE.test(name.trim());
}

const RESERVED = new Set([
  'x',
  'y',
  'e',
  'pi',
  'sin',
  'cos',
  'tan',
  'sec',
  'csc',
  'cot',
  'log',
  'ln',
  'exp',
  'sqrt',
  'abs',
  'asin',
  'acos',
  'atan',
  'sinh',
  'cosh',
  'tanh',
  'operatorname',
]);

const LATEX_FN =
  /\\(sin|cos|tan|sec|csc|cot|ln|log|exp|sqrt|abs|arcsin|arccos|arctan|sinh|cosh|tanh|frac|cdot|times|left|right|mathrm|operatorname)\b/gi;

/** x is always the independent variable symbol, never a slider to create. */
const ALWAYS_EXCLUDED_AXES = new Set(['x', 'y']);

function expandImplicitAxisOperands(
  tokens: string[],
  independentAxis: string,
): string[] {
  const axis = independentAxis.trim();
  if (!axis || !isValidGraphVariableName(axis)) return tokens;

  const out: string[] = [];
  for (const id of tokens) {
    if (
      id.length > axis.length &&
      id.endsWith(axis) &&
      id !== axis
    ) {
      const prefix = id.slice(0, -axis.length);
      if (prefix && isValidGraphVariableName(prefix) && !RESERVED.has(prefix.toLowerCase())) {
        out.push(prefix);
      }
      continue;
    }
    out.push(id);
  }
  return out;
}

/** Strip LaTeX syntax and return identifier-like tokens used as variables. */
export function extractGraphVariableNamesFromLatex(
  latex: string,
  options?: { independentAxis?: string; dependentAxis?: string },
): string[] {
  if (!latex.trim()) return [];
  const independentAxis = options?.independentAxis?.trim() || 'x';
  const dependentAxis = options?.dependentAxis?.trim() || 'y';

  let s = latex.replace(/\s+/g, '');
  s = s.replace(LATEX_FN, ' ');
  s = s.replace(/\\[a-zA-Z]+/g, ' ');
  s = s.replace(/[{}()[\],;=+\-^]/g, ' ');
  const raw: string[] = [];
  const re = /[A-Za-z][A-Za-z0-9_]*/g;
  let m: RegExpExecArray | null = re.exec(s);
  while (m) {
    raw.push(m[0]);
    m = re.exec(s);
  }

  const expanded = expandImplicitAxisOperands(raw, independentAxis);
  const found = new Set<string>();
  for (const id of expanded) {
    const lower = id.toLowerCase();
    if (RESERVED.has(lower)) continue;
    if (ALWAYS_EXCLUDED_AXES.has(lower)) continue;
    if (id === independentAxis || id === dependentAxis) continue;
    if (isValidGraphVariableName(id)) {
      found.add(id);
    }
  }
  return [...found];
}

/** Names used in latex that are not defined as graph variables (sliders). */
export function findUndefinedGraphVariables(
  latex: string,
  definedNames: readonly string[],
  axisLabels: { x?: string; y?: string },
): string[] {
  const defined = new Set(definedNames.map((n) => n.trim()).filter(Boolean));
  const xAxis = axisLabels.x?.trim() || 'x';
  const yAxis = axisLabels.y?.trim() || 'y';
  defined.add(xAxis);
  defined.add(yAxis);
  for (const axis of ALWAYS_EXCLUDED_AXES) {
    defined.add(axis);
  }
  return extractGraphVariableNamesFromLatex(latex, {
    independentAxis: xAxis,
    dependentAxis: yAxis,
  }).filter((name) => !defined.has(name));
}
