/** Normalize LaTeX / math input for JessieCode (JSXGraph). */

export function mathToJessie(input: string): string {

  let s = input.trim().replace(/\s+/g, '');



  s = s.replace(/\\frac\{([^}]*)\}\{([^}]*)\}/g, '($1)/($2)');



  s = s.replace(/\\sqrt\[([^\]]*)\]\{([^}]*)\}/g, '($2)^(1/($1))');

  s = s.replace(/\\sqrt\{([^}]*)\}/g, 'sqrt($1)');



  s = s.replace(/\\arcsin|\\operatorname\{arcsin\}/g, 'asin');

  s = s.replace(/\\arccos|\\operatorname\{arccos\}/g, 'acos');

  s = s.replace(/\\arctan|\\operatorname\{arctan\}/g, 'atan');

  s = s.replace(/\\sin\^{-1}/g, 'asin');

  s = s.replace(/\\cos\^{-1}/g, 'acos');

  s = s.replace(/\\tan\^{-1}/g, 'atan');



  s = s.replace(/\\sinh/g, 'sinh');

  s = s.replace(/\\cosh/g, 'cosh');

  s = s.replace(/\\tanh/g, 'tanh');



  s = s.replace(/\\log_\{([^}]*)\}\{([^}]*)\}/g, '(log($2)/log($1))');

  s = s.replace(/\\log_\{([^}]*)\}\(([^)]*)\)/g, '(log($2)/log($1))');

  s = s.replace(/\\log_\{([^}]*)\}([a-zA-Z0-9.]+)/g, '(log($2)/log($1))');



  s = s.replace(/\\ln/g, 'log');

  s = s.replace(/\\log/g, 'log');



  s = s.replace(/\\exp\{([^}]*)\}/g, 'exp($1)');

  s = s.replace(/\\exp/g, 'exp');



  s = s.replace(/\\sin/g, 'sin');

  s = s.replace(/\\cos/g, 'cos');

  s = s.replace(/\\tan/g, 'tan');

  s = s.replace(/\\sec/g, 'sec');

  s = s.replace(/\\csc/g, 'csc');

  s = s.replace(/\\cot/g, 'cot');



  s = s.replace(/\\pi/g, 'pi');

  s = s.replace(/\\mathrm\{e\}|\\exponentialE/g, 'exp(1)');



  s = s.replace(/\\left\|((?:[^|]|\\\|)*?)\\right\|/g, 'abs($1)');

  s = s.replace(/\\lvert((?:[^|]|\\\|)*?)\\rvert/g, 'abs($1)');

  s = s.replace(/\\abs\{([^}]*)\}/g, 'abs($1)');



  s = s.replace(/\\left|\\right/g, '');

  s = s.replace(/\\cdot|\\times/g, '*');

  s = s.replace(/\\div/g, '/');



  s = s.replace(/\{([a-zA-Z])\}/g, '$1');



  s = s.replace(/\be\^(\{[^}]+\}|\()/g, 'exp(');

  s = s.replace(/\be\^/g, 'exp(');

  s = s.replace(/\|([^|]+)\|/g, 'abs($1)');

  s = s.replace(/\bsec\(([^()]+)\)/g, '(1)/(cos($1))');

  s = s.replace(/\bcsc\(([^()]+)\)/g, '(1)/(sin($1))');

  s = s.replace(/\bcot\(([^()]+)\)/g, '(1)/(tan($1))');



  s = s.replace(/(\d)([a-zA-Z(])/g, '$1*$2');

  s = s.replace(/(\))([a-zA-Z0-9(])/g, '$1*$2');

  s = s.replace(/(\d)pi\b/g, '$1*pi');

  s = s.replace(/pi([a-zA-Z(])/g, 'pi*$1');



  return s;

}



/** Convert Jessie-style math (from {@link mathToJessie}) to a JavaScript expression. */

export function graphMathToJs(jessie: string): string {

  let s = jessie.trim();

  s = s.replace(/\^/g, '**');



  const fnReplacements: [RegExp, string][] = [

    [/\basin\b/g, 'Math.asin'],

    [/\bacos\b/g, 'Math.acos'],

    [/\batan\b/g, 'Math.atan'],

    [/\bsinh\b/g, 'Math.sinh'],

    [/\bcosh\b/g, 'Math.cosh'],

    [/\btanh\b/g, 'Math.tanh'],

    [/\bsin\b/g, 'Math.sin'],

    [/\bcos\b/g, 'Math.cos'],

    [/\btan\b/g, 'Math.tan'],

    [/\babs\b/g, 'Math.abs'],

    [/\bsqrt\b/g, 'Math.sqrt'],

    [/\blog\b/g, 'Math.log'],

    [/\bexp\b/g, 'Math.exp'],

    [/\bpi\b/g, 'Math.PI'],

  ];

  for (const [re, replacement] of fnReplacements) {

    s = s.replace(re, replacement);

  }



  s = s.replace(/(\d)([a-zA-Z(])/g, '$1*$2');

  s = s.replace(/(\))([a-zA-Z0-9(])/g, '$1*$2');



  return s;

}



export type ParsedGraphExpression =

  | { kind: 'function'; body: string }

  | { kind: 'relation'; implicit: string };



function normalizeForParse(latex: string): string {

  return latex.trim().replace(/\s+/g, '');

}



function findRelationEquals(s: string): number {

  for (let i = 0; i < s.length; i += 1) {

    if (s[i] !== '=') continue;

    const prev = s[i - 1];

    if (prev === '<' || prev === '>' || prev === '!') continue;

    return i;

  }

  return -1;

}



function parseAsFunction(normalized: string): string | null {

  const patterns = [

    /^y=(.+)$/i,

    /^f\\left\(x\\right\)=(.+)$/i,

    /^f\(x\)=(.+)$/i,

  ];

  for (const pattern of patterns) {

    const match = normalized.match(pattern);

    if (match?.[1]) return match[1];

  }

  return null;

}



/**

 * Parse an equation field into a function y=f(x) or implicit relation F(x,y)=0.

 * Supports: `y = x^2`, `y = \sin(x)`, `x + y = 5`, `x^2 + y^2 = 25`.

 */

export function parseGraphExpression(latex: string): ParsedGraphExpression | null {

  const raw = latex.trim();

  if (!raw) return null;



  const normalized = normalizeForParse(raw);



  const fnBody = parseAsFunction(normalized);

  if (fnBody) {

    const body = mathToJessie(fnBody);

    return body ? { kind: 'function', body } : null;

  }



  const eqIndex = findRelationEquals(normalized);

  if (eqIndex >= 0) {

    const left = normalized.slice(0, eqIndex);

    const right = normalized.slice(eqIndex + 1);

    if (!left || !right) return null;

    const implicit = mathToJessie(`(${left})-(${right})`);

    return implicit ? { kind: 'relation', implicit } : null;

  }



  const body = mathToJessie(normalized);

  return body ? { kind: 'function', body } : null;

}


