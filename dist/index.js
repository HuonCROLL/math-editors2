"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } } function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }










































var _chunkJJSHIBONjs = require('./chunk-JJSHIBON.js');






var _chunkIZE4D3JYjs = require('./chunk-IZE4D3JY.js');

// src/editors/MathLiveEditor.tsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _material = require('@mui/material');
require('mathlive');

// src/components/EquationInsertPanel.tsx

var _jsxruntime = require('react/jsx-runtime');
var SNIPPETS = [
  { label: "+", latex: "+" },
  { label: "\u2212", latex: "-" },
  { label: "\xD7", latex: "\\times" },
  { label: "x\xB2", latex: "x^{2}" },
  { label: "x\u207F", latex: "x^{a}" },
  { label: "\xF7", latex: "\\div" },
  { label: "\u221A", latex: "\\sqrt{}" },
  { label: "\u207F\u221A", latex: "\\sqrt[n]{}" },
  { label: "a\u2044b", latex: "\\frac{a}{b}" },
  { label: "\u03C0", latex: "\\pi" },
  { label: "\u03B8", latex: "\\theta" },
  { label: "\u2264", latex: "\\leq" },
  { label: "\u2265", latex: "\\geq" }
];
var TRIGONOMETRY = [
  { label: "sin", latex: "\\sin" },
  { label: "cos", latex: "\\cos" },
  { label: "tan", latex: "\\tan" },
  { label: "cot", latex: "\\cot" },
  { label: "sec", latex: "\\sec" },
  { label: "csc", latex: "\\csc" },
  { label: "sin\u207B\xB9", latex: "\\arcsin" },
  { label: "cos\u207B\xB9", latex: "\\arccos" },
  { label: "tan\u207B\xB9", latex: "\\arctan" },
  { label: "sinh", latex: "\\sinh" },
  { label: "cosh", latex: "\\cosh" },
  { label: "\xB0", latex: "\\degree" }
];
var CALCULUS = [
  { label: "d/dx", latex: "\\frac{d}{dx}" },
  { label: "\u2202/\u2202x", latex: "\\frac{\\partial}{\\partial x}" },
  { label: "\u222B", latex: "\\int" },
  { label: "\u222B\u2090\u1D47", latex: "\\int_{a}^{b}" },
  { label: "[ ]\u2090\u1D47", latex: "\\left[\\right]_{a}^{b}" },
  { label: "lim", latex: "\\lim_{x \\to \\infty}" },
  { label: "log\u2081\u2080", latex: "\\log_{10}" },
  { label: "log\u2090", latex: "\\log_{a}" },
  { label: "ln", latex: "\\ln" },
  { label: "exp", latex: "\\exp" }
];
var GREEK = [
  { label: "\u03B1", latex: "\\alpha" },
  { label: "\u03B2", latex: "\\beta" },
  { label: "\u03B3", latex: "\\gamma" },
  { label: "\u03B4", latex: "\\delta" },
  { label: "\u03B5", latex: "\\varepsilon" },
  { label: "\u03B8", latex: "\\theta" },
  { label: "\u03BB", latex: "\\lambda" },
  { label: "\u03BC", latex: "\\mu" },
  { label: "\u03C0", latex: "\\pi" },
  { label: "\u03C3", latex: "\\sigma" },
  { label: "\u03C6", latex: "\\phi" },
  { label: "\u03C9", latex: "\\omega" },
  { label: "\u03A9", latex: "\\Omega" },
  { label: "\u0394", latex: "\\Delta" },
  { label: "\u03A3", latex: "\\Sigma" },
  { label: "\u221E", latex: "\\infty" }
];
var UNITS = [
  { label: "$", latex: "\\$" },
  { label: "%", latex: "\\%" },
  { label: "\xB0", latex: "\\degree" },
  { label: "\xB0C", latex: "\\degree\\mathrm{C}" },
  { label: "mm\xB2", latex: "\\mathrm{mm}^2" },
  { label: "cm\xB2", latex: "\\mathrm{cm}^2" },
  { label: "m\xB2", latex: "\\mathrm{m}^2" },
  { label: "km\xB2", latex: "\\mathrm{km}^2" },
  { label: "mm\xB3", latex: "\\mathrm{mm}^3" },
  { label: "cm\xB3", latex: "\\mathrm{cm}^3" },
  { label: "m\xB3", latex: "\\mathrm{m}^3" },
  { label: "km\xB3", latex: "\\mathrm{km}^3" },
  { label: "m/s\xB2", latex: "\\mathrm{m}/\\mathrm{s}^2" },
  { label: "\u03A9", latex: "\\Omega" },
  { label: "\u03BCm", latex: "\\mu\\mathrm{m}" },
  { label: "\u03BCL", latex: "\\mu\\mathrm{L}" }
];
var CATEGORIES = [
  { label: "Trig", snippets: TRIGONOMETRY },
  { label: "Calc", snippets: CALCULUS },
  { label: "Greek", snippets: GREEK },
  { label: "Units", snippets: UNITS }
];
var btnStyle = {
  minWidth: 44,
  height: 28,
  padding: "0 8px",
  fontSize: 13,
  border: "1px solid #ccc",
  borderRadius: 4,
  background: "#fff",
  cursor: "pointer",
  whiteSpace: "nowrap"
};
function EquationInsertPanel({ mathFieldRef, open, onClose }) {
  const [tabIndex, setTabIndex] = _react.useState.call(void 0, null);
  _react.useEffect.call(void 0, () => {
    if (!open) return;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);
  const insertLatex = (latex) => {
    const mf = mathFieldRef.current;
    if (!mf) return;
    try {
      if (typeof mf.insert === "function") {
        mf.insert(latex);
      } else {
        _optionalChain([mf, 'access', _2 => _2.executeCommand, 'optionalCall', _3 => _3(["insert", latex])]);
      }
      _optionalChain([mf, 'access', _4 => _4.focus, 'optionalCall', _5 => _5()]);
    } catch (_) {
    }
  };
  if (!open) return null;
  const snippets = tabIndex === null ? [] : _nullishCoalesce(_optionalChain([CATEGORIES, 'access', _6 => _6[tabIndex], 'optionalAccess', _7 => _7.snippets]), () => ( []));
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
    "div",
    {
      className: "inline-math-insert-panel",
      style: {
        minWidth: 300,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        padding: 8,
        background: "#fff",
        borderRadius: 6,
        border: "1px solid #e0e0e0",
        boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
        zIndex: 9999
      },
      onMouseDown: (e) => e.stopPropagation(),
      children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { style: { display: "grid", gridTemplateColumns: "repeat(6, minmax(40px, 1fr))", gap: 4 }, children: SNIPPETS.map(({ label, latex }) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
          "button",
          {
            type: "button",
            style: btnStyle,
            onMouseDown: (e) => {
              e.preventDefault();
              insertLatex(latex);
            },
            children: label
          },
          `${label}-${latex}`
        )) }),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { style: { display: "flex", alignItems: "center", justifyContent: "center", gap: 6, flexWrap: "wrap" }, children: CATEGORIES.map((cat, i) => /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _react2.default.Fragment, { children: [
          i > 0 && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { color: "#999", fontSize: 12 }, children: "|" }),
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
            "button",
            {
              type: "button",
              style: {
                fontSize: 12,
                padding: "2px 4px",
                border: 0,
                borderRadius: 3,
                background: i === tabIndex ? "rgba(25, 118, 210, 0.10)" : "transparent",
                color: i === tabIndex ? "#1976d2" : "#444",
                cursor: "pointer"
              },
              onMouseDown: (e) => {
                e.preventDefault();
                setTabIndex((current) => current === i ? null : i);
              },
              children: cat.label
            }
          )
        ] }, cat.label)) }),
        tabIndex !== null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
          "div",
          {
            style: {
              display: "grid",
              gridTemplateColumns: "repeat(6, minmax(40px, 1fr))",
              gap: 4,
              maxHeight: 120,
              overflowY: "auto"
            },
            children: snippets.map(({ label, latex }) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
              "button",
              {
                type: "button",
                style: btnStyle,
                onMouseDown: (e) => {
                  e.preventDefault();
                  insertLatex(latex);
                },
                children: label
              },
              `${label}-${latex}`
            ))
          }
        )
      ]
    }
  );
}

// src/editors/MathLiveEditor.tsx

var MathLiveEditor = ({
  value,
  onChange,
  minWidthPx = 220,
  minWidthPercent = 55,
  minHeightPx = 48,
  maxHeightPx = 120
}) => {
  const mathFieldRef = _react.useRef.call(void 0, null);
  const containerRef = _react.useRef.call(void 0, null);
  const panelWrapperRef = _react.useRef.call(void 0, null);
  const insertButtonRef = _react.useRef.call(void 0, null);
  const [panelOpen, setPanelOpen] = _react.useState.call(void 0, false);
  const [mathFieldWidth, setMathFieldWidth] = _react.useState.call(void 0, null);
  const estimatedContentWidth = Math.max(minWidthPx, Math.min(640, 120 + (_nullishCoalesce(value, () => ( ""))).length * 11));
  const resolvedMathFieldWidth = mathFieldWidth ? Math.min(mathFieldWidth, estimatedContentWidth) : estimatedContentWidth;
  _react.useEffect.call(void 0, () => {
    if (!panelOpen) return void 0;
    const handleClickOutside = (event) => {
      const container = containerRef.current;
      if (container && !container.contains(event.target)) {
        setPanelOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [panelOpen]);
  _react.useEffect.call(void 0, () => {
    const container = containerRef.current;
    if (!container) return void 0;
    const updateEditorWidth = () => {
      const containerWidth = container.clientWidth;
      const minEditorWidth = Math.max(minWidthPx, Math.round(containerWidth * minWidthPercent / 100));
      const available = Math.min(Math.max(minEditorWidth, containerWidth), containerWidth);
      setMathFieldWidth(available);
    };
    updateEditorWidth();
    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", updateEditorWidth);
      return () => window.removeEventListener("resize", updateEditorWidth);
    }
    const resizeObserver = new ResizeObserver(() => updateEditorWidth());
    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, [minWidthPercent, minWidthPx]);
  _react.useEffect.call(void 0, () => {
    const mathField = mathFieldRef.current;
    if (!mathField) return;
    const nextVal = _nullishCoalesce(value, () => ( ""));
    if (mathField.value !== nextVal) {
      mathField.value = nextVal;
    }
  }, [value]);
  _react.useEffect.call(void 0, () => {
    const mathField = mathFieldRef.current;
    if (!mathField) return void 0;
    const insertMathSpace = (event) => {
      if (event.key !== " " || event.ctrlKey || event.metaKey || event.altKey) return;
      event.preventDefault();
      _nullishCoalesce(_optionalChain([mathField, 'access', _8 => _8.insert, 'optionalCall', _9 => _9("\\;")]), () => ( _optionalChain([mathField, 'access', _10 => _10.executeCommand, 'optionalCall', _11 => _11(["insert", "\\;"])])));
    };
    const handleInput = () => {
      onChange(_nullishCoalesce(mathField.value, () => ( "")));
    };
    mathField.addEventListener("keydown", insertMathSpace);
    mathField.addEventListener("input", handleInput);
    return () => {
      mathField.removeEventListener("keydown", insertMathSpace);
      mathField.removeEventListener("input", handleInput);
    };
  }, [onChange]);
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
    _material.Box,
    {
      ref: containerRef,
      sx: {
        position: "relative",
        display: "flex",
        alignItems: "center",
        width: "100%",
        maxWidth: "100%"
      },
      children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "style", { children: `
        .mathlive-editor-standalone::part(virtual-keyboard-toggle) {
          display: none;
        }
        .mathlive-editor-standalone::part(menu-toggle) {
          display: none;
        }
        math-field.mathlive-editor-standalone {
          color-scheme: light;
          --selection-background-color: hsl(210, 65%, 88%);
          --contains-highlight-background-color: hsl(210, 40%, 94%);
          --selection-color: #111827;
          vertical-align: middle;
        }
        math-field.mathlive-editor-standalone::part(content) {
          align-items: center;
        }
      ` }),
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
          _material.Box,
          {
            sx: {
              position: "relative",
              width: `${resolvedMathFieldWidth}px`,
              maxWidth: "100%",
              minWidth: `${minWidthPx}px`,
              flex: "0 1 auto"
            },
            children: [
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                "math-field",
                {
                  ref: mathFieldRef,
                  className: "mathlive-editor-standalone",
                  "data-math-virtual-keyboard-policy": "manual",
                  style: {
                    display: "block",
                    boxSizing: "border-box",
                    fontSize: "1.25rem",
                    width: "100%",
                    minHeight: `${minHeightPx}px`,
                    maxHeight: `${maxHeightPx}px`,
                    border: "1px solid #ccc",
                    borderRadius: 8,
                    padding: "6px 48px 6px 10px",
                    overflowX: "auto",
                    overflowY: "auto"
                  }
                }
              ),
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _material.Tooltip, { title: "Insert equation symbols", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                _material.Box,
                {
                  component: "button",
                  ref: insertButtonRef,
                  type: "button",
                  "aria-label": "Insert symbols",
                  onMouseDown: (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                  },
                  onClick: () => setPanelOpen((open) => !open),
                  sx: {
                    position: "absolute",
                    right: 6,
                    top: "50%",
                    transform: "translateY(-50%)",
                    border: 0,
                    borderRadius: "6px",
                    px: 0.75,
                    py: 0.25,
                    bgcolor: panelOpen ? "rgba(25, 118, 210, 0.10)" : "transparent",
                    color: panelOpen ? "primary.main" : "text.secondary",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    fontSize: "0.9rem",
                    fontWeight: 700,
                    fontStyle: "normal",
                    lineHeight: 1.2,
                    "&:hover": { bgcolor: "action.hover" }
                  },
                  children: "f(x)"
                }
              ) }),
              panelOpen && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                _material.Box,
                {
                  ref: panelWrapperRef,
                  sx: {
                    position: "absolute",
                    zIndex: 1600,
                    top: "calc(100% + 8px)",
                    left: 0,
                    width: "100%",
                    minWidth: 280
                  },
                  children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                    EquationInsertPanel,
                    {
                      mathFieldRef,
                      open: panelOpen,
                      onClose: () => setPanelOpen(false)
                    }
                  )
                }
              )
            ]
          }
        )
      ]
    }
  );
};
var MathLiveEditor_default = MathLiveEditor;

// src/editors/ExplanationEditor.tsx


var _react3 = require('@tiptap/react');
var _starterkit = require('@tiptap/starter-kit'); var _starterkit2 = _interopRequireDefault(_starterkit);

// src/extensions/MathematicsWithInlineEdit.ts
var _core = require('@tiptap/core');
var _extensionmathematics = require('@tiptap/extension-mathematics');

// src/extensions/InlineMathWithMathLive.ts
var _katex = require('katex'); var _katex2 = _interopRequireDefault(_katex);

// src/extensions/InlineMathWithParens.ts


// node_modules/prosemirror-model/dist/index.js
function findDiffStart(a, b, pos) {
  for (let i = 0; ; i++) {
    if (i == a.childCount || i == b.childCount)
      return a.childCount == b.childCount ? null : pos;
    let childA = a.child(i), childB = b.child(i);
    if (childA == childB) {
      pos += childA.nodeSize;
      continue;
    }
    if (!childA.sameMarkup(childB))
      return pos;
    if (childA.isText && childA.text != childB.text) {
      for (let j = 0; childA.text[j] == childB.text[j]; j++)
        pos++;
      return pos;
    }
    if (childA.content.size || childB.content.size) {
      let inner = findDiffStart(childA.content, childB.content, pos + 1);
      if (inner != null)
        return inner;
    }
    pos += childA.nodeSize;
  }
}
function findDiffEnd(a, b, posA, posB) {
  for (let iA = a.childCount, iB = b.childCount; ; ) {
    if (iA == 0 || iB == 0)
      return iA == iB ? null : { a: posA, b: posB };
    let childA = a.child(--iA), childB = b.child(--iB), size = childA.nodeSize;
    if (childA == childB) {
      posA -= size;
      posB -= size;
      continue;
    }
    if (!childA.sameMarkup(childB))
      return { a: posA, b: posB };
    if (childA.isText && childA.text != childB.text) {
      let same = 0, minSize = Math.min(childA.text.length, childB.text.length);
      while (same < minSize && childA.text[childA.text.length - same - 1] == childB.text[childB.text.length - same - 1]) {
        same++;
        posA--;
        posB--;
      }
      return { a: posA, b: posB };
    }
    if (childA.content.size || childB.content.size) {
      let inner = findDiffEnd(childA.content, childB.content, posA - 1, posB - 1);
      if (inner)
        return inner;
    }
    posA -= size;
    posB -= size;
  }
}
var Fragment = class _Fragment {
  /**
  @internal
  */
  constructor(content, size) {
    this.content = content;
    this.size = size || 0;
    if (size == null)
      for (let i = 0; i < content.length; i++)
        this.size += content[i].nodeSize;
  }
  /**
  Invoke a callback for all descendant nodes between the given two
  positions (relative to start of this fragment). Doesn't descend
  into a node when the callback returns `false`.
  */
  nodesBetween(from, to, f, nodeStart = 0, parent) {
    for (let i = 0, pos = 0; pos < to; i++) {
      let child = this.content[i], end = pos + child.nodeSize;
      if (end > from && f(child, nodeStart + pos, parent || null, i) !== false && child.content.size) {
        let start = pos + 1;
        child.nodesBetween(Math.max(0, from - start), Math.min(child.content.size, to - start), f, nodeStart + start);
      }
      pos = end;
    }
  }
  /**
  Call the given callback for every descendant node. `pos` will be
  relative to the start of the fragment. The callback may return
  `false` to prevent traversal of a given node's children.
  */
  descendants(f) {
    this.nodesBetween(0, this.size, f);
  }
  /**
  Extract the text between `from` and `to`. See the same method on
  [`Node`](https://prosemirror.net/docs/ref/#model.Node.textBetween).
  */
  textBetween(from, to, blockSeparator, leafText) {
    let text = "", first = true;
    this.nodesBetween(from, to, (node, pos) => {
      let nodeText = node.isText ? node.text.slice(Math.max(from, pos) - pos, to - pos) : !node.isLeaf ? "" : leafText ? typeof leafText === "function" ? leafText(node) : leafText : node.type.spec.leafText ? node.type.spec.leafText(node) : "";
      if (node.isBlock && (node.isLeaf && nodeText || node.isTextblock) && blockSeparator) {
        if (first)
          first = false;
        else
          text += blockSeparator;
      }
      text += nodeText;
    }, 0);
    return text;
  }
  /**
  Create a new fragment containing the combined content of this
  fragment and the other.
  */
  append(other) {
    if (!other.size)
      return this;
    if (!this.size)
      return other;
    let last = this.lastChild, first = other.firstChild, content = this.content.slice(), i = 0;
    if (last.isText && last.sameMarkup(first)) {
      content[content.length - 1] = last.withText(last.text + first.text);
      i = 1;
    }
    for (; i < other.content.length; i++)
      content.push(other.content[i]);
    return new _Fragment(content, this.size + other.size);
  }
  /**
  Cut out the sub-fragment between the two given positions.
  */
  cut(from, to = this.size) {
    if (from == 0 && to == this.size)
      return this;
    let result = [], size = 0;
    if (to > from)
      for (let i = 0, pos = 0; pos < to; i++) {
        let child = this.content[i], end = pos + child.nodeSize;
        if (end > from) {
          if (pos < from || end > to) {
            if (child.isText)
              child = child.cut(Math.max(0, from - pos), Math.min(child.text.length, to - pos));
            else
              child = child.cut(Math.max(0, from - pos - 1), Math.min(child.content.size, to - pos - 1));
          }
          result.push(child);
          size += child.nodeSize;
        }
        pos = end;
      }
    return new _Fragment(result, size);
  }
  /**
  @internal
  */
  cutByIndex(from, to) {
    if (from == to)
      return _Fragment.empty;
    if (from == 0 && to == this.content.length)
      return this;
    return new _Fragment(this.content.slice(from, to));
  }
  /**
  Create a new fragment in which the node at the given index is
  replaced by the given node.
  */
  replaceChild(index, node) {
    let current = this.content[index];
    if (current == node)
      return this;
    let copy = this.content.slice();
    let size = this.size + node.nodeSize - current.nodeSize;
    copy[index] = node;
    return new _Fragment(copy, size);
  }
  /**
  Create a new fragment by prepending the given node to this
  fragment.
  */
  addToStart(node) {
    return new _Fragment([node].concat(this.content), this.size + node.nodeSize);
  }
  /**
  Create a new fragment by appending the given node to this
  fragment.
  */
  addToEnd(node) {
    return new _Fragment(this.content.concat(node), this.size + node.nodeSize);
  }
  /**
  Compare this fragment to another one.
  */
  eq(other) {
    if (this.content.length != other.content.length)
      return false;
    for (let i = 0; i < this.content.length; i++)
      if (!this.content[i].eq(other.content[i]))
        return false;
    return true;
  }
  /**
  The first child of the fragment, or `null` if it is empty.
  */
  get firstChild() {
    return this.content.length ? this.content[0] : null;
  }
  /**
  The last child of the fragment, or `null` if it is empty.
  */
  get lastChild() {
    return this.content.length ? this.content[this.content.length - 1] : null;
  }
  /**
  The number of child nodes in this fragment.
  */
  get childCount() {
    return this.content.length;
  }
  /**
  Get the child node at the given index. Raise an error when the
  index is out of range.
  */
  child(index) {
    let found2 = this.content[index];
    if (!found2)
      throw new RangeError("Index " + index + " out of range for " + this);
    return found2;
  }
  /**
  Get the child node at the given index, if it exists.
  */
  maybeChild(index) {
    return this.content[index] || null;
  }
  /**
  Call `f` for every child node, passing the node, its offset
  into this parent node, and its index.
  */
  forEach(f) {
    for (let i = 0, p = 0; i < this.content.length; i++) {
      let child = this.content[i];
      f(child, p, i);
      p += child.nodeSize;
    }
  }
  /**
  Find the first position at which this fragment and another
  fragment differ, or `null` if they are the same.
  */
  findDiffStart(other, pos = 0) {
    return findDiffStart(this, other, pos);
  }
  /**
  Find the first position, searching from the end, at which this
  fragment and the given fragment differ, or `null` if they are
  the same. Since this position will not be the same in both
  nodes, an object with two separate positions is returned.
  */
  findDiffEnd(other, pos = this.size, otherPos = other.size) {
    return findDiffEnd(this, other, pos, otherPos);
  }
  /**
  Find the index and inner offset corresponding to a given relative
  position in this fragment. The result object will be reused
  (overwritten) the next time the function is called. @internal
  */
  findIndex(pos) {
    if (pos == 0)
      return retIndex(0, pos);
    if (pos == this.size)
      return retIndex(this.content.length, pos);
    if (pos > this.size || pos < 0)
      throw new RangeError(`Position ${pos} outside of fragment (${this})`);
    for (let i = 0, curPos = 0; ; i++) {
      let cur = this.child(i), end = curPos + cur.nodeSize;
      if (end >= pos) {
        if (end == pos)
          return retIndex(i + 1, end);
        return retIndex(i, curPos);
      }
      curPos = end;
    }
  }
  /**
  Return a debugging string that describes this fragment.
  */
  toString() {
    return "<" + this.toStringInner() + ">";
  }
  /**
  @internal
  */
  toStringInner() {
    return this.content.join(", ");
  }
  /**
  Create a JSON-serializeable representation of this fragment.
  */
  toJSON() {
    return this.content.length ? this.content.map((n) => n.toJSON()) : null;
  }
  /**
  Deserialize a fragment from its JSON representation.
  */
  static fromJSON(schema, value) {
    if (!value)
      return _Fragment.empty;
    if (!Array.isArray(value))
      throw new RangeError("Invalid input for Fragment.fromJSON");
    return new _Fragment(value.map(schema.nodeFromJSON));
  }
  /**
  Build a fragment from an array of nodes. Ensures that adjacent
  text nodes with the same marks are joined together.
  */
  static fromArray(array) {
    if (!array.length)
      return _Fragment.empty;
    let joined, size = 0;
    for (let i = 0; i < array.length; i++) {
      let node = array[i];
      size += node.nodeSize;
      if (i && node.isText && array[i - 1].sameMarkup(node)) {
        if (!joined)
          joined = array.slice(0, i);
        joined[joined.length - 1] = node.withText(joined[joined.length - 1].text + node.text);
      } else if (joined) {
        joined.push(node);
      }
    }
    return new _Fragment(joined || array, size);
  }
  /**
  Create a fragment from something that can be interpreted as a
  set of nodes. For `null`, it returns the empty fragment. For a
  fragment, the fragment itself. For a node or array of nodes, a
  fragment containing those nodes.
  */
  static from(nodes) {
    if (!nodes)
      return _Fragment.empty;
    if (nodes instanceof _Fragment)
      return nodes;
    if (Array.isArray(nodes))
      return this.fromArray(nodes);
    if (nodes.attrs)
      return new _Fragment([nodes], nodes.nodeSize);
    throw new RangeError("Can not convert " + nodes + " to a Fragment" + (nodes.nodesBetween ? " (looks like multiple versions of prosemirror-model were loaded)" : ""));
  }
};
Fragment.empty = new Fragment([], 0);
var found = { index: 0, offset: 0 };
function retIndex(index, offset) {
  found.index = index;
  found.offset = offset;
  return found;
}
function compareDeep(a, b) {
  if (a === b)
    return true;
  if (!(a && typeof a == "object") || !(b && typeof b == "object"))
    return false;
  let array = Array.isArray(a);
  if (Array.isArray(b) != array)
    return false;
  if (array) {
    if (a.length != b.length)
      return false;
    for (let i = 0; i < a.length; i++)
      if (!compareDeep(a[i], b[i]))
        return false;
  } else {
    for (let p in a)
      if (!(p in b) || !compareDeep(a[p], b[p]))
        return false;
    for (let p in b)
      if (!(p in a))
        return false;
  }
  return true;
}
var Mark = class _Mark {
  /**
  @internal
  */
  constructor(type, attrs) {
    this.type = type;
    this.attrs = attrs;
  }
  /**
  Given a set of marks, create a new set which contains this one as
  well, in the right position. If this mark is already in the set,
  the set itself is returned. If any marks that are set to be
  [exclusive](https://prosemirror.net/docs/ref/#model.MarkSpec.excludes) with this mark are present,
  those are replaced by this one.
  */
  addToSet(set) {
    let copy, placed = false;
    for (let i = 0; i < set.length; i++) {
      let other = set[i];
      if (this.eq(other))
        return set;
      if (this.type.excludes(other.type)) {
        if (!copy)
          copy = set.slice(0, i);
      } else if (other.type.excludes(this.type)) {
        return set;
      } else {
        if (!placed && other.type.rank > this.type.rank) {
          if (!copy)
            copy = set.slice(0, i);
          copy.push(this);
          placed = true;
        }
        if (copy)
          copy.push(other);
      }
    }
    if (!copy)
      copy = set.slice();
    if (!placed)
      copy.push(this);
    return copy;
  }
  /**
  Remove this mark from the given set, returning a new set. If this
  mark is not in the set, the set itself is returned.
  */
  removeFromSet(set) {
    for (let i = 0; i < set.length; i++)
      if (this.eq(set[i]))
        return set.slice(0, i).concat(set.slice(i + 1));
    return set;
  }
  /**
  Test whether this mark is in the given set of marks.
  */
  isInSet(set) {
    for (let i = 0; i < set.length; i++)
      if (this.eq(set[i]))
        return true;
    return false;
  }
  /**
  Test whether this mark has the same type and attributes as
  another mark.
  */
  eq(other) {
    return this == other || this.type == other.type && compareDeep(this.attrs, other.attrs);
  }
  /**
  Convert this mark to a JSON-serializeable representation.
  */
  toJSON() {
    let obj = { type: this.type.name };
    for (let _ in this.attrs) {
      obj.attrs = this.attrs;
      break;
    }
    return obj;
  }
  /**
  Deserialize a mark from JSON.
  */
  static fromJSON(schema, json) {
    if (!json)
      throw new RangeError("Invalid input for Mark.fromJSON");
    let type = schema.marks[json.type];
    if (!type)
      throw new RangeError(`There is no mark type ${json.type} in this schema`);
    let mark = type.create(json.attrs);
    type.checkAttrs(mark.attrs);
    return mark;
  }
  /**
  Test whether two sets of marks are identical.
  */
  static sameSet(a, b) {
    if (a == b)
      return true;
    if (a.length != b.length)
      return false;
    for (let i = 0; i < a.length; i++)
      if (!a[i].eq(b[i]))
        return false;
    return true;
  }
  /**
  Create a properly sorted mark set from null, a single mark, or an
  unsorted array of marks.
  */
  static setFrom(marks) {
    if (!marks || Array.isArray(marks) && marks.length == 0)
      return _Mark.none;
    if (marks instanceof _Mark)
      return [marks];
    let copy = marks.slice();
    copy.sort((a, b) => a.type.rank - b.type.rank);
    return copy;
  }
};
Mark.none = [];
var ReplaceError = class extends Error {
};
var Slice = class _Slice {
  /**
  Create a slice. When specifying a non-zero open depth, you must
  make sure that there are nodes of at least that depth at the
  appropriate side of the fragment—i.e. if the fragment is an
  empty paragraph node, `openStart` and `openEnd` can't be greater
  than 1.
  
  It is not necessary for the content of open nodes to conform to
  the schema's content constraints, though it should be a valid
  start/end/middle for such a node, depending on which sides are
  open.
  */
  constructor(content, openStart, openEnd) {
    this.content = content;
    this.openStart = openStart;
    this.openEnd = openEnd;
  }
  /**
  The size this slice would add when inserted into a document.
  */
  get size() {
    return this.content.size - this.openStart - this.openEnd;
  }
  /**
  @internal
  */
  insertAt(pos, fragment) {
    let content = insertInto(this.content, pos + this.openStart, fragment);
    return content && new _Slice(content, this.openStart, this.openEnd);
  }
  /**
  @internal
  */
  removeBetween(from, to) {
    return new _Slice(removeRange(this.content, from + this.openStart, to + this.openStart), this.openStart, this.openEnd);
  }
  /**
  Tests whether this slice is equal to another slice.
  */
  eq(other) {
    return this.content.eq(other.content) && this.openStart == other.openStart && this.openEnd == other.openEnd;
  }
  /**
  @internal
  */
  toString() {
    return this.content + "(" + this.openStart + "," + this.openEnd + ")";
  }
  /**
  Convert a slice to a JSON-serializable representation.
  */
  toJSON() {
    if (!this.content.size)
      return null;
    let json = { content: this.content.toJSON() };
    if (this.openStart > 0)
      json.openStart = this.openStart;
    if (this.openEnd > 0)
      json.openEnd = this.openEnd;
    return json;
  }
  /**
  Deserialize a slice from its JSON representation.
  */
  static fromJSON(schema, json) {
    if (!json)
      return _Slice.empty;
    let openStart = json.openStart || 0, openEnd = json.openEnd || 0;
    if (typeof openStart != "number" || typeof openEnd != "number")
      throw new RangeError("Invalid input for Slice.fromJSON");
    return new _Slice(Fragment.fromJSON(schema, json.content), openStart, openEnd);
  }
  /**
  Create a slice from a fragment by taking the maximum possible
  open value on both side of the fragment.
  */
  static maxOpen(fragment, openIsolating = true) {
    let openStart = 0, openEnd = 0;
    for (let n = fragment.firstChild; n && !n.isLeaf && (openIsolating || !n.type.spec.isolating); n = n.firstChild)
      openStart++;
    for (let n = fragment.lastChild; n && !n.isLeaf && (openIsolating || !n.type.spec.isolating); n = n.lastChild)
      openEnd++;
    return new _Slice(fragment, openStart, openEnd);
  }
};
Slice.empty = new Slice(Fragment.empty, 0, 0);
function removeRange(content, from, to) {
  let { index, offset } = content.findIndex(from), child = content.maybeChild(index);
  let { index: indexTo, offset: offsetTo } = content.findIndex(to);
  if (offset == from || child.isText) {
    if (offsetTo != to && !content.child(indexTo).isText)
      throw new RangeError("Removing non-flat range");
    return content.cut(0, from).append(content.cut(to));
  }
  if (index != indexTo)
    throw new RangeError("Removing non-flat range");
  return content.replaceChild(index, child.copy(removeRange(child.content, from - offset - 1, to - offset - 1)));
}
function insertInto(content, dist, insert, parent) {
  let { index, offset } = content.findIndex(dist), child = content.maybeChild(index);
  if (offset == dist || child.isText) {
    if (parent && !parent.canReplace(index, index, insert))
      return null;
    return content.cut(0, dist).append(insert).append(content.cut(dist));
  }
  let inner = insertInto(child.content, dist - offset - 1, insert, child);
  return inner && content.replaceChild(index, child.copy(inner));
}
function replace($from, $to, slice) {
  if (slice.openStart > $from.depth)
    throw new ReplaceError("Inserted content deeper than insertion position");
  if ($from.depth - slice.openStart != $to.depth - slice.openEnd)
    throw new ReplaceError("Inconsistent open depths");
  return replaceOuter($from, $to, slice, 0);
}
function replaceOuter($from, $to, slice, depth) {
  let index = $from.index(depth), node = $from.node(depth);
  if (index == $to.index(depth) && depth < $from.depth - slice.openStart) {
    let inner = replaceOuter($from, $to, slice, depth + 1);
    return node.copy(node.content.replaceChild(index, inner));
  } else if (!slice.content.size) {
    return close(node, replaceTwoWay($from, $to, depth));
  } else if (!slice.openStart && !slice.openEnd && $from.depth == depth && $to.depth == depth) {
    let parent = $from.parent, content = parent.content;
    return close(parent, content.cut(0, $from.parentOffset).append(slice.content).append(content.cut($to.parentOffset)));
  } else {
    let { start, end } = prepareSliceForReplace(slice, $from);
    return close(node, replaceThreeWay($from, start, end, $to, depth));
  }
}
function checkJoin(main, sub) {
  if (!sub.type.compatibleContent(main.type))
    throw new ReplaceError("Cannot join " + sub.type.name + " onto " + main.type.name);
}
function joinable($before, $after, depth) {
  let node = $before.node(depth);
  checkJoin(node, $after.node(depth));
  return node;
}
function addNode(child, target) {
  let last = target.length - 1;
  if (last >= 0 && child.isText && child.sameMarkup(target[last]))
    target[last] = child.withText(target[last].text + child.text);
  else
    target.push(child);
}
function addRange($start, $end, depth, target) {
  let node = ($end || $start).node(depth);
  let startIndex = 0, endIndex = $end ? $end.index(depth) : node.childCount;
  if ($start) {
    startIndex = $start.index(depth);
    if ($start.depth > depth) {
      startIndex++;
    } else if ($start.textOffset) {
      addNode($start.nodeAfter, target);
      startIndex++;
    }
  }
  for (let i = startIndex; i < endIndex; i++)
    addNode(node.child(i), target);
  if ($end && $end.depth == depth && $end.textOffset)
    addNode($end.nodeBefore, target);
}
function close(node, content) {
  node.type.checkContent(content);
  return node.copy(content);
}
function replaceThreeWay($from, $start, $end, $to, depth) {
  let openStart = $from.depth > depth && joinable($from, $start, depth + 1);
  let openEnd = $to.depth > depth && joinable($end, $to, depth + 1);
  let content = [];
  addRange(null, $from, depth, content);
  if (openStart && openEnd && $start.index(depth) == $end.index(depth)) {
    checkJoin(openStart, openEnd);
    addNode(close(openStart, replaceThreeWay($from, $start, $end, $to, depth + 1)), content);
  } else {
    if (openStart)
      addNode(close(openStart, replaceTwoWay($from, $start, depth + 1)), content);
    addRange($start, $end, depth, content);
    if (openEnd)
      addNode(close(openEnd, replaceTwoWay($end, $to, depth + 1)), content);
  }
  addRange($to, null, depth, content);
  return new Fragment(content);
}
function replaceTwoWay($from, $to, depth) {
  let content = [];
  addRange(null, $from, depth, content);
  if ($from.depth > depth) {
    let type = joinable($from, $to, depth + 1);
    addNode(close(type, replaceTwoWay($from, $to, depth + 1)), content);
  }
  addRange($to, null, depth, content);
  return new Fragment(content);
}
function prepareSliceForReplace(slice, $along) {
  let extra = $along.depth - slice.openStart, parent = $along.node(extra);
  let node = parent.copy(slice.content);
  for (let i = extra - 1; i >= 0; i--)
    node = $along.node(i).copy(Fragment.from(node));
  return {
    start: node.resolveNoCache(slice.openStart + extra),
    end: node.resolveNoCache(node.content.size - slice.openEnd - extra)
  };
}
var ResolvedPos = class _ResolvedPos {
  /**
  @internal
  */
  constructor(pos, path, parentOffset) {
    this.pos = pos;
    this.path = path;
    this.parentOffset = parentOffset;
    this.depth = path.length / 3 - 1;
  }
  /**
  @internal
  */
  resolveDepth(val) {
    if (val == null)
      return this.depth;
    if (val < 0)
      return this.depth + val;
    return val;
  }
  /**
  The parent node that the position points into. Note that even if
  a position points into a text node, that node is not considered
  the parent—text nodes are ‘flat’ in this model, and have no content.
  */
  get parent() {
    return this.node(this.depth);
  }
  /**
  The root node in which the position was resolved.
  */
  get doc() {
    return this.node(0);
  }
  /**
  The ancestor node at the given level. `p.node(p.depth)` is the
  same as `p.parent`.
  */
  node(depth) {
    return this.path[this.resolveDepth(depth) * 3];
  }
  /**
  The index into the ancestor at the given level. If this points
  at the 3rd node in the 2nd paragraph on the top level, for
  example, `p.index(0)` is 1 and `p.index(1)` is 2.
  */
  index(depth) {
    return this.path[this.resolveDepth(depth) * 3 + 1];
  }
  /**
  The index pointing after this position into the ancestor at the
  given level.
  */
  indexAfter(depth) {
    depth = this.resolveDepth(depth);
    return this.index(depth) + (depth == this.depth && !this.textOffset ? 0 : 1);
  }
  /**
  The (absolute) position at the start of the node at the given
  level.
  */
  start(depth) {
    depth = this.resolveDepth(depth);
    return depth == 0 ? 0 : this.path[depth * 3 - 1] + 1;
  }
  /**
  The (absolute) position at the end of the node at the given
  level.
  */
  end(depth) {
    depth = this.resolveDepth(depth);
    return this.start(depth) + this.node(depth).content.size;
  }
  /**
  The (absolute) position directly before the wrapping node at the
  given level, or, when `depth` is `this.depth + 1`, the original
  position.
  */
  before(depth) {
    depth = this.resolveDepth(depth);
    if (!depth)
      throw new RangeError("There is no position before the top-level node");
    return depth == this.depth + 1 ? this.pos : this.path[depth * 3 - 1];
  }
  /**
  The (absolute) position directly after the wrapping node at the
  given level, or the original position when `depth` is `this.depth + 1`.
  */
  after(depth) {
    depth = this.resolveDepth(depth);
    if (!depth)
      throw new RangeError("There is no position after the top-level node");
    return depth == this.depth + 1 ? this.pos : this.path[depth * 3 - 1] + this.path[depth * 3].nodeSize;
  }
  /**
  When this position points into a text node, this returns the
  distance between the position and the start of the text node.
  Will be zero for positions that point between nodes.
  */
  get textOffset() {
    return this.pos - this.path[this.path.length - 1];
  }
  /**
  Get the node directly after the position, if any. If the position
  points into a text node, only the part of that node after the
  position is returned.
  */
  get nodeAfter() {
    let parent = this.parent, index = this.index(this.depth);
    if (index == parent.childCount)
      return null;
    let dOff = this.pos - this.path[this.path.length - 1], child = parent.child(index);
    return dOff ? parent.child(index).cut(dOff) : child;
  }
  /**
  Get the node directly before the position, if any. If the
  position points into a text node, only the part of that node
  before the position is returned.
  */
  get nodeBefore() {
    let index = this.index(this.depth);
    let dOff = this.pos - this.path[this.path.length - 1];
    if (dOff)
      return this.parent.child(index).cut(0, dOff);
    return index == 0 ? null : this.parent.child(index - 1);
  }
  /**
  Get the position at the given index in the parent node at the
  given depth (which defaults to `this.depth`).
  */
  posAtIndex(index, depth) {
    depth = this.resolveDepth(depth);
    let node = this.path[depth * 3], pos = depth == 0 ? 0 : this.path[depth * 3 - 1] + 1;
    for (let i = 0; i < index; i++)
      pos += node.child(i).nodeSize;
    return pos;
  }
  /**
  Get the marks at this position, factoring in the surrounding
  marks' [`inclusive`](https://prosemirror.net/docs/ref/#model.MarkSpec.inclusive) property. If the
  position is at the start of a non-empty node, the marks of the
  node after it (if any) are returned.
  */
  marks() {
    let parent = this.parent, index = this.index();
    if (parent.content.size == 0)
      return Mark.none;
    if (this.textOffset)
      return parent.child(index).marks;
    let main = parent.maybeChild(index - 1), other = parent.maybeChild(index);
    if (!main) {
      let tmp = main;
      main = other;
      other = tmp;
    }
    let marks = main.marks;
    for (var i = 0; i < marks.length; i++)
      if (marks[i].type.spec.inclusive === false && (!other || !marks[i].isInSet(other.marks)))
        marks = marks[i--].removeFromSet(marks);
    return marks;
  }
  /**
  Get the marks after the current position, if any, except those
  that are non-inclusive and not present at position `$end`. This
  is mostly useful for getting the set of marks to preserve after a
  deletion. Will return `null` if this position is at the end of
  its parent node or its parent node isn't a textblock (in which
  case no marks should be preserved).
  */
  marksAcross($end) {
    let after = this.parent.maybeChild(this.index());
    if (!after || !after.isInline)
      return null;
    let marks = after.marks, next = $end.parent.maybeChild($end.index());
    for (var i = 0; i < marks.length; i++)
      if (marks[i].type.spec.inclusive === false && (!next || !marks[i].isInSet(next.marks)))
        marks = marks[i--].removeFromSet(marks);
    return marks;
  }
  /**
  The depth up to which this position and the given (non-resolved)
  position share the same parent nodes.
  */
  sharedDepth(pos) {
    for (let depth = this.depth; depth > 0; depth--)
      if (this.start(depth) <= pos && this.end(depth) >= pos)
        return depth;
    return 0;
  }
  /**
  Returns a range based on the place where this position and the
  given position diverge around block content. If both point into
  the same textblock, for example, a range around that textblock
  will be returned. If they point into different blocks, the range
  around those blocks in their shared ancestor is returned. You can
  pass in an optional predicate that will be called with a parent
  node to see if a range into that parent is acceptable.
  */
  blockRange(other = this, pred) {
    if (other.pos < this.pos)
      return other.blockRange(this);
    for (let d = this.depth - (this.parent.inlineContent || this.pos == other.pos ? 1 : 0); d >= 0; d--)
      if (other.pos <= this.end(d) && (!pred || pred(this.node(d))))
        return new NodeRange(this, other, d);
    return null;
  }
  /**
  Query whether the given position shares the same parent node.
  */
  sameParent(other) {
    return this.pos - this.parentOffset == other.pos - other.parentOffset;
  }
  /**
  Return the greater of this and the given position.
  */
  max(other) {
    return other.pos > this.pos ? other : this;
  }
  /**
  Return the smaller of this and the given position.
  */
  min(other) {
    return other.pos < this.pos ? other : this;
  }
  /**
  @internal
  */
  toString() {
    let str = "";
    for (let i = 1; i <= this.depth; i++)
      str += (str ? "/" : "") + this.node(i).type.name + "_" + this.index(i - 1);
    return str + ":" + this.parentOffset;
  }
  /**
  @internal
  */
  static resolve(doc, pos) {
    if (!(pos >= 0 && pos <= doc.content.size))
      throw new RangeError("Position " + pos + " out of range");
    let path = [];
    let start = 0, parentOffset = pos;
    for (let node = doc; ; ) {
      let { index, offset } = node.content.findIndex(parentOffset);
      let rem = parentOffset - offset;
      path.push(node, index, start + offset);
      if (!rem)
        break;
      node = node.child(index);
      if (node.isText)
        break;
      parentOffset = rem - 1;
      start += offset + 1;
    }
    return new _ResolvedPos(pos, path, parentOffset);
  }
  /**
  @internal
  */
  static resolveCached(doc, pos) {
    let cache = resolveCache.get(doc);
    if (cache) {
      for (let i = 0; i < cache.elts.length; i++) {
        let elt = cache.elts[i];
        if (elt.pos == pos)
          return elt;
      }
    } else {
      resolveCache.set(doc, cache = new ResolveCache());
    }
    let result = cache.elts[cache.i] = _ResolvedPos.resolve(doc, pos);
    cache.i = (cache.i + 1) % resolveCacheSize;
    return result;
  }
};
var ResolveCache = class {
  constructor() {
    this.elts = [];
    this.i = 0;
  }
};
var resolveCacheSize = 12;
var resolveCache = /* @__PURE__ */ new WeakMap();
var NodeRange = class {
  /**
  Construct a node range. `$from` and `$to` should point into the
  same node until at least the given `depth`, since a node range
  denotes an adjacent set of nodes in a single parent node.
  */
  constructor($from, $to, depth) {
    this.$from = $from;
    this.$to = $to;
    this.depth = depth;
  }
  /**
  The position at the start of the range.
  */
  get start() {
    return this.$from.before(this.depth + 1);
  }
  /**
  The position at the end of the range.
  */
  get end() {
    return this.$to.after(this.depth + 1);
  }
  /**
  The parent node that the range points into.
  */
  get parent() {
    return this.$from.node(this.depth);
  }
  /**
  The start index of the range in the parent node.
  */
  get startIndex() {
    return this.$from.index(this.depth);
  }
  /**
  The end index of the range in the parent node.
  */
  get endIndex() {
    return this.$to.indexAfter(this.depth);
  }
};
var emptyAttrs = /* @__PURE__ */ Object.create(null);
var Node = class _Node {
  /**
  @internal
  */
  constructor(type, attrs, content, marks = Mark.none) {
    this.type = type;
    this.attrs = attrs;
    this.marks = marks;
    this.content = content || Fragment.empty;
  }
  /**
  The array of this node's child nodes.
  */
  get children() {
    return this.content.content;
  }
  /**
  The size of this node, as defined by the integer-based [indexing
  scheme](https://prosemirror.net/docs/guide/#doc.indexing). For text nodes, this is the
  amount of characters. For other leaf nodes, it is one. For
  non-leaf nodes, it is the size of the content plus two (the
  start and end token).
  */
  get nodeSize() {
    return this.isLeaf ? 1 : 2 + this.content.size;
  }
  /**
  The number of children that the node has.
  */
  get childCount() {
    return this.content.childCount;
  }
  /**
  Get the child node at the given index. Raises an error when the
  index is out of range.
  */
  child(index) {
    return this.content.child(index);
  }
  /**
  Get the child node at the given index, if it exists.
  */
  maybeChild(index) {
    return this.content.maybeChild(index);
  }
  /**
  Call `f` for every child node, passing the node, its offset
  into this parent node, and its index.
  */
  forEach(f) {
    this.content.forEach(f);
  }
  /**
  Invoke a callback for all descendant nodes recursively between
  the given two positions that are relative to start of this
  node's content. The callback is invoked with the node, its
  position relative to the original node (method receiver),
  its parent node, and its child index. When the callback returns
  false for a given node, that node's children will not be
  recursed over. The last parameter can be used to specify a
  starting position to count from.
  */
  nodesBetween(from, to, f, startPos = 0) {
    this.content.nodesBetween(from, to, f, startPos, this);
  }
  /**
  Call the given callback for every descendant node. Doesn't
  descend into a node when the callback returns `false`.
  */
  descendants(f) {
    this.nodesBetween(0, this.content.size, f);
  }
  /**
  Concatenates all the text nodes found in this fragment and its
  children.
  */
  get textContent() {
    return this.isLeaf && this.type.spec.leafText ? this.type.spec.leafText(this) : this.textBetween(0, this.content.size, "");
  }
  /**
  Get all text between positions `from` and `to`. When
  `blockSeparator` is given, it will be inserted to separate text
  from different block nodes. If `leafText` is given, it'll be
  inserted for every non-text leaf node encountered, otherwise
  [`leafText`](https://prosemirror.net/docs/ref/#model.NodeSpec.leafText) will be used.
  */
  textBetween(from, to, blockSeparator, leafText) {
    return this.content.textBetween(from, to, blockSeparator, leafText);
  }
  /**
  Returns this node's first child, or `null` if there are no
  children.
  */
  get firstChild() {
    return this.content.firstChild;
  }
  /**
  Returns this node's last child, or `null` if there are no
  children.
  */
  get lastChild() {
    return this.content.lastChild;
  }
  /**
  Test whether two nodes represent the same piece of document.
  */
  eq(other) {
    return this == other || this.sameMarkup(other) && this.content.eq(other.content);
  }
  /**
  Compare the markup (type, attributes, and marks) of this node to
  those of another. Returns `true` if both have the same markup.
  */
  sameMarkup(other) {
    return this.hasMarkup(other.type, other.attrs, other.marks);
  }
  /**
  Check whether this node's markup correspond to the given type,
  attributes, and marks.
  */
  hasMarkup(type, attrs, marks) {
    return this.type == type && compareDeep(this.attrs, attrs || type.defaultAttrs || emptyAttrs) && Mark.sameSet(this.marks, marks || Mark.none);
  }
  /**
  Create a new node with the same markup as this node, containing
  the given content (or empty, if no content is given).
  */
  copy(content = null) {
    if (content == this.content)
      return this;
    return new _Node(this.type, this.attrs, content, this.marks);
  }
  /**
  Create a copy of this node, with the given set of marks instead
  of the node's own marks.
  */
  mark(marks) {
    return marks == this.marks ? this : new _Node(this.type, this.attrs, this.content, marks);
  }
  /**
  Create a copy of this node with only the content between the
  given positions. If `to` is not given, it defaults to the end of
  the node.
  */
  cut(from, to = this.content.size) {
    if (from == 0 && to == this.content.size)
      return this;
    return this.copy(this.content.cut(from, to));
  }
  /**
  Cut out the part of the document between the given positions, and
  return it as a `Slice` object.
  */
  slice(from, to = this.content.size, includeParents = false) {
    if (from == to)
      return Slice.empty;
    let $from = this.resolve(from), $to = this.resolve(to);
    let depth = includeParents ? 0 : $from.sharedDepth(to);
    let start = $from.start(depth), node = $from.node(depth);
    let content = node.content.cut($from.pos - start, $to.pos - start);
    return new Slice(content, $from.depth - depth, $to.depth - depth);
  }
  /**
  Replace the part of the document between the given positions with
  the given slice. The slice must 'fit', meaning its open sides
  must be able to connect to the surrounding content, and its
  content nodes must be valid children for the node they are placed
  into. If any of this is violated, an error of type
  [`ReplaceError`](https://prosemirror.net/docs/ref/#model.ReplaceError) is thrown.
  */
  replace(from, to, slice) {
    return replace(this.resolve(from), this.resolve(to), slice);
  }
  /**
  Find the node directly after the given position.
  */
  nodeAt(pos) {
    for (let node = this; ; ) {
      let { index, offset } = node.content.findIndex(pos);
      node = node.maybeChild(index);
      if (!node)
        return null;
      if (offset == pos || node.isText)
        return node;
      pos -= offset + 1;
    }
  }
  /**
  Find the (direct) child node after the given offset, if any,
  and return it along with its index and offset relative to this
  node.
  */
  childAfter(pos) {
    let { index, offset } = this.content.findIndex(pos);
    return { node: this.content.maybeChild(index), index, offset };
  }
  /**
  Find the (direct) child node before the given offset, if any,
  and return it along with its index and offset relative to this
  node.
  */
  childBefore(pos) {
    if (pos == 0)
      return { node: null, index: 0, offset: 0 };
    let { index, offset } = this.content.findIndex(pos);
    if (offset < pos)
      return { node: this.content.child(index), index, offset };
    let node = this.content.child(index - 1);
    return { node, index: index - 1, offset: offset - node.nodeSize };
  }
  /**
  Resolve the given position in the document, returning an
  [object](https://prosemirror.net/docs/ref/#model.ResolvedPos) with information about its context.
  */
  resolve(pos) {
    return ResolvedPos.resolveCached(this, pos);
  }
  /**
  @internal
  */
  resolveNoCache(pos) {
    return ResolvedPos.resolve(this, pos);
  }
  /**
  Test whether a given mark or mark type occurs in this document
  between the two given positions.
  */
  rangeHasMark(from, to, type) {
    let found2 = false;
    if (to > from)
      this.nodesBetween(from, to, (node) => {
        if (type.isInSet(node.marks))
          found2 = true;
        return !found2;
      });
    return found2;
  }
  /**
  True when this is a block (non-inline node)
  */
  get isBlock() {
    return this.type.isBlock;
  }
  /**
  True when this is a textblock node, a block node with inline
  content.
  */
  get isTextblock() {
    return this.type.isTextblock;
  }
  /**
  True when this node allows inline content.
  */
  get inlineContent() {
    return this.type.inlineContent;
  }
  /**
  True when this is an inline node (a text node or a node that can
  appear among text).
  */
  get isInline() {
    return this.type.isInline;
  }
  /**
  True when this is a text node.
  */
  get isText() {
    return this.type.isText;
  }
  /**
  True when this is a leaf node.
  */
  get isLeaf() {
    return this.type.isLeaf;
  }
  /**
  True when this is an atom, i.e. when it does not have directly
  editable content. This is usually the same as `isLeaf`, but can
  be configured with the [`atom` property](https://prosemirror.net/docs/ref/#model.NodeSpec.atom)
  on a node's spec (typically used when the node is displayed as
  an uneditable [node view](https://prosemirror.net/docs/ref/#view.NodeView)).
  */
  get isAtom() {
    return this.type.isAtom;
  }
  /**
  Return a string representation of this node for debugging
  purposes.
  */
  toString() {
    if (this.type.spec.toDebugString)
      return this.type.spec.toDebugString(this);
    let name = this.type.name;
    if (this.content.size)
      name += "(" + this.content.toStringInner() + ")";
    return wrapMarks(this.marks, name);
  }
  /**
  Get the content match in this node at the given index.
  */
  contentMatchAt(index) {
    let match = this.type.contentMatch.matchFragment(this.content, 0, index);
    if (!match)
      throw new Error("Called contentMatchAt on a node with invalid content");
    return match;
  }
  /**
  Test whether replacing the range between `from` and `to` (by
  child index) with the given replacement fragment (which defaults
  to the empty fragment) would leave the node's content valid. You
  can optionally pass `start` and `end` indices into the
  replacement fragment.
  */
  canReplace(from, to, replacement = Fragment.empty, start = 0, end = replacement.childCount) {
    let one = this.contentMatchAt(from).matchFragment(replacement, start, end);
    let two = one && one.matchFragment(this.content, to);
    if (!two || !two.validEnd)
      return false;
    for (let i = start; i < end; i++)
      if (!this.type.allowsMarks(replacement.child(i).marks))
        return false;
    return true;
  }
  /**
  Test whether replacing the range `from` to `to` (by index) with
  a node of the given type would leave the node's content valid.
  */
  canReplaceWith(from, to, type, marks) {
    if (marks && !this.type.allowsMarks(marks))
      return false;
    let start = this.contentMatchAt(from).matchType(type);
    let end = start && start.matchFragment(this.content, to);
    return end ? end.validEnd : false;
  }
  /**
  Test whether the given node's content could be appended to this
  node. If that node is empty, this will only return true if there
  is at least one node type that can appear in both nodes (to avoid
  merging completely incompatible nodes).
  */
  canAppend(other) {
    if (other.content.size)
      return this.canReplace(this.childCount, this.childCount, other.content);
    else
      return this.type.compatibleContent(other.type);
  }
  /**
  Check whether this node and its descendants conform to the
  schema, and raise an exception when they do not.
  */
  check() {
    this.type.checkContent(this.content);
    this.type.checkAttrs(this.attrs);
    let copy = Mark.none;
    for (let i = 0; i < this.marks.length; i++) {
      let mark = this.marks[i];
      mark.type.checkAttrs(mark.attrs);
      copy = mark.addToSet(copy);
    }
    if (!Mark.sameSet(copy, this.marks))
      throw new RangeError(`Invalid collection of marks for node ${this.type.name}: ${this.marks.map((m) => m.type.name)}`);
    this.content.forEach((node) => node.check());
  }
  /**
  Return a JSON-serializeable representation of this node.
  */
  toJSON() {
    let obj = { type: this.type.name };
    for (let _ in this.attrs) {
      obj.attrs = this.attrs;
      break;
    }
    if (this.content.size)
      obj.content = this.content.toJSON();
    if (this.marks.length)
      obj.marks = this.marks.map((n) => n.toJSON());
    return obj;
  }
  /**
  Deserialize a node from its JSON representation.
  */
  static fromJSON(schema, json) {
    if (!json)
      throw new RangeError("Invalid input for Node.fromJSON");
    let marks = void 0;
    if (json.marks) {
      if (!Array.isArray(json.marks))
        throw new RangeError("Invalid mark data for Node.fromJSON");
      marks = json.marks.map(schema.markFromJSON);
    }
    if (json.type == "text") {
      if (typeof json.text != "string")
        throw new RangeError("Invalid text node in JSON");
      return schema.text(json.text, marks);
    }
    let content = Fragment.fromJSON(schema, json.content);
    let node = schema.nodeType(json.type).create(json.attrs, content, marks);
    node.type.checkAttrs(node.attrs);
    return node;
  }
};
Node.prototype.text = void 0;
function wrapMarks(marks, str) {
  for (let i = marks.length - 1; i >= 0; i--)
    str = marks[i].type.name + "(" + str + ")";
  return str;
}
var ContentMatch = class _ContentMatch {
  /**
  @internal
  */
  constructor(validEnd) {
    this.validEnd = validEnd;
    this.next = [];
    this.wrapCache = [];
  }
  /**
  @internal
  */
  static parse(string, nodeTypes) {
    let stream = new TokenStream(string, nodeTypes);
    if (stream.next == null)
      return _ContentMatch.empty;
    let expr = parseExpr(stream);
    if (stream.next)
      stream.err("Unexpected trailing text");
    let match = dfa(nfa(expr));
    checkForDeadEnds(match, stream);
    return match;
  }
  /**
  Match a node type, returning a match after that node if
  successful.
  */
  matchType(type) {
    for (let i = 0; i < this.next.length; i++)
      if (this.next[i].type == type)
        return this.next[i].next;
    return null;
  }
  /**
  Try to match a fragment. Returns the resulting match when
  successful.
  */
  matchFragment(frag, start = 0, end = frag.childCount) {
    let cur = this;
    for (let i = start; cur && i < end; i++)
      cur = cur.matchType(frag.child(i).type);
    return cur;
  }
  /**
  @internal
  */
  get inlineContent() {
    return this.next.length != 0 && this.next[0].type.isInline;
  }
  /**
  Get the first matching node type at this match position that can
  be generated.
  */
  get defaultType() {
    for (let i = 0; i < this.next.length; i++) {
      let { type } = this.next[i];
      if (!(type.isText || type.hasRequiredAttrs()))
        return type;
    }
    return null;
  }
  /**
  @internal
  */
  compatible(other) {
    for (let i = 0; i < this.next.length; i++)
      for (let j = 0; j < other.next.length; j++)
        if (this.next[i].type == other.next[j].type)
          return true;
    return false;
  }
  /**
  Try to match the given fragment, and if that fails, see if it can
  be made to match by inserting nodes in front of it. When
  successful, return a fragment of inserted nodes (which may be
  empty if nothing had to be inserted). When `toEnd` is true, only
  return a fragment if the resulting match goes to the end of the
  content expression.
  */
  fillBefore(after, toEnd = false, startIndex = 0) {
    let seen = [this];
    function search(match, types) {
      let finished = match.matchFragment(after, startIndex);
      if (finished && (!toEnd || finished.validEnd))
        return Fragment.from(types.map((tp) => tp.createAndFill()));
      for (let i = 0; i < match.next.length; i++) {
        let { type, next } = match.next[i];
        if (!(type.isText || type.hasRequiredAttrs()) && seen.indexOf(next) == -1) {
          seen.push(next);
          let found2 = search(next, types.concat(type));
          if (found2)
            return found2;
        }
      }
      return null;
    }
    return search(this, []);
  }
  /**
  Find a set of wrapping node types that would allow a node of the
  given type to appear at this position. The result may be empty
  (when it fits directly) and will be null when no such wrapping
  exists.
  */
  findWrapping(target) {
    for (let i = 0; i < this.wrapCache.length; i += 2)
      if (this.wrapCache[i] == target)
        return this.wrapCache[i + 1];
    let computed = this.computeWrapping(target);
    this.wrapCache.push(target, computed);
    return computed;
  }
  /**
  @internal
  */
  computeWrapping(target) {
    let seen = /* @__PURE__ */ Object.create(null), active = [{ match: this, type: null, via: null }];
    while (active.length) {
      let current = active.shift(), match = current.match;
      if (match.matchType(target)) {
        let result = [];
        for (let obj = current; obj.type; obj = obj.via)
          result.push(obj.type);
        return result.reverse();
      }
      for (let i = 0; i < match.next.length; i++) {
        let { type, next } = match.next[i];
        if (!type.isLeaf && !type.hasRequiredAttrs() && !(type.name in seen) && (!current.type || next.validEnd)) {
          active.push({ match: type.contentMatch, type, via: current });
          seen[type.name] = true;
        }
      }
    }
    return null;
  }
  /**
  The number of outgoing edges this node has in the finite
  automaton that describes the content expression.
  */
  get edgeCount() {
    return this.next.length;
  }
  /**
  Get the _n_​th outgoing edge from this node in the finite
  automaton that describes the content expression.
  */
  edge(n) {
    if (n >= this.next.length)
      throw new RangeError(`There's no ${n}th edge in this content match`);
    return this.next[n];
  }
  /**
  @internal
  */
  toString() {
    let seen = [];
    function scan(m) {
      seen.push(m);
      for (let i = 0; i < m.next.length; i++)
        if (seen.indexOf(m.next[i].next) == -1)
          scan(m.next[i].next);
    }
    scan(this);
    return seen.map((m, i) => {
      let out = i + (m.validEnd ? "*" : " ") + " ";
      for (let i2 = 0; i2 < m.next.length; i2++)
        out += (i2 ? ", " : "") + m.next[i2].type.name + "->" + seen.indexOf(m.next[i2].next);
      return out;
    }).join("\n");
  }
};
ContentMatch.empty = new ContentMatch(true);
var TokenStream = class {
  constructor(string, nodeTypes) {
    this.string = string;
    this.nodeTypes = nodeTypes;
    this.inline = null;
    this.pos = 0;
    this.tokens = string.split(/\s*(?=\b|\W|$)/);
    if (this.tokens[this.tokens.length - 1] == "")
      this.tokens.pop();
    if (this.tokens[0] == "")
      this.tokens.shift();
  }
  get next() {
    return this.tokens[this.pos];
  }
  eat(tok) {
    return this.next == tok && (this.pos++ || true);
  }
  err(str) {
    throw new SyntaxError(str + " (in content expression '" + this.string + "')");
  }
};
function parseExpr(stream) {
  let exprs = [];
  do {
    exprs.push(parseExprSeq(stream));
  } while (stream.eat("|"));
  return exprs.length == 1 ? exprs[0] : { type: "choice", exprs };
}
function parseExprSeq(stream) {
  let exprs = [];
  do {
    exprs.push(parseExprSubscript(stream));
  } while (stream.next && stream.next != ")" && stream.next != "|");
  return exprs.length == 1 ? exprs[0] : { type: "seq", exprs };
}
function parseExprSubscript(stream) {
  let expr = parseExprAtom(stream);
  for (; ; ) {
    if (stream.eat("+"))
      expr = { type: "plus", expr };
    else if (stream.eat("*"))
      expr = { type: "star", expr };
    else if (stream.eat("?"))
      expr = { type: "opt", expr };
    else if (stream.eat("{"))
      expr = parseExprRange(stream, expr);
    else
      break;
  }
  return expr;
}
function parseNum(stream) {
  if (/\D/.test(stream.next))
    stream.err("Expected number, got '" + stream.next + "'");
  let result = Number(stream.next);
  stream.pos++;
  return result;
}
function parseExprRange(stream, expr) {
  let min = parseNum(stream), max = min;
  if (stream.eat(",")) {
    if (stream.next != "}")
      max = parseNum(stream);
    else
      max = -1;
  }
  if (!stream.eat("}"))
    stream.err("Unclosed braced range");
  return { type: "range", min, max, expr };
}
function resolveName(stream, name) {
  let types = stream.nodeTypes, type = types[name];
  if (type)
    return [type];
  let result = [];
  for (let typeName in types) {
    let type2 = types[typeName];
    if (type2.isInGroup(name))
      result.push(type2);
  }
  if (result.length == 0)
    stream.err("No node type or group '" + name + "' found");
  return result;
}
function parseExprAtom(stream) {
  if (stream.eat("(")) {
    let expr = parseExpr(stream);
    if (!stream.eat(")"))
      stream.err("Missing closing paren");
    return expr;
  } else if (!/\W/.test(stream.next)) {
    let exprs = resolveName(stream, stream.next).map((type) => {
      if (stream.inline == null)
        stream.inline = type.isInline;
      else if (stream.inline != type.isInline)
        stream.err("Mixing inline and block content");
      return { type: "name", value: type };
    });
    stream.pos++;
    return exprs.length == 1 ? exprs[0] : { type: "choice", exprs };
  } else {
    stream.err("Unexpected token '" + stream.next + "'");
  }
}
function nfa(expr) {
  let nfa2 = [[]];
  connect(compile(expr, 0), node());
  return nfa2;
  function node() {
    return nfa2.push([]) - 1;
  }
  function edge(from, to, term) {
    let edge2 = { term, to };
    nfa2[from].push(edge2);
    return edge2;
  }
  function connect(edges, to) {
    edges.forEach((edge2) => edge2.to = to);
  }
  function compile(expr2, from) {
    if (expr2.type == "choice") {
      return expr2.exprs.reduce((out, expr3) => out.concat(compile(expr3, from)), []);
    } else if (expr2.type == "seq") {
      for (let i = 0; ; i++) {
        let next = compile(expr2.exprs[i], from);
        if (i == expr2.exprs.length - 1)
          return next;
        connect(next, from = node());
      }
    } else if (expr2.type == "star") {
      let loop = node();
      edge(from, loop);
      connect(compile(expr2.expr, loop), loop);
      return [edge(loop)];
    } else if (expr2.type == "plus") {
      let loop = node();
      connect(compile(expr2.expr, from), loop);
      connect(compile(expr2.expr, loop), loop);
      return [edge(loop)];
    } else if (expr2.type == "opt") {
      return [edge(from)].concat(compile(expr2.expr, from));
    } else if (expr2.type == "range") {
      let cur = from;
      for (let i = 0; i < expr2.min; i++) {
        let next = node();
        connect(compile(expr2.expr, cur), next);
        cur = next;
      }
      if (expr2.max == -1) {
        connect(compile(expr2.expr, cur), cur);
      } else {
        for (let i = expr2.min; i < expr2.max; i++) {
          let next = node();
          edge(cur, next);
          connect(compile(expr2.expr, cur), next);
          cur = next;
        }
      }
      return [edge(cur)];
    } else if (expr2.type == "name") {
      return [edge(from, void 0, expr2.value)];
    } else {
      throw new Error("Unknown expr type");
    }
  }
}
function cmp(a, b) {
  return b - a;
}
function nullFrom(nfa2, node) {
  let result = [];
  scan(node);
  return result.sort(cmp);
  function scan(node2) {
    let edges = nfa2[node2];
    if (edges.length == 1 && !edges[0].term)
      return scan(edges[0].to);
    result.push(node2);
    for (let i = 0; i < edges.length; i++) {
      let { term, to } = edges[i];
      if (!term && result.indexOf(to) == -1)
        scan(to);
    }
  }
}
function dfa(nfa2) {
  let labeled = /* @__PURE__ */ Object.create(null);
  return explore(nullFrom(nfa2, 0));
  function explore(states) {
    let out = [];
    states.forEach((node) => {
      nfa2[node].forEach(({ term, to }) => {
        if (!term)
          return;
        let set;
        for (let i = 0; i < out.length; i++)
          if (out[i][0] == term)
            set = out[i][1];
        nullFrom(nfa2, to).forEach((node2) => {
          if (!set)
            out.push([term, set = []]);
          if (set.indexOf(node2) == -1)
            set.push(node2);
        });
      });
    });
    let state = labeled[states.join(",")] = new ContentMatch(states.indexOf(nfa2.length - 1) > -1);
    for (let i = 0; i < out.length; i++) {
      let states2 = out[i][1].sort(cmp);
      state.next.push({ type: out[i][0], next: labeled[states2.join(",")] || explore(states2) });
    }
    return state;
  }
}
function checkForDeadEnds(match, stream) {
  for (let i = 0, work = [match]; i < work.length; i++) {
    let state = work[i], dead = !state.validEnd, nodes = [];
    for (let j = 0; j < state.next.length; j++) {
      let { type, next } = state.next[j];
      nodes.push(type.name);
      if (dead && !(type.isText || type.hasRequiredAttrs()))
        dead = false;
      if (work.indexOf(next) == -1)
        work.push(next);
    }
    if (dead)
      stream.err("Only non-generatable nodes (" + nodes.join(", ") + ") in a required position (see https://prosemirror.net/docs/guide/#generatable)");
  }
}

// node_modules/prosemirror-transform/dist/index.js
var lower16 = 65535;
var factor16 = Math.pow(2, 16);
function makeRecover(index, offset) {
  return index + offset * factor16;
}
function recoverIndex(value) {
  return value & lower16;
}
function recoverOffset(value) {
  return (value - (value & lower16)) / factor16;
}
var DEL_BEFORE = 1;
var DEL_AFTER = 2;
var DEL_ACROSS = 4;
var DEL_SIDE = 8;
var MapResult = class {
  /**
  @internal
  */
  constructor(pos, delInfo, recover) {
    this.pos = pos;
    this.delInfo = delInfo;
    this.recover = recover;
  }
  /**
  Tells you whether the position was deleted, that is, whether the
  step removed the token on the side queried (via the `assoc`)
  argument from the document.
  */
  get deleted() {
    return (this.delInfo & DEL_SIDE) > 0;
  }
  /**
  Tells you whether the token before the mapped position was deleted.
  */
  get deletedBefore() {
    return (this.delInfo & (DEL_BEFORE | DEL_ACROSS)) > 0;
  }
  /**
  True when the token after the mapped position was deleted.
  */
  get deletedAfter() {
    return (this.delInfo & (DEL_AFTER | DEL_ACROSS)) > 0;
  }
  /**
  Tells whether any of the steps mapped through deletes across the
  position (including both the token before and after the
  position).
  */
  get deletedAcross() {
    return (this.delInfo & DEL_ACROSS) > 0;
  }
};
var StepMap = class _StepMap {
  /**
  Create a position map. The modifications to the document are
  represented as an array of numbers, in which each group of three
  represents a modified chunk as `[start, oldSize, newSize]`.
  */
  constructor(ranges, inverted = false) {
    this.ranges = ranges;
    this.inverted = inverted;
    if (!ranges.length && _StepMap.empty)
      return _StepMap.empty;
  }
  /**
  @internal
  */
  recover(value) {
    let diff = 0, index = recoverIndex(value);
    if (!this.inverted)
      for (let i = 0; i < index; i++)
        diff += this.ranges[i * 3 + 2] - this.ranges[i * 3 + 1];
    return this.ranges[index * 3] + diff + recoverOffset(value);
  }
  mapResult(pos, assoc = 1) {
    return this._map(pos, assoc, false);
  }
  map(pos, assoc = 1) {
    return this._map(pos, assoc, true);
  }
  /**
  @internal
  */
  _map(pos, assoc, simple) {
    let diff = 0, oldIndex = this.inverted ? 2 : 1, newIndex = this.inverted ? 1 : 2;
    for (let i = 0; i < this.ranges.length; i += 3) {
      let start = this.ranges[i] - (this.inverted ? diff : 0);
      if (start > pos)
        break;
      let oldSize = this.ranges[i + oldIndex], newSize = this.ranges[i + newIndex], end = start + oldSize;
      if (pos <= end) {
        let side = !oldSize ? assoc : pos == start ? -1 : pos == end ? 1 : assoc;
        let result = start + diff + (side < 0 ? 0 : newSize);
        if (simple)
          return result;
        let recover = pos == (assoc < 0 ? start : end) ? null : makeRecover(i / 3, pos - start);
        let del = pos == start ? DEL_AFTER : pos == end ? DEL_BEFORE : DEL_ACROSS;
        if (assoc < 0 ? pos != start : pos != end)
          del |= DEL_SIDE;
        return new MapResult(result, del, recover);
      }
      diff += newSize - oldSize;
    }
    return simple ? pos + diff : new MapResult(pos + diff, 0, null);
  }
  /**
  @internal
  */
  touches(pos, recover) {
    let diff = 0, index = recoverIndex(recover);
    let oldIndex = this.inverted ? 2 : 1, newIndex = this.inverted ? 1 : 2;
    for (let i = 0; i < this.ranges.length; i += 3) {
      let start = this.ranges[i] - (this.inverted ? diff : 0);
      if (start > pos)
        break;
      let oldSize = this.ranges[i + oldIndex], end = start + oldSize;
      if (pos <= end && i == index * 3)
        return true;
      diff += this.ranges[i + newIndex] - oldSize;
    }
    return false;
  }
  /**
  Calls the given function on each of the changed ranges included in
  this map.
  */
  forEach(f) {
    let oldIndex = this.inverted ? 2 : 1, newIndex = this.inverted ? 1 : 2;
    for (let i = 0, diff = 0; i < this.ranges.length; i += 3) {
      let start = this.ranges[i], oldStart = start - (this.inverted ? diff : 0), newStart = start + (this.inverted ? 0 : diff);
      let oldSize = this.ranges[i + oldIndex], newSize = this.ranges[i + newIndex];
      f(oldStart, oldStart + oldSize, newStart, newStart + newSize);
      diff += newSize - oldSize;
    }
  }
  /**
  Create an inverted version of this map. The result can be used to
  map positions in the post-step document to the pre-step document.
  */
  invert() {
    return new _StepMap(this.ranges, !this.inverted);
  }
  /**
  @internal
  */
  toString() {
    return (this.inverted ? "-" : "") + JSON.stringify(this.ranges);
  }
  /**
  Create a map that moves all positions by offset `n` (which may be
  negative). This can be useful when applying steps meant for a
  sub-document to a larger document, or vice-versa.
  */
  static offset(n) {
    return n == 0 ? _StepMap.empty : new _StepMap(n < 0 ? [0, -n, 0] : [0, 0, n]);
  }
};
StepMap.empty = new StepMap([]);
var stepsByID = /* @__PURE__ */ Object.create(null);
var Step = class {
  /**
  Get the step map that represents the changes made by this step,
  and which can be used to transform between positions in the old
  and the new document.
  */
  getMap() {
    return StepMap.empty;
  }
  /**
  Try to merge this step with another one, to be applied directly
  after it. Returns the merged step when possible, null if the
  steps can't be merged.
  */
  merge(other) {
    return null;
  }
  /**
  Deserialize a step from its JSON representation. Will call
  through to the step class' own implementation of this method.
  */
  static fromJSON(schema, json) {
    if (!json || !json.stepType)
      throw new RangeError("Invalid input for Step.fromJSON");
    let type = stepsByID[json.stepType];
    if (!type)
      throw new RangeError(`No step type ${json.stepType} defined`);
    return type.fromJSON(schema, json);
  }
  /**
  To be able to serialize steps to JSON, each step needs a string
  ID to attach to its JSON representation. Use this method to
  register an ID for your step classes. Try to pick something
  that's unlikely to clash with steps from other modules.
  */
  static jsonID(id, stepClass) {
    if (id in stepsByID)
      throw new RangeError("Duplicate use of step JSON ID " + id);
    stepsByID[id] = stepClass;
    stepClass.prototype.jsonID = id;
    return stepClass;
  }
};
var StepResult = class _StepResult {
  /**
  @internal
  */
  constructor(doc, failed) {
    this.doc = doc;
    this.failed = failed;
  }
  /**
  Create a successful step result.
  */
  static ok(doc) {
    return new _StepResult(doc, null);
  }
  /**
  Create a failed step result.
  */
  static fail(message) {
    return new _StepResult(null, message);
  }
  /**
  Call [`Node.replace`](https://prosemirror.net/docs/ref/#model.Node.replace) with the given
  arguments. Create a successful result if it succeeds, and a
  failed one if it throws a `ReplaceError`.
  */
  static fromReplace(doc, from, to, slice) {
    try {
      return _StepResult.ok(doc.replace(from, to, slice));
    } catch (e) {
      if (e instanceof ReplaceError)
        return _StepResult.fail(e.message);
      throw e;
    }
  }
};
function mapFragment(fragment, f, parent) {
  let mapped = [];
  for (let i = 0; i < fragment.childCount; i++) {
    let child = fragment.child(i);
    if (child.content.size)
      child = child.copy(mapFragment(child.content, f, child));
    if (child.isInline)
      child = f(child, parent, i);
    mapped.push(child);
  }
  return Fragment.fromArray(mapped);
}
var AddMarkStep = class _AddMarkStep extends Step {
  /**
  Create a mark step.
  */
  constructor(from, to, mark) {
    super();
    this.from = from;
    this.to = to;
    this.mark = mark;
  }
  apply(doc) {
    let oldSlice = doc.slice(this.from, this.to), $from = doc.resolve(this.from);
    let parent = $from.node($from.sharedDepth(this.to));
    let slice = new Slice(mapFragment(oldSlice.content, (node, parent2) => {
      if (!node.isAtom || !parent2.type.allowsMarkType(this.mark.type))
        return node;
      return node.mark(this.mark.addToSet(node.marks));
    }, parent), oldSlice.openStart, oldSlice.openEnd);
    return StepResult.fromReplace(doc, this.from, this.to, slice);
  }
  invert() {
    return new RemoveMarkStep(this.from, this.to, this.mark);
  }
  map(mapping) {
    let from = mapping.mapResult(this.from, 1), to = mapping.mapResult(this.to, -1);
    if (from.deleted && to.deleted || from.pos >= to.pos)
      return null;
    return new _AddMarkStep(from.pos, to.pos, this.mark);
  }
  merge(other) {
    if (other instanceof _AddMarkStep && other.mark.eq(this.mark) && this.from <= other.to && this.to >= other.from)
      return new _AddMarkStep(Math.min(this.from, other.from), Math.max(this.to, other.to), this.mark);
    return null;
  }
  toJSON() {
    return {
      stepType: "addMark",
      mark: this.mark.toJSON(),
      from: this.from,
      to: this.to
    };
  }
  /**
  @internal
  */
  static fromJSON(schema, json) {
    if (typeof json.from != "number" || typeof json.to != "number")
      throw new RangeError("Invalid input for AddMarkStep.fromJSON");
    return new _AddMarkStep(json.from, json.to, schema.markFromJSON(json.mark));
  }
};
Step.jsonID("addMark", AddMarkStep);
var RemoveMarkStep = class _RemoveMarkStep extends Step {
  /**
  Create a mark-removing step.
  */
  constructor(from, to, mark) {
    super();
    this.from = from;
    this.to = to;
    this.mark = mark;
  }
  apply(doc) {
    let oldSlice = doc.slice(this.from, this.to);
    let slice = new Slice(mapFragment(oldSlice.content, (node) => {
      return node.mark(this.mark.removeFromSet(node.marks));
    }, doc), oldSlice.openStart, oldSlice.openEnd);
    return StepResult.fromReplace(doc, this.from, this.to, slice);
  }
  invert() {
    return new AddMarkStep(this.from, this.to, this.mark);
  }
  map(mapping) {
    let from = mapping.mapResult(this.from, 1), to = mapping.mapResult(this.to, -1);
    if (from.deleted && to.deleted || from.pos >= to.pos)
      return null;
    return new _RemoveMarkStep(from.pos, to.pos, this.mark);
  }
  merge(other) {
    if (other instanceof _RemoveMarkStep && other.mark.eq(this.mark) && this.from <= other.to && this.to >= other.from)
      return new _RemoveMarkStep(Math.min(this.from, other.from), Math.max(this.to, other.to), this.mark);
    return null;
  }
  toJSON() {
    return {
      stepType: "removeMark",
      mark: this.mark.toJSON(),
      from: this.from,
      to: this.to
    };
  }
  /**
  @internal
  */
  static fromJSON(schema, json) {
    if (typeof json.from != "number" || typeof json.to != "number")
      throw new RangeError("Invalid input for RemoveMarkStep.fromJSON");
    return new _RemoveMarkStep(json.from, json.to, schema.markFromJSON(json.mark));
  }
};
Step.jsonID("removeMark", RemoveMarkStep);
var AddNodeMarkStep = class _AddNodeMarkStep extends Step {
  /**
  Create a node mark step.
  */
  constructor(pos, mark) {
    super();
    this.pos = pos;
    this.mark = mark;
  }
  apply(doc) {
    let node = doc.nodeAt(this.pos);
    if (!node)
      return StepResult.fail("No node at mark step's position");
    let updated = node.type.create(node.attrs, null, this.mark.addToSet(node.marks));
    return StepResult.fromReplace(doc, this.pos, this.pos + 1, new Slice(Fragment.from(updated), 0, node.isLeaf ? 0 : 1));
  }
  invert(doc) {
    let node = doc.nodeAt(this.pos);
    if (node) {
      let newSet = this.mark.addToSet(node.marks);
      if (newSet.length == node.marks.length) {
        for (let i = 0; i < node.marks.length; i++)
          if (!node.marks[i].isInSet(newSet))
            return new _AddNodeMarkStep(this.pos, node.marks[i]);
        return new _AddNodeMarkStep(this.pos, this.mark);
      }
    }
    return new RemoveNodeMarkStep(this.pos, this.mark);
  }
  map(mapping) {
    let pos = mapping.mapResult(this.pos, 1);
    return pos.deletedAfter ? null : new _AddNodeMarkStep(pos.pos, this.mark);
  }
  toJSON() {
    return { stepType: "addNodeMark", pos: this.pos, mark: this.mark.toJSON() };
  }
  /**
  @internal
  */
  static fromJSON(schema, json) {
    if (typeof json.pos != "number")
      throw new RangeError("Invalid input for AddNodeMarkStep.fromJSON");
    return new _AddNodeMarkStep(json.pos, schema.markFromJSON(json.mark));
  }
};
Step.jsonID("addNodeMark", AddNodeMarkStep);
var RemoveNodeMarkStep = class _RemoveNodeMarkStep extends Step {
  /**
  Create a mark-removing step.
  */
  constructor(pos, mark) {
    super();
    this.pos = pos;
    this.mark = mark;
  }
  apply(doc) {
    let node = doc.nodeAt(this.pos);
    if (!node)
      return StepResult.fail("No node at mark step's position");
    let updated = node.type.create(node.attrs, null, this.mark.removeFromSet(node.marks));
    return StepResult.fromReplace(doc, this.pos, this.pos + 1, new Slice(Fragment.from(updated), 0, node.isLeaf ? 0 : 1));
  }
  invert(doc) {
    let node = doc.nodeAt(this.pos);
    if (!node || !this.mark.isInSet(node.marks))
      return this;
    return new AddNodeMarkStep(this.pos, this.mark);
  }
  map(mapping) {
    let pos = mapping.mapResult(this.pos, 1);
    return pos.deletedAfter ? null : new _RemoveNodeMarkStep(pos.pos, this.mark);
  }
  toJSON() {
    return { stepType: "removeNodeMark", pos: this.pos, mark: this.mark.toJSON() };
  }
  /**
  @internal
  */
  static fromJSON(schema, json) {
    if (typeof json.pos != "number")
      throw new RangeError("Invalid input for RemoveNodeMarkStep.fromJSON");
    return new _RemoveNodeMarkStep(json.pos, schema.markFromJSON(json.mark));
  }
};
Step.jsonID("removeNodeMark", RemoveNodeMarkStep);
var ReplaceStep = class _ReplaceStep extends Step {
  /**
  The given `slice` should fit the 'gap' between `from` and
  `to`—the depths must line up, and the surrounding nodes must be
  able to be joined with the open sides of the slice. When
  `structure` is true, the step will fail if the content between
  from and to is not just a sequence of closing and then opening
  tokens (this is to guard against rebased replace steps
  overwriting something they weren't supposed to).
  */
  constructor(from, to, slice, structure = false) {
    super();
    this.from = from;
    this.to = to;
    this.slice = slice;
    this.structure = structure;
  }
  apply(doc) {
    if (this.structure && contentBetween(doc, this.from, this.to))
      return StepResult.fail("Structure replace would overwrite content");
    return StepResult.fromReplace(doc, this.from, this.to, this.slice);
  }
  getMap() {
    return new StepMap([this.from, this.to - this.from, this.slice.size]);
  }
  invert(doc) {
    return new _ReplaceStep(this.from, this.from + this.slice.size, doc.slice(this.from, this.to));
  }
  map(mapping) {
    let from = mapping.mapResult(this.from, 1), to = mapping.mapResult(this.to, -1);
    if (from.deletedAcross && to.deletedAcross)
      return null;
    return new _ReplaceStep(from.pos, Math.max(from.pos, to.pos), this.slice, this.structure);
  }
  merge(other) {
    if (!(other instanceof _ReplaceStep) || other.structure || this.structure)
      return null;
    if (this.from + this.slice.size == other.from && !this.slice.openEnd && !other.slice.openStart) {
      let slice = this.slice.size + other.slice.size == 0 ? Slice.empty : new Slice(this.slice.content.append(other.slice.content), this.slice.openStart, other.slice.openEnd);
      return new _ReplaceStep(this.from, this.to + (other.to - other.from), slice, this.structure);
    } else if (other.to == this.from && !this.slice.openStart && !other.slice.openEnd) {
      let slice = this.slice.size + other.slice.size == 0 ? Slice.empty : new Slice(other.slice.content.append(this.slice.content), other.slice.openStart, this.slice.openEnd);
      return new _ReplaceStep(other.from, this.to, slice, this.structure);
    } else {
      return null;
    }
  }
  toJSON() {
    let json = { stepType: "replace", from: this.from, to: this.to };
    if (this.slice.size)
      json.slice = this.slice.toJSON();
    if (this.structure)
      json.structure = true;
    return json;
  }
  /**
  @internal
  */
  static fromJSON(schema, json) {
    if (typeof json.from != "number" || typeof json.to != "number")
      throw new RangeError("Invalid input for ReplaceStep.fromJSON");
    return new _ReplaceStep(json.from, json.to, Slice.fromJSON(schema, json.slice), !!json.structure);
  }
};
Step.jsonID("replace", ReplaceStep);
var ReplaceAroundStep = class _ReplaceAroundStep extends Step {
  /**
  Create a replace-around step with the given range and gap.
  `insert` should be the point in the slice into which the content
  of the gap should be moved. `structure` has the same meaning as
  it has in the [`ReplaceStep`](https://prosemirror.net/docs/ref/#transform.ReplaceStep) class.
  */
  constructor(from, to, gapFrom, gapTo, slice, insert, structure = false) {
    super();
    this.from = from;
    this.to = to;
    this.gapFrom = gapFrom;
    this.gapTo = gapTo;
    this.slice = slice;
    this.insert = insert;
    this.structure = structure;
  }
  apply(doc) {
    if (this.structure && (contentBetween(doc, this.from, this.gapFrom) || contentBetween(doc, this.gapTo, this.to)))
      return StepResult.fail("Structure gap-replace would overwrite content");
    let gap = doc.slice(this.gapFrom, this.gapTo);
    if (gap.openStart || gap.openEnd)
      return StepResult.fail("Gap is not a flat range");
    let inserted = this.slice.insertAt(this.insert, gap.content);
    if (!inserted)
      return StepResult.fail("Content does not fit in gap");
    return StepResult.fromReplace(doc, this.from, this.to, inserted);
  }
  getMap() {
    return new StepMap([
      this.from,
      this.gapFrom - this.from,
      this.insert,
      this.gapTo,
      this.to - this.gapTo,
      this.slice.size - this.insert
    ]);
  }
  invert(doc) {
    let gap = this.gapTo - this.gapFrom;
    return new _ReplaceAroundStep(this.from, this.from + this.slice.size + gap, this.from + this.insert, this.from + this.insert + gap, doc.slice(this.from, this.to).removeBetween(this.gapFrom - this.from, this.gapTo - this.from), this.gapFrom - this.from, this.structure);
  }
  map(mapping) {
    let from = mapping.mapResult(this.from, 1), to = mapping.mapResult(this.to, -1);
    let gapFrom = this.from == this.gapFrom ? from.pos : mapping.map(this.gapFrom, -1);
    let gapTo = this.to == this.gapTo ? to.pos : mapping.map(this.gapTo, 1);
    if (from.deletedAcross && to.deletedAcross || gapFrom < from.pos || gapTo > to.pos)
      return null;
    return new _ReplaceAroundStep(from.pos, to.pos, gapFrom, gapTo, this.slice, this.insert, this.structure);
  }
  toJSON() {
    let json = {
      stepType: "replaceAround",
      from: this.from,
      to: this.to,
      gapFrom: this.gapFrom,
      gapTo: this.gapTo,
      insert: this.insert
    };
    if (this.slice.size)
      json.slice = this.slice.toJSON();
    if (this.structure)
      json.structure = true;
    return json;
  }
  /**
  @internal
  */
  static fromJSON(schema, json) {
    if (typeof json.from != "number" || typeof json.to != "number" || typeof json.gapFrom != "number" || typeof json.gapTo != "number" || typeof json.insert != "number")
      throw new RangeError("Invalid input for ReplaceAroundStep.fromJSON");
    return new _ReplaceAroundStep(json.from, json.to, json.gapFrom, json.gapTo, Slice.fromJSON(schema, json.slice), json.insert, !!json.structure);
  }
};
Step.jsonID("replaceAround", ReplaceAroundStep);
function contentBetween(doc, from, to) {
  let $from = doc.resolve(from), dist = to - from, depth = $from.depth;
  while (dist > 0 && depth > 0 && $from.indexAfter(depth) == $from.node(depth).childCount) {
    depth--;
    dist--;
  }
  if (dist > 0) {
    let next = $from.node(depth).maybeChild($from.indexAfter(depth));
    while (dist > 0) {
      if (!next || next.isLeaf)
        return true;
      next = next.firstChild;
      dist--;
    }
  }
  return false;
}
var AttrStep = class _AttrStep extends Step {
  /**
  Construct an attribute step.
  */
  constructor(pos, attr, value) {
    super();
    this.pos = pos;
    this.attr = attr;
    this.value = value;
  }
  apply(doc) {
    let node = doc.nodeAt(this.pos);
    if (!node)
      return StepResult.fail("No node at attribute step's position");
    let attrs = /* @__PURE__ */ Object.create(null);
    for (let name in node.attrs)
      attrs[name] = node.attrs[name];
    attrs[this.attr] = this.value;
    let updated = node.type.create(attrs, null, node.marks);
    return StepResult.fromReplace(doc, this.pos, this.pos + 1, new Slice(Fragment.from(updated), 0, node.isLeaf ? 0 : 1));
  }
  getMap() {
    return StepMap.empty;
  }
  invert(doc) {
    return new _AttrStep(this.pos, this.attr, doc.nodeAt(this.pos).attrs[this.attr]);
  }
  map(mapping) {
    let pos = mapping.mapResult(this.pos, 1);
    return pos.deletedAfter ? null : new _AttrStep(pos.pos, this.attr, this.value);
  }
  toJSON() {
    return { stepType: "attr", pos: this.pos, attr: this.attr, value: this.value };
  }
  static fromJSON(schema, json) {
    if (typeof json.pos != "number" || typeof json.attr != "string")
      throw new RangeError("Invalid input for AttrStep.fromJSON");
    return new _AttrStep(json.pos, json.attr, json.value);
  }
};
Step.jsonID("attr", AttrStep);
var DocAttrStep = class _DocAttrStep extends Step {
  /**
  Construct an attribute step.
  */
  constructor(attr, value) {
    super();
    this.attr = attr;
    this.value = value;
  }
  apply(doc) {
    let attrs = /* @__PURE__ */ Object.create(null);
    for (let name in doc.attrs)
      attrs[name] = doc.attrs[name];
    attrs[this.attr] = this.value;
    let updated = doc.type.create(attrs, doc.content, doc.marks);
    return StepResult.ok(updated);
  }
  getMap() {
    return StepMap.empty;
  }
  invert(doc) {
    return new _DocAttrStep(this.attr, doc.attrs[this.attr]);
  }
  map(mapping) {
    return this;
  }
  toJSON() {
    return { stepType: "docAttr", attr: this.attr, value: this.value };
  }
  static fromJSON(schema, json) {
    if (typeof json.attr != "string")
      throw new RangeError("Invalid input for DocAttrStep.fromJSON");
    return new _DocAttrStep(json.attr, json.value);
  }
};
Step.jsonID("docAttr", DocAttrStep);
var TransformError = class extends Error {
};
TransformError = function TransformError2(message) {
  let err = Error.call(this, message);
  err.__proto__ = TransformError2.prototype;
  return err;
};
TransformError.prototype = Object.create(Error.prototype);
TransformError.prototype.constructor = TransformError;
TransformError.prototype.name = "TransformError";

// node_modules/prosemirror-state/dist/index.js
var classesById = /* @__PURE__ */ Object.create(null);
var Selection = class {
  /**
  Initialize a selection with the head and anchor and ranges. If no
  ranges are given, constructs a single range across `$anchor` and
  `$head`.
  */
  constructor($anchor, $head, ranges) {
    this.$anchor = $anchor;
    this.$head = $head;
    this.ranges = ranges || [new SelectionRange($anchor.min($head), $anchor.max($head))];
  }
  /**
  The selection's anchor, as an unresolved position.
  */
  get anchor() {
    return this.$anchor.pos;
  }
  /**
  The selection's head.
  */
  get head() {
    return this.$head.pos;
  }
  /**
  The lower bound of the selection's main range.
  */
  get from() {
    return this.$from.pos;
  }
  /**
  The upper bound of the selection's main range.
  */
  get to() {
    return this.$to.pos;
  }
  /**
  The resolved lower  bound of the selection's main range.
  */
  get $from() {
    return this.ranges[0].$from;
  }
  /**
  The resolved upper bound of the selection's main range.
  */
  get $to() {
    return this.ranges[0].$to;
  }
  /**
  Indicates whether the selection contains any content.
  */
  get empty() {
    let ranges = this.ranges;
    for (let i = 0; i < ranges.length; i++)
      if (ranges[i].$from.pos != ranges[i].$to.pos)
        return false;
    return true;
  }
  /**
  Get the content of this selection as a slice.
  */
  content() {
    return this.$from.doc.slice(this.from, this.to, true);
  }
  /**
  Replace the selection with a slice or, if no slice is given,
  delete the selection. Will append to the given transaction.
  */
  replace(tr, content = Slice.empty) {
    let lastNode = content.content.lastChild, lastParent = null;
    for (let i = 0; i < content.openEnd; i++) {
      lastParent = lastNode;
      lastNode = lastNode.lastChild;
    }
    let mapFrom = tr.steps.length, ranges = this.ranges;
    for (let i = 0; i < ranges.length; i++) {
      let { $from, $to } = ranges[i], mapping = tr.mapping.slice(mapFrom);
      tr.replaceRange(mapping.map($from.pos), mapping.map($to.pos), i ? Slice.empty : content);
      if (i == 0)
        selectionToInsertionEnd(tr, mapFrom, (lastNode ? lastNode.isInline : lastParent && lastParent.isTextblock) ? -1 : 1);
    }
  }
  /**
  Replace the selection with the given node, appending the changes
  to the given transaction.
  */
  replaceWith(tr, node) {
    let mapFrom = tr.steps.length, ranges = this.ranges;
    for (let i = 0; i < ranges.length; i++) {
      let { $from, $to } = ranges[i], mapping = tr.mapping.slice(mapFrom);
      let from = mapping.map($from.pos), to = mapping.map($to.pos);
      if (i) {
        tr.deleteRange(from, to);
      } else {
        tr.replaceRangeWith(from, to, node);
        selectionToInsertionEnd(tr, mapFrom, node.isInline ? -1 : 1);
      }
    }
  }
  /**
  Find a valid cursor or leaf node selection starting at the given
  position and searching back if `dir` is negative, and forward if
  positive. When `textOnly` is true, only consider cursor
  selections. Will return null when no valid selection position is
  found.
  */
  static findFrom($pos, dir, textOnly = false) {
    let inner = $pos.parent.inlineContent ? new TextSelection($pos) : findSelectionIn($pos.node(0), $pos.parent, $pos.pos, $pos.index(), dir, textOnly);
    if (inner)
      return inner;
    for (let depth = $pos.depth - 1; depth >= 0; depth--) {
      let found2 = dir < 0 ? findSelectionIn($pos.node(0), $pos.node(depth), $pos.before(depth + 1), $pos.index(depth), dir, textOnly) : findSelectionIn($pos.node(0), $pos.node(depth), $pos.after(depth + 1), $pos.index(depth) + 1, dir, textOnly);
      if (found2)
        return found2;
    }
    return null;
  }
  /**
  Find a valid cursor or leaf node selection near the given
  position. Searches forward first by default, but if `bias` is
  negative, it will search backwards first.
  */
  static near($pos, bias = 1) {
    return this.findFrom($pos, bias) || this.findFrom($pos, -bias) || new AllSelection($pos.node(0));
  }
  /**
  Find the cursor or leaf node selection closest to the start of
  the given document. Will return an
  [`AllSelection`](https://prosemirror.net/docs/ref/#state.AllSelection) if no valid position
  exists.
  */
  static atStart(doc) {
    return findSelectionIn(doc, doc, 0, 0, 1) || new AllSelection(doc);
  }
  /**
  Find the cursor or leaf node selection closest to the end of the
  given document.
  */
  static atEnd(doc) {
    return findSelectionIn(doc, doc, doc.content.size, doc.childCount, -1) || new AllSelection(doc);
  }
  /**
  Deserialize the JSON representation of a selection. Must be
  implemented for custom classes (as a static class method).
  */
  static fromJSON(doc, json) {
    if (!json || !json.type)
      throw new RangeError("Invalid input for Selection.fromJSON");
    let cls = classesById[json.type];
    if (!cls)
      throw new RangeError(`No selection type ${json.type} defined`);
    return cls.fromJSON(doc, json);
  }
  /**
  To be able to deserialize selections from JSON, custom selection
  classes must register themselves with an ID string, so that they
  can be disambiguated. Try to pick something that's unlikely to
  clash with classes from other modules.
  */
  static jsonID(id, selectionClass) {
    if (id in classesById)
      throw new RangeError("Duplicate use of selection JSON ID " + id);
    classesById[id] = selectionClass;
    selectionClass.prototype.jsonID = id;
    return selectionClass;
  }
  /**
  Get a [bookmark](https://prosemirror.net/docs/ref/#state.SelectionBookmark) for this selection,
  which is a value that can be mapped without having access to a
  current document, and later resolved to a real selection for a
  given document again. (This is used mostly by the history to
  track and restore old selections.) The default implementation of
  this method just converts the selection to a text selection and
  returns the bookmark for that.
  */
  getBookmark() {
    return TextSelection.between(this.$anchor, this.$head).getBookmark();
  }
};
Selection.prototype.visible = true;
var SelectionRange = class {
  /**
  Create a range.
  */
  constructor($from, $to) {
    this.$from = $from;
    this.$to = $to;
  }
};
var warnedAboutTextSelection = false;
function checkTextSelection($pos) {
  if (!warnedAboutTextSelection && !$pos.parent.inlineContent) {
    warnedAboutTextSelection = true;
    console["warn"]("TextSelection endpoint not pointing into a node with inline content (" + $pos.parent.type.name + ")");
  }
}
var TextSelection = class _TextSelection extends Selection {
  /**
  Construct a text selection between the given points.
  */
  constructor($anchor, $head = $anchor) {
    checkTextSelection($anchor);
    checkTextSelection($head);
    super($anchor, $head);
  }
  /**
  Returns a resolved position if this is a cursor selection (an
  empty text selection), and null otherwise.
  */
  get $cursor() {
    return this.$anchor.pos == this.$head.pos ? this.$head : null;
  }
  map(doc, mapping) {
    let $head = doc.resolve(mapping.map(this.head));
    if (!$head.parent.inlineContent)
      return Selection.near($head);
    let $anchor = doc.resolve(mapping.map(this.anchor));
    return new _TextSelection($anchor.parent.inlineContent ? $anchor : $head, $head);
  }
  replace(tr, content = Slice.empty) {
    super.replace(tr, content);
    if (content == Slice.empty) {
      let marks = this.$from.marksAcross(this.$to);
      if (marks)
        tr.ensureMarks(marks);
    }
  }
  eq(other) {
    return other instanceof _TextSelection && other.anchor == this.anchor && other.head == this.head;
  }
  getBookmark() {
    return new TextBookmark(this.anchor, this.head);
  }
  toJSON() {
    return { type: "text", anchor: this.anchor, head: this.head };
  }
  /**
  @internal
  */
  static fromJSON(doc, json) {
    if (typeof json.anchor != "number" || typeof json.head != "number")
      throw new RangeError("Invalid input for TextSelection.fromJSON");
    return new _TextSelection(doc.resolve(json.anchor), doc.resolve(json.head));
  }
  /**
  Create a text selection from non-resolved positions.
  */
  static create(doc, anchor, head = anchor) {
    let $anchor = doc.resolve(anchor);
    return new this($anchor, head == anchor ? $anchor : doc.resolve(head));
  }
  /**
  Return a text selection that spans the given positions or, if
  they aren't text positions, find a text selection near them.
  `bias` determines whether the method searches forward (default)
  or backwards (negative number) first. Will fall back to calling
  [`Selection.near`](https://prosemirror.net/docs/ref/#state.Selection^near) when the document
  doesn't contain a valid text position.
  */
  static between($anchor, $head, bias) {
    let dPos = $anchor.pos - $head.pos;
    if (!bias || dPos)
      bias = dPos >= 0 ? 1 : -1;
    if (!$head.parent.inlineContent) {
      let found2 = Selection.findFrom($head, bias, true) || Selection.findFrom($head, -bias, true);
      if (found2)
        $head = found2.$head;
      else
        return Selection.near($head, bias);
    }
    if (!$anchor.parent.inlineContent) {
      if (dPos == 0) {
        $anchor = $head;
      } else {
        $anchor = (Selection.findFrom($anchor, -bias, true) || Selection.findFrom($anchor, bias, true)).$anchor;
        if ($anchor.pos < $head.pos != dPos < 0)
          $anchor = $head;
      }
    }
    return new _TextSelection($anchor, $head);
  }
};
Selection.jsonID("text", TextSelection);
var TextBookmark = class _TextBookmark {
  constructor(anchor, head) {
    this.anchor = anchor;
    this.head = head;
  }
  map(mapping) {
    return new _TextBookmark(mapping.map(this.anchor), mapping.map(this.head));
  }
  resolve(doc) {
    return TextSelection.between(doc.resolve(this.anchor), doc.resolve(this.head));
  }
};
var NodeSelection = class _NodeSelection extends Selection {
  /**
  Create a node selection. Does not verify the validity of its
  argument.
  */
  constructor($pos) {
    let node = $pos.nodeAfter;
    let $end = $pos.node(0).resolve($pos.pos + node.nodeSize);
    super($pos, $end);
    this.node = node;
  }
  map(doc, mapping) {
    let { deleted, pos } = mapping.mapResult(this.anchor);
    let $pos = doc.resolve(pos);
    if (deleted)
      return Selection.near($pos);
    return new _NodeSelection($pos);
  }
  content() {
    return new Slice(Fragment.from(this.node), 0, 0);
  }
  eq(other) {
    return other instanceof _NodeSelection && other.anchor == this.anchor;
  }
  toJSON() {
    return { type: "node", anchor: this.anchor };
  }
  getBookmark() {
    return new NodeBookmark(this.anchor);
  }
  /**
  @internal
  */
  static fromJSON(doc, json) {
    if (typeof json.anchor != "number")
      throw new RangeError("Invalid input for NodeSelection.fromJSON");
    return new _NodeSelection(doc.resolve(json.anchor));
  }
  /**
  Create a node selection from non-resolved positions.
  */
  static create(doc, from) {
    return new _NodeSelection(doc.resolve(from));
  }
  /**
  Determines whether the given node may be selected as a node
  selection.
  */
  static isSelectable(node) {
    return !node.isText && node.type.spec.selectable !== false;
  }
};
NodeSelection.prototype.visible = false;
Selection.jsonID("node", NodeSelection);
var NodeBookmark = class _NodeBookmark {
  constructor(anchor) {
    this.anchor = anchor;
  }
  map(mapping) {
    let { deleted, pos } = mapping.mapResult(this.anchor);
    return deleted ? new TextBookmark(pos, pos) : new _NodeBookmark(pos);
  }
  resolve(doc) {
    let $pos = doc.resolve(this.anchor), node = $pos.nodeAfter;
    if (node && NodeSelection.isSelectable(node))
      return new NodeSelection($pos);
    return Selection.near($pos);
  }
};
var AllSelection = class _AllSelection extends Selection {
  /**
  Create an all-selection over the given document.
  */
  constructor(doc) {
    super(doc.resolve(0), doc.resolve(doc.content.size));
  }
  replace(tr, content = Slice.empty) {
    if (content == Slice.empty) {
      tr.delete(0, tr.doc.content.size);
      let sel = Selection.atStart(tr.doc);
      if (!sel.eq(tr.selection))
        tr.setSelection(sel);
    } else {
      super.replace(tr, content);
    }
  }
  toJSON() {
    return { type: "all" };
  }
  /**
  @internal
  */
  static fromJSON(doc) {
    return new _AllSelection(doc);
  }
  map(doc) {
    return new _AllSelection(doc);
  }
  eq(other) {
    return other instanceof _AllSelection;
  }
  getBookmark() {
    return AllBookmark;
  }
};
Selection.jsonID("all", AllSelection);
var AllBookmark = {
  map() {
    return this;
  },
  resolve(doc) {
    return new AllSelection(doc);
  }
};
function findSelectionIn(doc, node, pos, index, dir, text = false) {
  if (node.inlineContent)
    return TextSelection.create(doc, pos);
  for (let i = index - (dir > 0 ? 0 : 1); dir > 0 ? i < node.childCount : i >= 0; i += dir) {
    let child = node.child(i);
    if (!child.isAtom) {
      let inner = findSelectionIn(doc, child, pos + dir, dir < 0 ? child.childCount : 0, dir, text);
      if (inner)
        return inner;
    } else if (!text && NodeSelection.isSelectable(child)) {
      return NodeSelection.create(doc, pos - (dir < 0 ? child.nodeSize : 0));
    }
    pos += child.nodeSize * dir;
  }
  return null;
}
function selectionToInsertionEnd(tr, startLen, bias) {
  let last = tr.steps.length - 1;
  if (last < startLen)
    return;
  let step = tr.steps[last];
  if (!(step instanceof ReplaceStep || step instanceof ReplaceAroundStep))
    return;
  let map = tr.mapping.maps[last], end;
  map.forEach((_from, _to, _newFrom, newTo) => {
    if (end == null)
      end = newTo;
  });
  tr.setSelection(Selection.near(tr.doc.resolve(end), bias));
}
function bind(f, self) {
  return !self || !f ? f : f.bind(self);
}
var FieldDesc = class {
  constructor(name, desc, self) {
    this.name = name;
    this.init = bind(desc.init, self);
    this.apply = bind(desc.apply, self);
  }
};
var baseFields = [
  new FieldDesc("doc", {
    init(config) {
      return config.doc || config.schema.topNodeType.createAndFill();
    },
    apply(tr) {
      return tr.doc;
    }
  }),
  new FieldDesc("selection", {
    init(config, instance) {
      return config.selection || Selection.atStart(instance.doc);
    },
    apply(tr) {
      return tr.selection;
    }
  }),
  new FieldDesc("storedMarks", {
    init(config) {
      return config.storedMarks || null;
    },
    apply(tr, _marks, _old, state) {
      return state.selection.$cursor ? tr.storedMarks : null;
    }
  }),
  new FieldDesc("scrollToSelection", {
    init() {
      return 0;
    },
    apply(tr, prev) {
      return tr.scrolledIntoView ? prev + 1 : prev;
    }
  })
];
function bindProps(obj, self, target) {
  for (let prop in obj) {
    let val = obj[prop];
    if (val instanceof Function)
      val = val.bind(self);
    else if (prop == "handleDOMEvents")
      val = bindProps(val, self, {});
    target[prop] = val;
  }
  return target;
}
var Plugin = class {
  /**
  Create a plugin.
  */
  constructor(spec) {
    this.spec = spec;
    this.props = {};
    if (spec.props)
      bindProps(spec.props, this, this.props);
    this.key = spec.key ? spec.key.key : createKey("plugin");
  }
  /**
  Extract the plugin's state field from an editor state.
  */
  getState(state) {
    return state[this.key];
  }
};
var keys = /* @__PURE__ */ Object.create(null);
function createKey(name) {
  if (name in keys)
    return name + "$" + ++keys[name];
  keys[name] = 0;
  return name + "$";
}
var PluginKey = class {
  /**
  Create a plugin key.
  */
  constructor(name = "key") {
    this.key = createKey(name);
  }
  /**
  Get the active plugin with this key, if any, from an editor
  state.
  */
  get(state) {
    return state.config.pluginsByKey[this.key];
  }
  /**
  Get the plugin's state from an editor state.
  */
  getState(state) {
    return state[this.key];
  }
};

// src/extensions/InlineMathWithParens.ts

var InlineMathWithParens = _extensionmathematics.InlineMath.extend({
  addPasteRules() {
    return [];
  },
  addInputRules() {
    return [
      new (0, _core.InputRule)({
        find: /\\\((.+?)\\\)$/,
        handler: ({ state, range, match }) => {
          const latex = (match[1] || "").trim();
          if (!latex) return null;
          const node = this.type.create({ latex });
          const { tr } = state;
          tr.replaceWith(range.from, range.to, node);
          const afterPos = range.from + node.nodeSize;
          tr.setSelection(TextSelection.create(tr.doc, afterPos));
        }
      })
    ];
  }
});

// src/extensions/InlineMathWithMathLive.ts

var InlineMathWithMathLive = InlineMathWithParens.extend({
  addOptions() {
    return {
      ..._optionalChain([this, 'access', _12 => _12.parent, 'optionalCall', _13 => _13()]),
      placeholderLatex: void 0
    };
  },
  addNodeView() {
    const { katexOptions } = this.options;
    const placeholderLatex = this.options.placeholderLatex;
    return ({ node, getPos, editor }) => {
      const wrapper = document.createElement("span");
      wrapper.className = "tiptap-inline-math-wrapper";
      wrapper.dataset.type = "inline-math";
      if (editor.isEditable) {
        wrapper.style.cursor = "pointer";
      }
      let isEditing = false;
      let mathField = null;
      let editModePos = null;
      let panelCleanup = null;
      let didInitialSelect = false;
      let suppressBlur = false;
      let pendingFinishTimeout = null;
      function renderKaTeX(latex) {
        const span = document.createElement("span");
        span.className = "tiptap-mathematics-render";
        if (placeholderLatex && latex === placeholderLatex) {
          span.classList.add("tiptap-math-placeholder");
        }
        try {
          _katex2.default.render(latex || "\\ ", span, {
            ...katexOptions,
            throwOnError: false
          });
        } catch (e3) {
          span.textContent = latex || "?";
          span.classList.add("inline-math-error");
        }
        Array.from(wrapper.childNodes).forEach((child) => child.remove());
        wrapper.appendChild(span);
      }
      function enterEditMode() {
        if (!editor.isEditable || isEditing) return;
        const pos = getPos();
        if (typeof pos !== "number") return;
        isEditing = true;
        editModePos = pos;
        const latex = node.attrs.latex || "";
        wrapper.innerHTML = "";
        const inlineStyle = document.createElement("style");
        inlineStyle.dataset.inlineMathStyle = "true";
        inlineStyle.textContent = `
          .tiptap-inline-math-wrapper math-field::part(virtual-keyboard-toggle) {
            display: none;
          }
          .tiptap-inline-math-wrapper math-field::part(menu-toggle) {
            display: none;
          }
        `;
        wrapper.appendChild(inlineStyle);
        const mf = document.createElement("math-field");
        mf.value = latex;
        mf.setAttribute("data-math-virtual-keyboard-policy", "manual");
        mf.style.cssText = `
          display: inline-block;
          min-width: 60px;
          font-size: 1em;
          padding: 2px 6px;
          border: 1px solid #1976d2;
          border-radius: 4px;
          background: #fff;
        `;
        const finishEdit = () => {
          if (!isEditing) return;
          const posToUse = editModePos;
          const newLatex = mf.value || "";
          isEditing = false;
          editModePos = null;
          didInitialSelect = false;
          if (panelCleanup) {
            panelCleanup();
            panelCleanup = null;
          }
          pendingFinishTimeout = window.setTimeout(() => {
            pendingFinishTimeout = null;
            mathField = null;
            if (typeof posToUse !== "number") return;
            const currentNode = editor.state.doc.nodeAt(posToUse);
            if (!currentNode || currentNode.type.name !== "inlineMath") {
              renderKaTeX(newLatex);
              return;
            }
            const from = posToUse;
            const to = from + currentNode.nodeSize;
            const tr = editor.state.tr.replaceWith(from, to, currentNode.type.create({ latex: newLatex }));
            editor.view.dispatch(tr);
            editor.commands.focus();
          }, 50);
        };
        mf.addEventListener("pointerdown", (e) => {
          e.stopPropagation();
        });
        mf.addEventListener("blur", (e) => {
          if (suppressBlur) return;
          if (panel.contains(e.relatedTarget || null)) return;
          finishEdit();
        });
        mf.addEventListener("keydown", (e) => {
          if (e.key === "Escape") {
            e.preventDefault();
            mf.value = node.attrs.latex || "";
            mf.blur();
            return;
          }
          if (e.key === " " && !e.ctrlKey && !e.metaKey && !e.altKey) {
            e.preventDefault();
            if (placeholderLatex && mf.value === placeholderLatex) {
              mf.value = "";
            }
            try {
              _nullishCoalesce(_optionalChain([mf, 'access', _14 => _14.insert, 'optionalCall', _15 => _15("\\;")]), () => ( _optionalChain([mf, 'access', _16 => _16.executeCommand, 'optionalCall', _17 => _17(["insert", "\\;"])])));
            } catch (_) {
            }
            return;
          }
          if (placeholderLatex && mf.value === placeholderLatex) {
            if (e.key === "Backspace" || e.key === "Delete") {
              e.preventDefault();
              mf.value = "";
              return;
            }
            if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
              e.preventDefault();
              mf.value = "";
              try {
                _nullishCoalesce(_optionalChain([mf, 'access', _18 => _18.insert, 'optionalCall', _19 => _19(e.key)]), () => ( _optionalChain([mf, 'access', _20 => _20.executeCommand, 'optionalCall', _21 => _21(["insert", e.key])])));
              } catch (_) {
              }
              return;
            }
          }
        });
        const panel = document.createElement("div");
        panel.className = "inline-math-insert-panel";
        panel.style.cssText = `
          position: fixed;
          z-index: 9999;
          min-width: 300px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 8px;
          background: #fff;
          border-radius: 6px;
          border: 1px solid #e0e0e0;
          box-shadow: 0 2px 12px rgba(0,0,0,0.15);
        `;
        const insertLatex = (latex2) => {
          try {
            if (typeof mf.insert === "function") {
              mf.insert(latex2);
            } else {
              _optionalChain([mf, 'access', _22 => _22.executeCommand, 'optionalCall', _23 => _23(["insert", latex2])]);
            }
            mf.focus();
          } catch (_) {
          }
        };
        const btnStyle2 = `
          min-width: 40px;
          height: 28px;
          padding: 0 8px;
          font-size: 13px;
          border: 1px solid #ccc;
          border-radius: 4px;
          background: #fff;
          cursor: pointer;
          white-space: nowrap;
        `;
        const snippets = [
          { label: "+", latex: "+" },
          { label: "\u2212", latex: "-" },
          { label: "\xD7", latex: "\\times" },
          { label: "x\xB2", latex: "x^{2}" },
          { label: "x\u207F", latex: "x^{a}" },
          { label: "\xF7", latex: "\\div" },
          { label: "\u221A", latex: "\\sqrt{}" },
          { label: "\u207F\u221A", latex: "\\sqrt[n]{}" },
          { label: "a\u2044b", latex: "\\frac{a}{b}" },
          { label: "\u03C0", latex: "\\pi" },
          { label: "\u03B8", latex: "\\theta" },
          { label: "\u2264", latex: "\\leq" },
          { label: "\u2265", latex: "\\geq" }
        ];
        const snippetsGrid = document.createElement("div");
        snippetsGrid.style.cssText = "display: grid; grid-template-columns: repeat(6, minmax(40px, 1fr)); gap: 4px;";
        snippets.forEach(({ label, latex: latex2 }) => {
          const btn = document.createElement("button");
          btn.textContent = label;
          btn.type = "button";
          btn.style.cssText = btnStyle2;
          btn.addEventListener("mousedown", (e) => {
            e.preventDefault();
            e.stopPropagation();
            insertLatex(latex2);
          });
          snippetsGrid.appendChild(btn);
        });
        panel.appendChild(snippetsGrid);
        const TRIGONOMETRY2 = [
          { label: "sin", latex: "\\sin" },
          { label: "cos", latex: "\\cos" },
          { label: "tan", latex: "\\tan" },
          { label: "cot", latex: "\\cot" },
          { label: "sec", latex: "\\sec" },
          { label: "csc", latex: "\\csc" },
          { label: "sin\u207B\xB9", latex: "\\arcsin" },
          { label: "cos\u207B\xB9", latex: "\\arccos" },
          { label: "tan\u207B\xB9", latex: "\\arctan" },
          { label: "sinh", latex: "\\sinh" },
          { label: "cosh", latex: "\\cosh" },
          { label: "\xB0", latex: "\\degree" }
        ];
        const CALCULUS2 = [
          { label: "d/dx", latex: "\\frac{d}{dx}" },
          { label: "\u2202/\u2202x", latex: "\\frac{\\partial}{\\partial x}" },
          { label: "\u222B", latex: "\\int" },
          { label: "\u222B\u2090\u1D47", latex: "\\int_{a}^{b}" },
          { label: "[ ]\u2090\u1D47", latex: "\\left[\\right]_{a}^{b}" },
          { label: "lim", latex: "\\lim_{x \\to \\infty}" },
          { label: "log\u2081\u2080", latex: "\\log_{10}" },
          { label: "log\u2090", latex: "\\log_{a}" },
          { label: "ln", latex: "\\ln" },
          { label: "exp", latex: "\\exp" }
        ];
        const GREEK2 = [
          { label: "\u03B1", latex: "\\alpha" },
          { label: "\u03B2", latex: "\\beta" },
          { label: "\u03B3", latex: "\\gamma" },
          { label: "\u03B4", latex: "\\delta" },
          { label: "\u03B5", latex: "\\varepsilon" },
          { label: "\u03B8", latex: "\\theta" },
          { label: "\u03BB", latex: "\\lambda" },
          { label: "\u03BC", latex: "\\mu" },
          { label: "\u03C0", latex: "\\pi" },
          { label: "\u03C3", latex: "\\sigma" },
          { label: "\u03C6", latex: "\\phi" },
          { label: "\u03C9", latex: "\\omega" },
          { label: "\u03A9", latex: "\\Omega" },
          { label: "\u0394", latex: "\\Delta" },
          { label: "\u03A3", latex: "\\Sigma" },
          { label: "\u221E", latex: "\\infty" },
          { label: "\u211D", latex: "\\mathbb{R}" },
          { label: "\u2115", latex: "\\mathbb{N}" },
          { label: "\u2124", latex: "\\mathbb{Z}" }
        ];
        const CHEMISTRY = [
          { label: "H\u2082O", latex: "\\mathrm{H_2O}" },
          { label: "CO\u2082", latex: "\\mathrm{CO_2}" },
          { label: "NaCl", latex: "\\mathrm{NaCl}" },
          { label: "O\u2082", latex: "\\mathrm{O_2}" },
          { label: "\u2192", latex: "\\rightarrow" },
          { label: "\u21CC", latex: "\\rightleftharpoons" },
          { label: "\u0394H", latex: "\\Delta H" },
          { label: "mol", latex: "\\mathrm{mol}" },
          { label: "aq", latex: "\\mathrm{(aq)}" },
          { label: "s", latex: "\\mathrm{(s)}" },
          { label: "l", latex: "\\mathrm{(l)}" },
          { label: "g", latex: "\\mathrm{(g)}" }
        ];
        const CATEGORIES2 = [
          { label: "Trig", snippets: TRIGONOMETRY2 },
          { label: "Calc", snippets: CALCULUS2 },
          { label: "Greek", snippets: GREEK2 },
          { label: "Chem", snippets: CHEMISTRY }
        ];
        const expandable = document.createElement("div");
        expandable.style.cssText = "display: flex; flex-direction: column; gap: 6px;";
        const tabBar = document.createElement("div");
        tabBar.style.cssText = "display: flex; align-items: center; justify-content: center; gap: 6px; flex-wrap: wrap;";
        const tabContent = document.createElement("div");
        tabContent.style.cssText = "display: none; grid-template-columns: repeat(6, minmax(40px, 1fr)); gap: 4px; max-height: 120px; overflow-y: auto;";
        let activeCategoryIndex = null;
        const renderTabContent = (index) => {
          tabContent.innerHTML = "";
          if (index === null) {
            tabContent.style.display = "none";
            return;
          }
          const cat = CATEGORIES2[index];
          if (!cat) return;
          tabContent.style.display = "grid";
          cat.snippets.forEach(({ label, latex: latex2 }) => {
            const b = document.createElement("button");
            b.textContent = label;
            b.type = "button";
            b.style.cssText = btnStyle2;
            b.addEventListener("mousedown", (e) => {
              e.preventDefault();
              e.stopPropagation();
              insertLatex(latex2);
            });
            tabContent.appendChild(b);
          });
        };
        CATEGORIES2.forEach((cat, i) => {
          if (i > 0) {
            const separator = document.createElement("span");
            separator.textContent = "|";
            separator.style.cssText = "color: #999; font-size: 12px;";
            tabBar.appendChild(separator);
          }
          const tabBtn = document.createElement("button");
          tabBtn.textContent = cat.label;
          tabBtn.type = "button";
          tabBtn.style.cssText = "font-size: 12px; padding: 2px 4px; border: 0; border-radius: 3px; background: transparent; color: #444; cursor: pointer;";
          tabBtn.addEventListener("mousedown", (e) => {
            e.preventDefault();
            e.stopPropagation();
            activeCategoryIndex = activeCategoryIndex === i ? null : i;
            Array.from(tabBar.querySelectorAll("button")).forEach((button, j) => {
              button.style.background = j === activeCategoryIndex ? "rgba(25, 118, 210, 0.10)" : "transparent";
              button.style.color = j === activeCategoryIndex ? "#1976d2" : "#444";
            });
            renderTabContent(activeCategoryIndex);
            positionPanel();
          });
          tabBar.appendChild(tabBtn);
        });
        renderTabContent(null);
        expandable.appendChild(tabBar);
        expandable.appendChild(tabContent);
        panel.appendChild(expandable);
        const editRow = document.createElement("div");
        editRow.style.cssText = "display: inline;";
        editRow.appendChild(mf);
        wrapper.appendChild(editRow);
        document.body.appendChild(panel);
        const positionPanel = () => {
          const rect = mf.getBoundingClientRect();
          const panelRect = panel.getBoundingClientRect();
          const margin = 8;
          const viewportWidth = window.innerWidth;
          const viewportHeight = window.innerHeight;
          let left = rect.right + margin;
          if (left + panelRect.width > viewportWidth - margin) {
            left = rect.left - panelRect.width - margin;
          }
          left = Math.max(margin, Math.min(left, viewportWidth - panelRect.width - margin));
          let top = rect.top;
          if (top + panelRect.height > viewportHeight - margin) {
            top = viewportHeight - panelRect.height - margin;
          }
          top = Math.max(margin, top);
          panel.style.left = `${left}px`;
          panel.style.top = `${top}px`;
        };
        const scrollParent = wrapper.closest(".tiptap-editor");
        const handleReposition = () => positionPanel();
        _optionalChain([scrollParent, 'optionalAccess', _24 => _24.addEventListener, 'call', _25 => _25("scroll", handleReposition)]);
        window.addEventListener("scroll", handleReposition, true);
        window.addEventListener("resize", handleReposition);
        mf.addEventListener("input", handleReposition);
        const resizeObserver = typeof ResizeObserver !== "undefined" ? new ResizeObserver(() => positionPanel()) : null;
        _optionalChain([resizeObserver, 'optionalAccess', _26 => _26.observe, 'call', _27 => _27(mf)]);
        positionPanel();
        requestAnimationFrame(positionPanel);
        panelCleanup = () => {
          panel.remove();
          _optionalChain([scrollParent, 'optionalAccess', _28 => _28.removeEventListener, 'call', _29 => _29("scroll", handleReposition)]);
          window.removeEventListener("scroll", handleReposition, true);
          window.removeEventListener("resize", handleReposition);
          mf.removeEventListener("input", handleReposition);
          _optionalChain([resizeObserver, 'optionalAccess', _30 => _30.disconnect, 'call', _31 => _31()]);
        };
        mathField = mf;
        mf.focus();
        if (!didInitialSelect) {
          didInitialSelect = true;
          if (placeholderLatex && latex === placeholderLatex) {
            requestAnimationFrame(() => {
              try {
                _optionalChain([mf, 'access', _32 => _32.executeCommand, 'optionalCall', _33 => _33("selectAll")]);
              } catch (_) {
              }
            });
          }
        }
      }
      function handleWrapperPointerDown(e) {
        if (!editor.isEditable) return;
        if (e.target.closest("math-field")) return;
        if (!isEditing) {
          e.preventDefault();
          enterEditMode();
        }
      }
      wrapper.addEventListener("pointerdown", handleWrapperPointerDown);
      renderKaTeX(node.attrs.latex);
      return {
        dom: wrapper,
        stopEvent() {
          return isEditing;
        },
        ignoreMutation() {
          return true;
        },
        update(updatedNode) {
          if (node.attrs.latex !== updatedNode.attrs.latex && !isEditing) {
            node = updatedNode;
            renderKaTeX(updatedNode.attrs.latex);
          }
          return true;
        },
        destroy() {
          if (pendingFinishTimeout !== null) {
            window.clearTimeout(pendingFinishTimeout);
          }
          wrapper.removeEventListener("pointerdown", handleWrapperPointerDown);
          _optionalChain([mathField, 'optionalAccess', _34 => _34.removeEventListener, 'call', _35 => _35("blur", () => {
          })]);
        }
      };
    };
  }
});

// src/extensions/SmartMathPaste.ts

var SmartMathPaste = _core.Extension.create({
  name: "smartMathPaste",
  addProseMirrorPlugins() {
    const editor = this.editor;
    return [
      new Plugin({
        key: new PluginKey("smartMathPaste"),
        props: {
          handlePaste(_view, event) {
            const plain = _nullishCoalesce(_optionalChain([event, 'access', _36 => _36.clipboardData, 'optionalAccess', _37 => _37.getData, 'call', _38 => _38("text/plain")]), () => ( ""));
            if (!plain.includes("\\[") && !plain.includes("\\(")) return false;
            const delimiterPattern = /\\\[([\s\S]+?)\\\]|\\\(([\s\S]+?)\\\)/g;
            if (!delimiterPattern.test(plain)) return false;
            event.preventDefault();
            const blockMathNodeName = editor.schema.nodes.blockMath ? "blockMath" : editor.schema.nodes.math ? "math" : editor.schema.nodes.mathBlock ? "mathBlock" : null;
            const inlineMathNodeName = editor.schema.nodes.inlineMath ? "inlineMath" : editor.schema.nodes.mathInline ? "mathInline" : null;
            const hasBlockMath = /\\\[([\s\S]+?)\\\]/.test(plain);
            const hasInlineMath = /\\\(([\s\S]+?)\\\)/.test(plain);
            if (hasBlockMath && !blockMathNodeName || hasInlineMath && !inlineMathNodeName) {
              editor.commands.insertContent(plain);
              return true;
            }
            const hasAttr = (nodeName, attrName) => Object.prototype.hasOwnProperty.call(_nullishCoalesce(editor.schema.nodes[nodeName].spec.attrs, () => ( {})), attrName);
            const makeMathAttrs = (nodeName, latex, displayMode) => {
              const attrs = {};
              if (hasAttr(nodeName, "content")) {
                attrs.content = latex;
              } else {
                attrs.latex = latex;
              }
              if (displayMode !== void 0 && hasAttr(nodeName, "displayMode")) {
                attrs.displayMode = displayMode;
              }
              return attrs;
            };
            const makeInlineMath = (latex) => ({
              type: inlineMathNodeName,
              attrs: makeMathAttrs(inlineMathNodeName, latex)
            });
            const makeMathBlock = (latex) => ({
              type: blockMathNodeName,
              attrs: makeMathAttrs(blockMathNodeName, latex, true)
            });
            const buildInlineContent = (text) => {
              const inlinePattern = /\\\(([\s\S]+?)\\\)/g;
              const inlineContent = [];
              let lastInline = 0;
              let inlineMatch;
              while (inlineMatch = inlinePattern.exec(text)) {
                const beforeInline = text.slice(lastInline, inlineMatch.index);
                if (beforeInline) inlineContent.push({ type: "text", text: beforeInline });
                const latex = inlineMatch[1].trim();
                if (latex) {
                  inlineContent.push(makeInlineMath(latex));
                } else {
                  inlineContent.push({ type: "text", text: inlineMatch[0] });
                }
                lastInline = inlinePattern.lastIndex;
              }
              const inlineTail = text.slice(lastInline);
              if (inlineTail) inlineContent.push({ type: "text", text: inlineTail });
              return inlineContent;
            };
            if (!hasBlockMath) {
              const inlineContent = buildInlineContent(plain);
              const ok2 = editor.chain().focus().insertContent(inlineContent).run();
              if (!ok2) editor.commands.insertContent(plain);
              return true;
            }
            const content = [];
            let paragraphContent = [];
            let last = 0;
            delimiterPattern.lastIndex = 0;
            let m;
            const flushParagraph = () => {
              if (paragraphContent.length > 0) {
                content.push({ type: "paragraph", content: paragraphContent });
                paragraphContent = [];
              }
            };
            while (m = delimiterPattern.exec(plain)) {
              const before = plain.slice(last, m.index);
              if (before) paragraphContent.push(...buildInlineContent(before));
              if (m[1] !== void 0) {
                flushParagraph();
                const latex = m[1].trim();
                if (latex) content.push(makeMathBlock(latex));
              } else {
                const latex = (m[2] || "").trim();
                if (latex) {
                  paragraphContent.push(makeInlineMath(latex));
                } else {
                  paragraphContent.push({ type: "text", text: m[0] });
                }
              }
              last = delimiterPattern.lastIndex;
            }
            const tail = plain.slice(last);
            if (tail) paragraphContent.push(...buildInlineContent(tail));
            flushParagraph();
            const ok = editor.chain().focus().insertContent(content).run();
            if (!ok) editor.commands.insertContent(plain);
            return true;
          }
        }
      })
    ];
  }
});

// src/extensions/MathematicsWithInlineEdit.ts
var BlockMathWithBrackets = _extensionmathematics.BlockMath.extend({
  addPasteRules() {
    return [];
  },
  addInputRules() {
    return [
      new (0, _core.InputRule)({
        find: /\\\[(.+?)\\\]$/,
        handler: ({ state, range, match }) => {
          const latex = (match[1] || "").trim();
          if (!latex) return;
          const { tr } = state;
          tr.replaceWith(range.from, range.to, this.type.create({ latex }));
        }
      })
    ];
  }
});
var MathematicsWithInlineEdit = _core.Extension.create({
  name: "MathematicsWithInlineEdit",
  addOptions() {
    return {
      inlineOptions: void 0,
      blockOptions: void 0,
      katexOptions: void 0,
      placeholderLatex: void 0
    };
  },
  addExtensions() {
    return [
      SmartMathPaste,
      BlockMathWithBrackets.configure({
        ...this.options.blockOptions,
        katexOptions: this.options.katexOptions
      }),
      InlineMathWithMathLive.configure({
        ...this.options.inlineOptions,
        katexOptions: this.options.katexOptions,
        placeholderLatex: this.options.placeholderLatex
      })
    ];
  }
});

// src/extensions/ChemStructure.ts

var ChemStructure = _core.Node.create({
  name: "chemStructure",
  group: "inline",
  inline: true,
  atom: true,
  selectable: true,
  addOptions() {
    return {
      getEmbeds: () => void 0,
      onOpenEditor: () => {
      }
    };
  },
  addAttributes() {
    return {
      structureId: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-structure-id"),
        renderHTML: (attributes) => {
          if (!attributes.structureId) return {};
          return { "data-structure-id": attributes.structureId };
        }
      }
    };
  },
  parseHTML() {
    return [
      {
        tag: 'span[data-type="chem-structure"]',
        getAttrs: (element) => {
          if (typeof element === "string") return false;
          const id = element.getAttribute("data-structure-id");
          return id ? { structureId: id } : false;
        }
      }
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      "span",
      _core.mergeAttributes.call(void 0, HTMLAttributes, {
        "data-type": "chem-structure",
        class: "chem-structure-node"
      })
    ];
  },
  addCommands() {
    return {
      insertChemStructure: (structureId) => ({ commands }) => commands.insertContent({
        type: this.name,
        attrs: { structureId }
      })
    };
  },
  addNodeView() {
    const { getEmbeds, onOpenEditor } = this.options;
    return ({ node, getPos, editor }) => {
      const dom = document.createElement("span");
      dom.className = "chem-structure-node";
      dom.dataset.type = "chem-structure";
      dom.contentEditable = "false";
      const renderPreview = () => {
        const structureId = node.attrs.structureId;
        dom.dataset.structureId = structureId;
        const embed = _chunkJJSHIBONjs.getChemStructureEmbed.call(void 0, getEmbeds(), structureId);
        dom.innerHTML = "";
        dom.classList.remove("chem-structure-node--missing");
        const previewSvg = _nullishCoalesce(_optionalChain([embed, 'optionalAccess', _39 => _39.previewSvg]), () => ( _optionalChain([embed, 'optionalAccess', _40 => _40.preview_svg])));
        if (previewSvg) {
          const wrap = document.createElement("span");
          wrap.className = "chem-structure-preview";
          wrap.innerHTML = _chunkJJSHIBONjs.namespaceChemPreviewSvg.call(void 0, previewSvg, structureId);
          dom.appendChild(wrap);
        } else {
          dom.classList.add("chem-structure-node--missing");
          dom.textContent = "Chemical structure";
        }
      };
      renderPreview();
      if (editor.isEditable) {
        dom.style.cursor = "pointer";
        dom.title = "Click to edit structure";
        dom.addEventListener("click", (event) => {
          event.preventDefault();
          event.stopPropagation();
          const pos = getPos();
          if (typeof pos !== "number") return;
          onOpenEditor({
            mode: "edit",
            structureId: node.attrs.structureId,
            pos
          });
        });
      }
      return {
        dom,
        update(updatedNode) {
          if (updatedNode.type.name !== "chemStructure") return false;
          node = updatedNode;
          renderPreview();
          return true;
        }
      };
    };
  }
});

// src/editors/ExplanationEditor.tsx
var _extensiontextalign = require('@tiptap/extension-text-align'); var _extensiontextalign2 = _interopRequireDefault(_extensiontextalign);
var _extensiontable = require('@tiptap/extension-table');
var _extensiontablerow = require('@tiptap/extension-table-row'); var _extensiontablerow2 = _interopRequireDefault(_extensiontablerow);
var _extensiontablecell = require('@tiptap/extension-table-cell'); var _extensiontablecell2 = _interopRequireDefault(_extensiontablecell);
var _extensiontableheader = require('@tiptap/extension-table-header'); var _extensiontableheader2 = _interopRequireDefault(_extensiontableheader);

// src/extensions/TextStyleFontSize.ts
var _extensiontextstyle = require('@tiptap/extension-text-style');
var TextStyleFontSize = _extensiontextstyle.TextStyle.extend({
  // keep name as "textStyle" (inherited) so removeEmptyTextStyle works
  addAttributes() {
    return {
      ..._nullishCoalesce(_optionalChain([this, 'access', _41 => _41.parent, 'optionalCall', _42 => _42()]), () => ( {})),
      fontSize: {
        default: null,
        // read inline style="font-size: 16px" -> "16px"
        parseHTML: (element) => {
          const size = element.style.fontSize;
          return size && size.trim().length > 0 ? size : null;
        },
        // write style="font-size: 16px"
        renderHTML: (attributes) => {
          const fontSize = attributes.fontSize;
          if (!fontSize) return {};
          return { style: `font-size: ${fontSize}` };
        }
      }
    };
  },
  addCommands() {
    return {
      ..._nullishCoalesce(_optionalChain([this, 'access', _43 => _43.parent, 'optionalCall', _44 => _44()]), () => ( {})),
      setFontSize: (fontSize) => ({ commands }) => {
        return commands.setMark(this.name, { fontSize });
      },
      unsetFontSize: () => ({ chain }) => {
        return chain().setMark(this.name, { fontSize: null }).removeEmptyTextStyle().run();
      }
    };
  }
});

// src/editors/ExplanationEditor.tsx
require('katex/dist/katex.min.css');
require('mathlive/static.css');

// src/components/MenuBar.tsx











var _FormatBold = require('@mui/icons-material/FormatBold'); var _FormatBold2 = _interopRequireDefault(_FormatBold);
var _FormatItalic = require('@mui/icons-material/FormatItalic'); var _FormatItalic2 = _interopRequireDefault(_FormatItalic);
var _FormatStrikethrough = require('@mui/icons-material/FormatStrikethrough'); var _FormatStrikethrough2 = _interopRequireDefault(_FormatStrikethrough);
var _FormatListBulleted = require('@mui/icons-material/FormatListBulleted'); var _FormatListBulleted2 = _interopRequireDefault(_FormatListBulleted);
var _FormatListNumbered = require('@mui/icons-material/FormatListNumbered'); var _FormatListNumbered2 = _interopRequireDefault(_FormatListNumbered);
var _Undo = require('@mui/icons-material/Undo'); var _Undo2 = _interopRequireDefault(_Undo);
var _Redo = require('@mui/icons-material/Redo'); var _Redo2 = _interopRequireDefault(_Redo);
var _TableChart = require('@mui/icons-material/TableChart'); var _TableChart2 = _interopRequireDefault(_TableChart);
var _TableRows = require('@mui/icons-material/TableRows'); var _TableRows2 = _interopRequireDefault(_TableRows);
var _ViewColumn = require('@mui/icons-material/ViewColumn'); var _ViewColumn2 = _interopRequireDefault(_ViewColumn);
var _DeleteForever = require('@mui/icons-material/DeleteForever'); var _DeleteForever2 = _interopRequireDefault(_DeleteForever);
var _ArrowUpward = require('@mui/icons-material/ArrowUpward'); var _ArrowUpward2 = _interopRequireDefault(_ArrowUpward);
var _ArrowDownward = require('@mui/icons-material/ArrowDownward'); var _ArrowDownward2 = _interopRequireDefault(_ArrowDownward);
var _ArrowBack = require('@mui/icons-material/ArrowBack'); var _ArrowBack2 = _interopRequireDefault(_ArrowBack);
var _ArrowForward = require('@mui/icons-material/ArrowForward'); var _ArrowForward2 = _interopRequireDefault(_ArrowForward);
var _CallMerge = require('@mui/icons-material/CallMerge'); var _CallMerge2 = _interopRequireDefault(_CallMerge);
var _CallSplit = require('@mui/icons-material/CallSplit'); var _CallSplit2 = _interopRequireDefault(_CallSplit);
var _Quiz = require('@mui/icons-material/Quiz'); var _Quiz2 = _interopRequireDefault(_Quiz);
var _FormatAlignLeft = require('@mui/icons-material/FormatAlignLeft'); var _FormatAlignLeft2 = _interopRequireDefault(_FormatAlignLeft);
var _FormatAlignCenter = require('@mui/icons-material/FormatAlignCenter'); var _FormatAlignCenter2 = _interopRequireDefault(_FormatAlignCenter);
var _FormatAlignRight = require('@mui/icons-material/FormatAlignRight'); var _FormatAlignRight2 = _interopRequireDefault(_FormatAlignRight);
var _Functions = require('@mui/icons-material/Functions'); var _Functions2 = _interopRequireDefault(_Functions);
var _Science = require('@mui/icons-material/Science'); var _Science2 = _interopRequireDefault(_Science);
var _ShowChart = require('@mui/icons-material/ShowChart'); var _ShowChart2 = _interopRequireDefault(_ShowChart);

var MenuBar = ({
  editor,
  showQuestionButton = false,
  onInsertEquation,
  onInsertChemStructure,
  onInsertGraph,
  toolbarMode = "tutorFull"
}) => {
  const [, forceRerender] = _react.useState.call(void 0, 0);
  const [insertTableAnchorEl, setInsertTableAnchorEl] = _react.useState.call(void 0, null);
  const [rows, setRows] = _react.useState.call(void 0, 3);
  const [cols, setCols] = _react.useState.call(void 0, 3);
  const e = editor;
  _react.useEffect.call(void 0, () => {
    if (!editor) return;
    const rerender = () => forceRerender((x) => x + 1);
    editor.on("selectionUpdate", rerender);
    editor.on("transaction", rerender);
    return () => {
      editor.off("selectionUpdate", rerender);
      editor.off("transaction", rerender);
    };
  }, [editor]);
  const hasQuestionExt = _react.useMemo.call(void 0, 
    () => editor ? !!editor.extensionManager.extensions.find((en) => en.name === "question") : false,
    [editor]
  );
  const hasMathExt = _react.useMemo.call(void 0, 
    () => editor ? !!editor.extensionManager.extensions.find((en) => en.name === "mathematics") : false,
    [editor]
  );
  if (!editor) return null;
  const FONT_SIZES = ["10px", "12px", "14px", "18px", "24px", "32px"];
  const currentFontSize = _nullishCoalesce(editor.getAttributes("textStyle").fontSize, () => ( ""));
  const openInsertPopover = Boolean(insertTableAnchorEl);
  const closeInsertPopover = () => setInsertTableAnchorEl(null);
  const btn = (label, icon, onClick, active = false, disabled = false) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _material.Tooltip, { title: label, arrow: true, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
    _material.IconButton,
    {
      size: "small",
      onClick,
      disabled,
      color: active ? "primary" : "default",
      sx: { borderRadius: 1 },
      children: icon
    }
  ) }) }, label);
  const handleInsertTable = () => {
    e.chain().focus().insertTable({ rows: Math.max(1, rows), cols: Math.max(1, cols), withHeaderRow: true }).run();
    closeInsertPopover();
  };
  const insertQuestionPlaceholder = () => {
    if (!hasQuestionExt) return;
    _optionalChain([editor, 'access', _45 => _45.commands, 'access', _46 => _46.insertQuestion, 'optionalCall', _47 => _47(null)]);
  };
  const handleEquationClick = () => {
    if (onInsertEquation) {
      onInsertEquation();
      return;
    }
    if (!hasMathExt) return;
    _nullishCoalesce(_optionalChain([editor, 'access', _48 => _48.chain, 'call', _49 => _49(), 'access', _50 => _50.focus, 'call', _51 => _51(), 'access', _52 => _52.insertMath, 'optionalCall', _53 => _53(""), 'optionalAccess', _54 => _54.run, 'optionalCall', _55 => _55()]), () => ( _optionalChain([editor, 'access', _56 => _56.commands, 'access', _57 => _57.insertMath, 'optionalCall', _58 => _58("")])));
  };
  const equationDisabled = !onInsertEquation && !hasMathExt;
  const isStudentSimple = toolbarMode === "studentSimple";
  const showAdvancedFormatting = !isStudentSimple;
  const isInTable = editor.isActive("table");
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _jsxruntime.Fragment, { children: [
    /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
      _material.Stack,
      {
        direction: "row",
        spacing: 0.5,
        sx: { borderBottom: "1px solid #ddd", p: "4px 8px", bgcolor: "#fafafa", flexWrap: "wrap" },
        children: [
          btn("Bold", /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _FormatBold2.default, {}), () => e.chain().focus().toggleBold().run(), editor.isActive("bold")),
          showAdvancedFormatting && btn("Italic", /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _FormatItalic2.default, {}), () => e.chain().focus().toggleItalic().run(), editor.isActive("italic")),
          showAdvancedFormatting && btn("Strike", /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _FormatStrikethrough2.default, {}), () => e.chain().focus().toggleStrike().run(), editor.isActive("strike")),
          showAdvancedFormatting && btn("Align Left", /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _FormatAlignLeft2.default, {}), () => e.chain().focus().setTextAlign("left").run(), editor.isActive({ textAlign: "left" })),
          showAdvancedFormatting && btn("Align Center", /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _FormatAlignCenter2.default, {}), () => e.chain().focus().setTextAlign("center").run(), editor.isActive({ textAlign: "center" })),
          showAdvancedFormatting && btn("Align Right", /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _FormatAlignRight2.default, {}), () => e.chain().focus().setTextAlign("right").run(), editor.isActive({ textAlign: "right" })),
          showAdvancedFormatting && btn("Bullet", /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _FormatListBulleted2.default, {}), () => e.chain().focus().toggleBulletList().run(), editor.isActive("bulletList")),
          showAdvancedFormatting && btn("Numbered", /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _FormatListNumbered2.default, {}), () => e.chain().focus().toggleOrderedList().run(), editor.isActive("orderedList")),
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _material.Divider, { orientation: "vertical", flexItem: true }),
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _material.Tooltip, { title: "Equation", arrow: true, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
            _material.IconButton,
            {
              size: "small",
              onClick: handleEquationClick,
              disabled: equationDisabled,
              color: "default",
              sx: { borderRadius: 1 },
              children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _Functions2.default, {})
            }
          ) }) }, "Equation"),
          onInsertChemStructure && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _material.Tooltip, { title: "Chemical structure", arrow: true, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
            _material.IconButton,
            {
              size: "small",
              onClick: onInsertChemStructure,
              color: "default",
              sx: { borderRadius: 1 },
              children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _Science2.default, {})
            }
          ) }) }, "ChemStructure"),
          onInsertGraph && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _material.Tooltip, { title: "Graph", arrow: true, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
            _material.IconButton,
            {
              size: "small",
              onClick: onInsertGraph,
              color: "default",
              sx: { borderRadius: 1 },
              children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _ShowChart2.default, {})
            }
          ) }) }, "GraphEmbed"),
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _material.Divider, { orientation: "vertical", flexItem: true }),
          /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
            _material.TextField,
            {
              select: true,
              size: "small",
              value: currentFontSize,
              onChange: (e2) => {
                const value = e2.target.value;
                if (!value) _optionalChain([editor, 'access', _59 => _59.chain, 'call', _60 => _60(), 'access', _61 => _61.focus, 'call', _62 => _62(), 'access', _63 => _63.unsetFontSize, 'optionalCall', _64 => _64(), 'access', _65 => _65.run, 'optionalCall', _66 => _66()]);
                else _optionalChain([editor, 'access', _67 => _67.chain, 'call', _68 => _68(), 'access', _69 => _69.focus, 'call', _70 => _70(), 'access', _71 => _71.setFontSize, 'optionalCall', _72 => _72(value), 'access', _73 => _73.run, 'optionalCall', _74 => _74()]);
              },
              sx: { width: 95 },
              SelectProps: { native: true },
              children: [
                /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "option", { value: "", children: "16px" }),
                FONT_SIZES.map((s) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "option", { value: s, children: s }, s))
              ]
            }
          ),
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _material.Divider, { orientation: "vertical", flexItem: true }),
          showQuestionButton && hasQuestionExt && btn("Insert question", /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _Quiz2.default, {}), insertQuestionPlaceholder),
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _material.Tooltip, { title: "Insert table", arrow: true, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
            _material.IconButton,
            {
              size: "small",
              onClick: (event) => setInsertTableAnchorEl(event.currentTarget),
              color: isInTable ? "primary" : "default",
              sx: { borderRadius: 1 },
              children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _TableChart2.default, {})
            }
          ) }) }),
          isInTable && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _jsxruntime.Fragment, { children: [
            btn("Row \u2191", /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _ArrowUpward2.default, { fontSize: "small" }), () => e.chain().focus().addRowBefore().run(), false, !e.can().addRowBefore()),
            btn("Row \u2193", /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _ArrowDownward2.default, { fontSize: "small" }), () => e.chain().focus().addRowAfter().run(), false, !e.can().addRowAfter()),
            btn("Row \xD7", /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _TableRows2.default, { fontSize: "small" }), () => e.chain().focus().deleteRow().run(), false, !e.can().deleteRow()),
            /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _material.Divider, { orientation: "vertical", flexItem: true }),
            btn("Col \u2190", /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _ArrowBack2.default, { fontSize: "small" }), () => e.chain().focus().addColumnBefore().run(), false, !e.can().addColumnBefore()),
            btn("Col \u2192", /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _ArrowForward2.default, { fontSize: "small" }), () => e.chain().focus().addColumnAfter().run(), false, !e.can().addColumnAfter()),
            btn("Col \xD7", /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _ViewColumn2.default, { fontSize: "small" }), () => e.chain().focus().deleteColumn().run(), false, !e.can().deleteColumn()),
            /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _material.Divider, { orientation: "vertical", flexItem: true }),
            btn("Merge", /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _CallMerge2.default, { fontSize: "small" }), () => e.chain().focus().mergeCells().run(), false, !e.can().mergeCells()),
            btn("Split", /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _CallSplit2.default, { fontSize: "small" }), () => e.chain().focus().splitCell().run(), false, !e.can().splitCell()),
            btn("Table \xD7", /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _DeleteForever2.default, {}), () => e.chain().focus().deleteTable().run(), false, !e.can().deleteTable())
          ] }),
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _material.Divider, { orientation: "vertical", flexItem: true }),
          btn("Undo", /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _Undo2.default, {}), () => e.chain().focus().undo().run()),
          btn("Redo", /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _Redo2.default, {}), () => e.chain().focus().redo().run())
        ]
      }
    ),
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
      _material.Popover,
      {
        open: openInsertPopover,
        anchorEl: insertTableAnchorEl,
        onClose: closeInsertPopover,
        anchorOrigin: { vertical: "bottom", horizontal: "left" },
        children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _material.Box, { sx: { p: 2, display: "flex", flexDirection: "column", gap: 1 }, children: [
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
            _material.TextField,
            {
              label: "Rows",
              type: "number",
              size: "small",
              inputProps: { min: 1, max: 50 },
              value: rows,
              onChange: (e2) => setRows(Number(e2.target.value)),
              sx: { width: 120 }
            }
          ),
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
            _material.TextField,
            {
              label: "Cols",
              type: "number",
              size: "small",
              inputProps: { min: 1, max: 20 },
              value: cols,
              onChange: (e2) => setCols(Number(e2.target.value)),
              sx: { width: 120 }
            }
          ),
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _material.Button, { variant: "contained", size: "small", onClick: handleInsertTable, children: "Insert" })
        ] })
      }
    )
  ] });
};
var MenuBar_default = MenuBar;

// src/components/ChemStructureDialogLazy.tsx

var _Box = require('@mui/material/Box'); var _Box2 = _interopRequireDefault(_Box);
var _CircularProgress = require('@mui/material/CircularProgress'); var _CircularProgress2 = _interopRequireDefault(_CircularProgress);

var LazyChemStructureDialog = _react2.default.lazy(() => Promise.resolve().then(() => _interopRequireWildcard(require("./ChemStructureDialog-OGFVGHC6.js"))));
var ChemStructureDialogLazy = (props) => {
  if (!props.open) return null;
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
    _react.Suspense,
    {
      fallback: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _Box2.default, { sx: { display: "flex", justifyContent: "center", p: 4 }, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _CircularProgress2.default, {}) }),
      children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, LazyChemStructureDialog, { ...props })
    }
  );
};
var ChemStructureDialogLazy_default = ChemStructureDialogLazy;

// src/hooks/useChemStructureEditor.ts


// src/utils/chemStructureIds.ts
function createChemStructureId() {
  const suffix = Math.random().toString(36).slice(2, 10);
  return `mol_${Date.now().toString(36)}_${suffix}`;
}

// src/hooks/useChemStructureEditor.ts
function useChemStructureEditor({
  editor,
  embeds,
  onEmbedsChange,
  enabled = true
}) {
  const embedsRef = _react.useRef.call(void 0, embeds);
  embedsRef.current = embeds;
  const [dialog, setDialog] = _react.useState.call(void 0, { open: false });
  const getEmbeds = _react.useCallback.call(void 0, () => embedsRef.current, []);
  const patchEmbeds = _react.useCallback.call(void 0, 
    (structureId, embed) => {
      const next = _chunkJJSHIBONjs.upsertChemStructure.call(void 0, _nullishCoalesce(embedsRef.current, () => ( {})), structureId, embed);
      _optionalChain([onEmbedsChange, 'optionalCall', _75 => _75(next)]);
      return next;
    },
    [onEmbedsChange]
  );
  const openChemEditor = _react.useCallback.call(void 0, 
    (request) => {
      if (!enabled || !onEmbedsChange) return;
      if (request.mode === "insert") {
        setDialog({
          open: true,
          mode: "insert",
          structureId: createChemStructureId(),
          initialSourceValue: ""
        });
        return;
      }
      const existing = _chunkJJSHIBONjs.getChemStructureEmbed.call(void 0, embedsRef.current, request.structureId);
      setDialog({
        open: true,
        mode: "edit",
        structureId: request.structureId,
        initialSourceValue: _nullishCoalesce(_optionalChain([existing, 'optionalAccess', _76 => _76.sourceValue]), () => ( "")),
        editPos: request.pos
      });
    },
    [enabled, onEmbedsChange]
  );
  const closeDialog = _react.useCallback.call(void 0, () => setDialog({ open: false }), []);
  const handleDialogSave = _react.useCallback.call(void 0, 
    async (embed) => {
      if (!dialog.open || !editor) return;
      const structureId = dialog.structureId;
      patchEmbeds(structureId, embed);
      if (dialog.mode === "insert") {
        editor.chain().focus().insertChemStructure(structureId).run();
      } else if (typeof dialog.editPos === "number") {
        editor.chain().focus().setNodeSelection(dialog.editPos).run();
      }
      editor.view.dispatch(editor.state.tr);
    },
    [dialog, editor, patchEmbeds]
  );
  const insertNewStructure = _react.useCallback.call(void 0, () => {
    openChemEditor({ mode: "insert" });
  }, [openChemEditor]);
  return {
    chemEnabled: enabled && !!onEmbedsChange,
    getEmbeds,
    openChemEditor,
    insertNewStructure,
    dialog,
    closeDialog,
    handleDialogSave
  };
}

// src/utils/mathBackspace.ts
function handleMathBackspaceKeyDown(view, event) {
  if (event.key !== "Backspace") return false;
  const { state } = view;
  const { selection } = state;
  if (selection instanceof NodeSelection) {
    const name = selection.node.type.name;
    if (name === "inlineMath" || name === "blockMath") {
      event.preventDefault();
      view.dispatch(state.tr.deleteSelection());
      return true;
    }
  }
  if (!selection.empty) return false;
  const { $from } = selection;
  const nodeBefore = $from.nodeBefore;
  if (_optionalChain([nodeBefore, 'optionalAccess', _77 => _77.type, 'access', _78 => _78.name]) === "inlineMath") {
    event.preventDefault();
    view.dispatch(
      state.tr.setSelection(NodeSelection.create(state.doc, $from.pos - nodeBefore.nodeSize))
    );
    return true;
  }
  if ($from.parent.type.name === "paragraph" && $from.parent.content.size === 0 && $from.parentOffset === 0) {
    const paragraphStart = $from.before($from.depth);
    const previousNode = state.doc.resolve(paragraphStart).nodeBefore;
    if (_optionalChain([previousNode, 'optionalAccess', _79 => _79.type, 'access', _80 => _80.name]) === "blockMath") {
      event.preventDefault();
      view.dispatch(
        state.tr.setSelection(NodeSelection.create(state.doc, paragraphStart - previousNode.nodeSize))
      );
      return true;
    }
  }
  return false;
}

// src/editors/ExplanationEditor.tsx

var PLACEHOLDER_LATEX = "\\text{Enter Equation here}";
function ExplanationEditor({
  value,
  onChange,
  placeholder,
  toolbarMode = "tutorFull",
  minHeightPx = 120,
  maxHeightPx = 320,
  embeds,
  onEmbedsChange
}) {
  const [, forceUpdate] = _react.useState.call(void 0, {});
  const chemEditorRef = _react2.default.useRef(null);
  const chemExtension = _react.useMemo.call(void 0, 
    () => ChemStructure.configure({
      getEmbeds: () => _optionalChain([chemEditorRef, 'access', _81 => _81.current, 'optionalAccess', _82 => _82.getEmbeds, 'call', _83 => _83()]),
      onOpenEditor: (request) => _optionalChain([chemEditorRef, 'access', _84 => _84.current, 'optionalAccess', _85 => _85.openChemEditor, 'call', _86 => _86(request)])
    }),
    []
  );
  const editor = _react3.useEditor.call(void 0, {
    extensions: [
      _starterkit2.default,
      TextStyleFontSize,
      _extensiontextalign2.default.configure({
        types: ["heading", "paragraph"]
      }),
      MathematicsWithInlineEdit.configure({
        katexOptions: {
          throwOnError: false
        },
        placeholderLatex: PLACEHOLDER_LATEX
      }),
      _extensiontable.Table.configure({
        resizable: true
      }),
      _extensiontablerow2.default,
      _extensiontableheader2.default,
      _extensiontablecell2.default,
      chemExtension
    ],
    content: value || "",
    editorProps: {
      handleKeyDown: handleMathBackspaceKeyDown,
      attributes: {
        style: `min-height:${minHeightPx}px;max-height:${maxHeightPx}px;overflow-y:auto;border:1px solid #d0d7de;border-radius:8px;padding:10px;outline:none;font-size:1rem;`,
        placeholder: placeholder || "Enter your answer...",
        class: "tiptap-editor"
      }
    },
    onUpdate({ editor: editor2 }) {
      onChange(editor2.getHTML());
      forceUpdate({});
    },
    onSelectionUpdate() {
      forceUpdate({});
    }
  });
  const chemEditor = useChemStructureEditor({
    editor,
    embeds,
    onEmbedsChange
  });
  chemEditorRef.current = chemEditor;
  _react.useEffect.call(void 0, () => {
    if (editor) {
      editor.view.dispatch(editor.state.tr);
    }
  }, [editor, embeds]);
  _react.useEffect.call(void 0, () => {
    if (!editor) return;
    const current = editor.getHTML();
    if (value !== current && value !== void 0) {
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
  }, [editor, value]);
  const insertInlineMath = (latex = PLACEHOLDER_LATEX) => {
    if (!editor) return;
    editor.chain().focus().insertContent({
      type: "inlineMath",
      attrs: { latex }
    }).run();
  };
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _material.Box, { sx: { width: "100%" }, children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "style", { children: `
        .tiptap-editor table {
          border-collapse: collapse;
          margin: 0;
          overflow: hidden;
          table-layout: fixed;
          width: 100%;
        }
        .tiptap-editor table td,
        .tiptap-editor table th {
          min-width: 1em;
          border: 1px solid #ced4da;
          padding: 6px 8px;
          vertical-align: top;
          box-sizing: border-box;
          position: relative;
        }
        .tiptap-editor table th {
          font-weight: bold;
          text-align: left;
          background-color: #f1f3f5;
        }
        .tiptap-editor table .selectedCell:after {
          z-index: 2;
          position: absolute;
          content: "";
          left: 0; right: 0; top: 0; bottom: 0;
          background: rgba(200, 200, 255, 0.4);
          pointer-events: none;
        }
        .tiptap-editor table .column-resize-handle {
          position: absolute;
          right: -2px;
          top: 0;
          bottom: -2px;
          width: 4px;
          background-color: #adf;
          pointer-events: none;
        }
        .tiptap-inline-math-wrapper math-field::part(virtual-keyboard-toggle) {
          display: none;
        }
        .tiptap-inline-math-wrapper {
          overflow: visible;
        }
        .inline-math-insert-panel {
          z-index: 9999;
          min-width: 280px;
        }
        .inline-math-insert-panel button {
          white-space: nowrap;
        }
        .tiptap-math-placeholder,
        .tiptap-math-placeholder .katex {
          color: #999 !important;
        }
        .chem-structure-node {
          display: inline-block;
          vertical-align: middle;
          margin: 0 2px;
        }
        .chem-structure-preview svg {
          max-height: 120px;
          width: auto;
          vertical-align: middle;
        }
        .chem-structure-node--missing {
          color: #999;
          font-style: italic;
          font-size: 0.9em;
        }
      ` }),
    editor && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
      MenuBar_default,
      {
        editor,
        toolbarMode,
        onInsertEquation: () => insertInlineMath(),
        onInsertChemStructure: chemEditor.chemEnabled ? chemEditor.insertNewStructure : void 0
      }
    ),
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _react3.EditorContent, { editor }),
    chemEditor.dialog.open && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
      ChemStructureDialogLazy_default,
      {
        open: true,
        mode: chemEditor.dialog.mode,
        initialSourceValue: chemEditor.dialog.initialSourceValue,
        onClose: chemEditor.closeDialog,
        onSave: chemEditor.handleDialogSave
      }
    )
  ] });
}

// src/editors/TiptapEditor.tsx



var _tiptapextensionresizeimage = require('tiptap-extension-resize-image'); var _tiptapextensionresizeimage2 = _interopRequireDefault(_tiptapextensionresizeimage);





// src/extensions/OverleafPaste.ts

var OverleafPaste = _core.Extension.create({
  name: "overleafPaste",
  addProseMirrorPlugins() {
    const editor = this.editor;
    return [
      new Plugin({
        key: new PluginKey("overleafPaste"),
        props: {
          handlePaste(_view, event) {
            const text = _nullishCoalesce(_optionalChain([event, 'access', _87 => _87.clipboardData, 'optionalAccess', _88 => _88.getData, 'call', _89 => _89("text/plain")]), () => ( ""));
            if (!/\\begin{tabular}/.test(text)) return false;
            event.preventDefault();
            const html = tabularToHTML(text);
            if (html) {
              editor.chain().focus().insertContent(html).run();
            } else {
              editor.commands.insertContent(text);
            }
            return true;
          }
        }
      })
    ];
  }
});
function tabularToHTML(tex) {
  const m = tex.match(/\\begin{tabular}{[^}]*}([\s\S]+?)\\end{tabular}/);
  if (!m) return null;
  const body = m[1].replace(/\\hline/g, "").replace(/\\multicolumn{[^}]+}{[^}]+}{([^}]*)}/g, "$1").trim();
  const rows = body.split(/\\\\/).map((r) => r.trim()).filter(Boolean);
  let table = '<table class="tiptap-table"><tbody>';
  rows.forEach((row) => {
    table += "<tr>";
    row.split("&").forEach((cell) => {
      const safeCell = cell.trim() || "&nbsp;";
      table += `<td>${safeCell}</td>`;
    });
    table += "</tr>";
  });
  table += "</tbody></table>";
  return table;
}

// src/editors/TiptapEditor.tsx




var TiptapEditor = ({
  value,
  onChange,
  readOnly,
  questions = false,
  embeds,
  onEmbedsChange,
  menuBarWrapperSx,
  toolbarMode = "tutorFull"
}) => {
  const chemEditorRef = _react2.default.useRef(null);
  const chemExtension = _react.useMemo.call(void 0, 
    () => ChemStructure.configure({
      getEmbeds: () => _optionalChain([chemEditorRef, 'access', _90 => _90.current, 'optionalAccess', _91 => _91.getEmbeds, 'call', _92 => _92()]),
      onOpenEditor: (request) => _optionalChain([chemEditorRef, 'access', _93 => _93.current, 'optionalAccess', _94 => _94.openChemEditor, 'call', _95 => _95(request)])
    }),
    []
  );
  const editor = _react3.useEditor.call(void 0, {
    content: value || "<p></p>",
    editable: !readOnly,
    extensions: [
      TextStyleFontSize,
      _extensiontextalign2.default.configure({
        types: ["heading", "paragraph"]
      }),
      /* base */
      _starterkit2.default,
      /* images */
      _tiptapextensionresizeimage2.default,
      /* smart-paste for Overleaf tabular and math delimiters */
      OverleafPaste,
      SmartMathPaste,
      InlineMathWithParens.configure({ katexOptions: { throwOnError: false } }),
      BlockMathWithBrackets.configure({ katexOptions: { throwOnError: false } }),
      /* tables */
      _extensiontable.Table.configure({
        resizable: true,
        HTMLAttributes: { class: "tiptap-table" }
      }),
      _extensiontablerow2.default,
      _extensiontablecell2.default,
      _extensiontableheader2.default,
      chemExtension
    ]
  });
  const chemEditor = useChemStructureEditor({
    editor,
    embeds,
    onEmbedsChange,
    enabled: !readOnly
  });
  chemEditorRef.current = chemEditor;
  _react.useEffect.call(void 0, () => {
    if (editor) {
      editor.view.dispatch(editor.state.tr);
    }
  }, [editor, embeds]);
  _react.useEffect.call(void 0, () => {
    if (!editor) return;
    const handler = () => onChange(editor.getHTML());
    editor.on("update", handler);
    return () => {
      editor.off("update", handler);
    };
  }, [editor, onChange]);
  _react.useEffect.call(void 0, () => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [editor, value]);
  if (!editor) return null;
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _jsxruntime.Fragment, { children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _Box2.default, { sx: menuBarWrapperSx, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
      MenuBar_default,
      {
        editor,
        showQuestionButton: false,
        toolbarMode,
        onInsertChemStructure: chemEditor.chemEnabled ? chemEditor.insertNewStructure : void 0
      }
    ) }),
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _react3.EditorContent, { editor, className: "tiptap" }),
    chemEditor.dialog.open && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
      ChemStructureDialogLazy_default,
      {
        open: true,
        mode: chemEditor.dialog.mode,
        initialSourceValue: chemEditor.dialog.initialSourceValue,
        onClose: chemEditor.closeDialog,
        onSave: chemEditor.handleDialogSave
      }
    )
  ] });
};
var TiptapEditor_default = TiptapEditor;

// src/components/GraphEmbedDialog.tsx

var _Dialog = require('@mui/material/Dialog'); var _Dialog2 = _interopRequireDefault(_Dialog);
var _DialogTitle = require('@mui/material/DialogTitle'); var _DialogTitle2 = _interopRequireDefault(_DialogTitle);
var _DialogContent = require('@mui/material/DialogContent'); var _DialogContent2 = _interopRequireDefault(_DialogContent);
var _DialogActions = require('@mui/material/DialogActions'); var _DialogActions2 = _interopRequireDefault(_DialogActions);
var _Button = require('@mui/material/Button'); var _Button2 = _interopRequireDefault(_Button);
var _TextField = require('@mui/material/TextField'); var _TextField2 = _interopRequireDefault(_TextField);
var _FormControl = require('@mui/material/FormControl'); var _FormControl2 = _interopRequireDefault(_FormControl);
var _InputLabel = require('@mui/material/InputLabel'); var _InputLabel2 = _interopRequireDefault(_InputLabel);
var _Select = require('@mui/material/Select'); var _Select2 = _interopRequireDefault(_Select);
var _MenuItem = require('@mui/material/MenuItem'); var _MenuItem2 = _interopRequireDefault(_MenuItem);
var _FormControlLabel = require('@mui/material/FormControlLabel'); var _FormControlLabel2 = _interopRequireDefault(_FormControlLabel);
var _Checkbox = require('@mui/material/Checkbox'); var _Checkbox2 = _interopRequireDefault(_Checkbox);
var _Stack = require('@mui/material/Stack'); var _Stack2 = _interopRequireDefault(_Stack);

var _Typography = require('@mui/material/Typography'); var _Typography2 = _interopRequireDefault(_Typography);
var _IconButton = require('@mui/material/IconButton'); var _IconButton2 = _interopRequireDefault(_IconButton);
var _ButtonBase = require('@mui/material/ButtonBase'); var _ButtonBase2 = _interopRequireDefault(_ButtonBase);
var _Popover = require('@mui/material/Popover'); var _Popover2 = _interopRequireDefault(_Popover);
var _Paper = require('@mui/material/Paper'); var _Paper2 = _interopRequireDefault(_Paper);
var _Tabs = require('@mui/material/Tabs'); var _Tabs2 = _interopRequireDefault(_Tabs);
var _Tab = require('@mui/material/Tab'); var _Tab2 = _interopRequireDefault(_Tab);
var _Delete = require('@mui/icons-material/Delete'); var _Delete2 = _interopRequireDefault(_Delete);
var _Add = require('@mui/icons-material/Add'); var _Add2 = _interopRequireDefault(_Add);

// src/utils/graphEquationVariables.ts
var IDENTIFIER_RE = /^[A-Za-z][A-Za-z0-9_]*$/;
function isValidGraphVariableName(name) {
  return IDENTIFIER_RE.test(name.trim());
}
var RESERVED = /* @__PURE__ */ new Set([
  "x",
  "y",
  "e",
  "pi",
  "sin",
  "cos",
  "tan",
  "sec",
  "csc",
  "cot",
  "log",
  "ln",
  "exp",
  "sqrt",
  "abs",
  "asin",
  "acos",
  "atan",
  "sinh",
  "cosh",
  "tanh",
  "operatorname"
]);
var LATEX_FN = /\\(sin|cos|tan|sec|csc|cot|ln|log|exp|sqrt|abs|arcsin|arccos|arctan|sinh|cosh|tanh|frac|cdot|times|left|right|mathrm|operatorname)\b/gi;
var ALWAYS_EXCLUDED_AXES = /* @__PURE__ */ new Set(["x", "y"]);
function expandImplicitAxisOperands(tokens, independentAxis) {
  const axis = independentAxis.trim();
  if (!axis || !isValidGraphVariableName(axis)) return tokens;
  const out = [];
  for (const id of tokens) {
    if (id.length > axis.length && id.endsWith(axis) && id !== axis) {
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
function extractGraphVariableNamesFromLatex(latex, options) {
  if (!latex.trim()) return [];
  const independentAxis = _optionalChain([options, 'optionalAccess', _96 => _96.independentAxis, 'optionalAccess', _97 => _97.trim, 'call', _98 => _98()]) || "x";
  const dependentAxis = _optionalChain([options, 'optionalAccess', _99 => _99.dependentAxis, 'optionalAccess', _100 => _100.trim, 'call', _101 => _101()]) || "y";
  let s = latex.replace(/\s+/g, "");
  s = s.replace(LATEX_FN, " ");
  s = s.replace(/\\[a-zA-Z]+/g, " ");
  s = s.replace(/[{}()[\],;=+\-^]/g, " ");
  const raw = [];
  const re = /[A-Za-z][A-Za-z0-9_]*/g;
  let m = re.exec(s);
  while (m) {
    raw.push(m[0]);
    m = re.exec(s);
  }
  const expanded = expandImplicitAxisOperands(raw, independentAxis);
  const found2 = /* @__PURE__ */ new Set();
  for (const id of expanded) {
    const lower = id.toLowerCase();
    if (RESERVED.has(lower)) continue;
    if (ALWAYS_EXCLUDED_AXES.has(lower)) continue;
    if (id === independentAxis || id === dependentAxis) continue;
    if (isValidGraphVariableName(id)) {
      found2.add(id);
    }
  }
  return [...found2];
}
function findUndefinedGraphVariables(latex, definedNames, axisLabels) {
  const defined = new Set(definedNames.map((n) => n.trim()).filter(Boolean));
  const xAxis = _optionalChain([axisLabels, 'access', _102 => _102.x, 'optionalAccess', _103 => _103.trim, 'call', _104 => _104()]) || "x";
  const yAxis = _optionalChain([axisLabels, 'access', _105 => _105.y, 'optionalAccess', _106 => _106.trim, 'call', _107 => _107()]) || "y";
  defined.add(xAxis);
  defined.add(yAxis);
  for (const axis of ALWAYS_EXCLUDED_AXES) {
    defined.add(axis);
  }
  return extractGraphVariableNamesFromLatex(latex, {
    independentAxis: xAxis,
    dependentAxis: yAxis
  }).filter((name) => !defined.has(name));
}

// src/components/GraphEmbedDialog.tsx

var MARKER_OPTIONS = [
  { value: "none", label: "None" },
  { value: "filled", label: "Filled dot" },
  { value: "hollow", label: "Hollow dot" },
  { value: "arrow", label: "Arrow" }
];
function exprDomainKey(expr, index) {
  return _nullishCoalesce(expr.id, () => ( `expr-${index}`));
}
function parseDomainFieldCommit(raw) {
  const t = raw.trim();
  if (t === "" || t === "-" || t === "." || t === "-.") return void 0;
  const n = Number(t);
  return Number.isFinite(n) ? n : void 0;
}
function parseGraphPixelCommit(raw) {
  const t = raw.trim();
  if (t === "" || t === "-" || t === "." || t === "-.") return void 0;
  const n = Number(t);
  return Number.isFinite(n) ? Math.round(n) : void 0;
}
function parseCoordinateCommit(raw) {
  const t = raw.trim();
  if (t === "" || t === "-" || t === "." || t === "-.") return void 0;
  const n = Number(t);
  return Number.isFinite(n) ? n : void 0;
}
function parsePositiveDecimalCommit(raw, previous) {
  const t = raw.trim();
  if (t === "" || t === "-" || t === "." || t === "-.") return previous;
  const n = Number(t);
  return Number.isFinite(n) && n > 0 ? n : previous;
}
function sanitizeGraphVariableName(raw) {
  const stripped = raw.replace(/[^A-Za-z0-9_]/g, "");
  return stripped.replace(/^[^A-Za-z]+/, "");
}
function collectPaths(objects) {
  if (!_optionalChain([objects, 'optionalAccess', _108 => _108.length])) return [];
  const out = [];
  objects.forEach((o, i) => {
    if (o.type === "line") out.push({ objectIndex: i, variant: "line", obj: o });
    else if (o.type === "curve") out.push({ objectIndex: i, variant: "curve", obj: o });
  });
  return out;
}
function pathPoints(p) {
  if (p.variant === "line") return [p.obj.start, p.obj.end];
  return p.obj.controlPoints.map((q) => [...q]);
}
function pathInterpolation(p) {
  if (p.variant === "line") return "linear";
  return _nullishCoalesce(p.obj.interpolation, () => ( "smooth"));
}
function pathToObject(points, interpolation, id, color) {
  if (points.length < 2) {
    return { type: "line", id, start: [0, 0], end: [1, 0], color };
  }
  if (points.length === 2 && interpolation === "linear") {
    return { type: "line", id, start: points[0], end: points[1], color };
  }
  return {
    type: "curve",
    id,
    controlPoints: points,
    interpolation,
    color
  };
}
function normalizeEmbedMode(embed) {
  const normalized = _chunkJJSHIBONjs.withAutoDisplaySize.call(void 0, { ...embed, mode: "display", tools: void 0 });
  return {
    ...normalized,
    autoDisplaySize: false,
    options: {
      ...normalized.options,
      stretchToFit: false,
      showGrid: _nullishCoalesce(_optionalChain([normalized, 'access', _109 => _109.options, 'optionalAccess', _110 => _110.showGrid]), () => ( true)),
      gridStep: _nullishCoalesce(_optionalChain([normalized, 'access', _111 => _111.options, 'optionalAccess', _112 => _112.gridStep]), () => ( 1))
    }
  };
}
var GraphEmbedDialog = ({
  open,
  initialEmbed,
  onClose,
  onSave
}) => {
  const [embed, setEmbed] = _react.useState.call(void 0, () => normalizeEmbedMode(initialEmbed));
  const [viewportText, setViewportText] = _react.useState.call(void 0, 
    () => _chunkJJSHIBONjs.viewportFieldsFromEmbed.call(void 0, _chunkJJSHIBONjs.normalizeViewport.call(void 0, initialEmbed.viewport))
  );
  const [previewViewport, setPreviewViewport] = _react.useState.call(void 0, 
    () => _chunkJJSHIBONjs.normalizeViewport.call(void 0, initialEmbed.viewport)
  );
  const [objectsTab, setObjectsTab] = _react.useState.call(void 0, 0);
  const [axisPopover, setAxisPopover] = _react.useState.call(void 0, null);
  const [axisDraft, setAxisDraft] = _react.useState.call(void 0, "");
  const [expressionDomainTexts, setExpressionDomainTexts] = _react.useState.call(void 0, {});
  const [graphWText, setGraphWText] = _react.useState.call(void 0, null);
  const [graphHText, setGraphHText] = _react.useState.call(void 0, null);
  const [pointCoordDrafts, setPointCoordDrafts] = _react.useState.call(void 0, 
    {}
  );
  const [pathCoordDrafts, setPathCoordDrafts] = _react.useState.call(void 0, {});
  const [gridStepText, setGridStepText] = _react.useState.call(void 0, null);
  const [scaleRatioXText, setScaleRatioXText] = _react.useState.call(void 0, null);
  const [scaleRatioYText, setScaleRatioYText] = _react.useState.call(void 0, null);
  const [variablePrompt, setVariablePrompt] = _react.useState.call(void 0, null);
  const declinedVariableKeys = _react.useRef.call(void 0, /* @__PURE__ */ new Set());
  _react.useEffect.call(void 0, () => {
    if (!axisPopover) return;
    setAxisDraft(
      axisPopover.axis === "x" ? _optionalChain([embed, 'access', _113 => _113.options, 'optionalAccess', _114 => _114.xAxisLabel, 'optionalAccess', _115 => _115.trim, 'call', _116 => _116()]) || "x" : _optionalChain([embed, 'access', _117 => _117.options, 'optionalAccess', _118 => _118.yAxisLabel, 'optionalAccess', _119 => _119.trim, 'call', _120 => _120()]) || "y"
    );
  }, [axisPopover, _optionalChain([embed, 'access', _121 => _121.options, 'optionalAccess', _122 => _122.xAxisLabel]), _optionalChain([embed, 'access', _123 => _123.options, 'optionalAccess', _124 => _124.yAxisLabel])]);
  _react.useEffect.call(void 0, () => {
    if (!open) return;
    const normalized = normalizeEmbedMode({
      ...initialEmbed,
      viewport: _chunkJJSHIBONjs.normalizeViewport.call(void 0, initialEmbed.viewport)
    });
    setEmbed(normalized);
    setViewportText(_chunkJJSHIBONjs.viewportFieldsFromEmbed.call(void 0, normalized.viewport));
    setPreviewViewport(normalized.viewport);
    setObjectsTab((t) => t > 3 ? 0 : t);
    const exs = _nullishCoalesce(normalized.expressions, () => ( []));
    const domainMap = {};
    exs.forEach((ex, i) => {
      const id = exprDomainKey(ex, i);
      domainMap[id] = {
        min: ex.domainMin !== void 0 ? String(ex.domainMin) : "",
        max: ex.domainMax !== void 0 ? String(ex.domainMax) : ""
      };
    });
    setExpressionDomainTexts(domainMap);
    setGraphWText(null);
    setGraphHText(null);
    setPointCoordDrafts({});
    setPathCoordDrafts({});
  }, [open, initialEmbed]);
  const previewEmbed = _react.useMemo.call(void 0, 
    () => normalizeEmbedMode({ ...embed, viewport: previewViewport }),
    [embed, previewViewport]
  );
  const previewDisplaySize = _react.useMemo.call(void 0, 
    () => _chunkJJSHIBONjs.resolveGraphDisplaySize.call(void 0, previewEmbed),
    [previewEmbed]
  );
  const previewAspect = _react.useMemo.call(void 0, () => {
    const h = previewDisplaySize.height || 1;
    return previewDisplaySize.width / h;
  }, [previewDisplaySize.width, previewDisplaySize.height]);
  const paths = _react.useMemo.call(void 0, () => collectPaths(embed.objects), [embed.objects]);
  _react.useEffect.call(void 0, () => {
    if (embed.autoDisplaySize !== false) {
      setGraphWText(null);
      setGraphHText(null);
    }
  }, [embed.autoDisplaySize]);
  const applyViewportToPreview = () => {
    const next = _chunkJJSHIBONjs.viewportFromFields.call(void 0, viewportText, previewViewport);
    setPreviewViewport(next);
    setEmbed((prev) => _chunkJJSHIBONjs.withAutoDisplaySize.call(void 0, { ...prev, viewport: next }, next));
  };
  const sliders = (_nullishCoalesce(embed.objects, () => ( []))).filter(
    (o) => o.type === "slider"
  );
  const expressions = _nullishCoalesce(embed.expressions, () => ( []));
  const textLabels = (_nullishCoalesce(embed.objects, () => ( []))).filter(
    (o) => o.type === "label"
  );
  const points = (_nullishCoalesce(embed.objects, () => ( []))).filter(
    (o) => o.type === "point"
  );
  _react.useEffect.call(void 0, () => {
    setExpressionDomainTexts((prev) => {
      const next = { ...prev };
      let changed = false;
      const valid = new Set(expressions.map((ex, i) => exprDomainKey(ex, i)));
      for (const k of Object.keys(next)) {
        if (!valid.has(k)) {
          delete next[k];
          changed = true;
        }
      }
      for (let i = 0; i < expressions.length; i += 1) {
        const ex = expressions[i];
        const id = exprDomainKey(ex, i);
        if (!next[id]) {
          next[id] = {
            min: ex.domainMin !== void 0 ? String(ex.domainMin) : "",
            max: ex.domainMax !== void 0 ? String(ex.domainMax) : ""
          };
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, [expressions]);
  const updateSlider = (index, patch) => {
    setEmbed((prev) => {
      const objects = [..._nullishCoalesce(prev.objects, () => ( []))];
      const sliderIndices = objects.map((o, i) => o.type === "slider" ? i : -1).filter((i) => i >= 0);
      const objIndex = sliderIndices[index];
      if (objIndex === void 0) return prev;
      objects[objIndex] = { ...objects[objIndex], ...patch };
      return { ...prev, objects };
    });
  };
  const addSliderWithName = (name) => {
    const varName = sanitizeGraphVariableName(name);
    if (!varName) return;
    const exists = sliders.some(
      (s) => (_optionalChain([s, 'access', _125 => _125.bindsTo, 'optionalAccess', _126 => _126.trim, 'call', _127 => _127()]) || _optionalChain([s, 'access', _128 => _128.name, 'optionalAccess', _129 => _129.trim, 'call', _130 => _130()])) === varName
    );
    if (exists) return;
    setEmbed((prev) => ({
      ...prev,
      objects: [
        ..._nullishCoalesce(prev.objects, () => ( [])),
        {
          type: "slider",
          id: `slider_${Date.now()}`,
          name: varName,
          min: -5,
          max: 5,
          step: 0.1,
          initial: 1,
          integer: false,
          bindsTo: varName
        }
      ]
    }));
  };
  const addSlider = () => addSliderWithName("a");
  const definedVariableNames = _react.useMemo.call(void 0, 
    () => sliders.flatMap((s) => [_optionalChain([s, 'access', _131 => _131.bindsTo, 'optionalAccess', _132 => _132.trim, 'call', _133 => _133()]), _optionalChain([s, 'access', _134 => _134.name, 'optionalAccess', _135 => _135.trim, 'call', _136 => _136()])]).filter((n) => !!n),
    [sliders]
  );
  const checkEquationForMissingVariables = (exprIndex, latex) => {
    const missing = findUndefinedGraphVariables(latex, definedVariableNames, {
      x: _optionalChain([embed, 'access', _137 => _137.options, 'optionalAccess', _138 => _138.xAxisLabel]),
      y: _optionalChain([embed, 'access', _139 => _139.options, 'optionalAccess', _140 => _140.yAxisLabel])
    });
    if (!missing.length) {
      setVariablePrompt((p) => _optionalChain([p, 'optionalAccess', _141 => _141.exprIndex]) === exprIndex ? null : p);
      return;
    }
    const name = missing[0];
    const key = `${exprIndex}:${name}`;
    if (declinedVariableKeys.current.has(key)) return;
    setVariablePrompt({ exprIndex, name });
  };
  const dismissVariablePrompt = (exprIndex, name) => {
    declinedVariableKeys.current.add(`${exprIndex}:${name}`);
    setVariablePrompt(null);
  };
  const confirmCreateVariable = (exprIndex, name) => {
    addSliderWithName(name);
    declinedVariableKeys.current.delete(`${exprIndex}:${name}`);
    setVariablePrompt(null);
    setObjectsTab(1);
  };
  const removeSlider = (index) => {
    setEmbed((prev) => {
      const objects = [..._nullishCoalesce(prev.objects, () => ( []))];
      const sliderIndices = objects.map((o, i) => o.type === "slider" ? i : -1).filter((i) => i >= 0);
      const objIndex = sliderIndices[index];
      if (objIndex === void 0) return prev;
      objects.splice(objIndex, 1);
      return { ...prev, objects };
    });
  };
  const updateExpression = (index, patch) => {
    setEmbed((prev) => {
      const next = [..._nullishCoalesce(prev.expressions, () => ( []))];
      next[index] = { ...next[index], ...patch };
      return { ...prev, expressions: next };
    });
  };
  const addExpression = () => {
    setEmbed((prev) => ({
      ...prev,
      expressions: [
        ..._nullishCoalesce(prev.expressions, () => ( [])),
        {
          id: `expr_${Date.now()}`,
          latex: "y = x^2",
          visible: true,
          startMarker: "none",
          endMarker: "none"
        }
      ]
    }));
  };
  const removeExpression = (index) => {
    setEmbed((prev) => ({
      ...prev,
      expressions: (_nullishCoalesce(prev.expressions, () => ( []))).filter((_, i) => i !== index)
    }));
  };
  const updateTextLabel = (index, patch) => {
    setEmbed((prev) => {
      const objects = [..._nullishCoalesce(prev.objects, () => ( []))];
      const labelIndices = objects.map((o, i) => o.type === "label" ? i : -1).filter((i) => i >= 0);
      const objIndex = labelIndices[index];
      if (objIndex === void 0) return prev;
      objects[objIndex] = { ...objects[objIndex], ...patch };
      return { ...prev, objects };
    });
  };
  const addTextLabel = () => {
    setEmbed((prev) => ({
      ...prev,
      objects: [
        ..._nullishCoalesce(prev.objects, () => ( [])),
        { type: "label", id: `label_${Date.now()}`, x: 0, y: 0, text: "Label" }
      ]
    }));
  };
  const removeTextLabel = (index) => {
    setEmbed((prev) => {
      const objects = [..._nullishCoalesce(prev.objects, () => ( []))];
      const labelIndices = objects.map((o, i) => o.type === "label" ? i : -1).filter((i) => i >= 0);
      const objIndex = labelIndices[index];
      if (objIndex === void 0) return prev;
      objects.splice(objIndex, 1);
      return { ...prev, objects };
    });
  };
  const updatePoint = (index, patch) => {
    setEmbed((prev) => {
      const objects = [..._nullishCoalesce(prev.objects, () => ( []))];
      const indices = objects.map((o, i) => o.type === "point" ? i : -1).filter((i) => i >= 0);
      const objIndex = indices[index];
      if (objIndex === void 0) return prev;
      objects[objIndex] = { ...objects[objIndex], ...patch };
      return { ...prev, objects };
    });
  };
  const addPoint = () => {
    setEmbed((prev) => ({
      ...prev,
      objects: [
        ..._nullishCoalesce(prev.objects, () => ( [])),
        { type: "point", id: `point_${Date.now()}`, x: 0, y: 0, label: "" }
      ]
    }));
  };
  const removePoint = (index) => {
    setEmbed((prev) => {
      const objects = [..._nullishCoalesce(prev.objects, () => ( []))];
      const indices = objects.map((o, i) => o.type === "point" ? i : -1).filter((i) => i >= 0);
      const objIndex = indices[index];
      if (objIndex === void 0) return prev;
      objects.splice(objIndex, 1);
      return { ...prev, objects };
    });
  };
  const addPath = () => {
    setEmbed((prev) => ({
      ...prev,
      objects: [
        ..._nullishCoalesce(prev.objects, () => ( [])),
        {
          type: "line",
          id: `path_${Date.now()}`,
          start: [-2, 0],
          end: [2, 0]
        }
      ]
    }));
  };
  const removePath = (objectIndex) => {
    setEmbed((prev) => {
      const objects = [..._nullishCoalesce(prev.objects, () => ( []))];
      const o = objects[objectIndex];
      if (!o || o.type !== "line" && o.type !== "curve") return prev;
      objects.splice(objectIndex, 1);
      return { ...prev, objects };
    });
  };
  const replacePath = (objectIndex, points2, interpolation) => {
    setEmbed((prev) => {
      const objects = [..._nullishCoalesce(prev.objects, () => ( []))];
      const old = objects[objectIndex];
      const id = _optionalChain([old, 'optionalAccess', _142 => _142.type]) === "line" || _optionalChain([old, 'optionalAccess', _143 => _143.type]) === "curve" ? old.id : `path_${Date.now()}`;
      const color = _optionalChain([old, 'optionalAccess', _144 => _144.type]) === "line" || _optionalChain([old, 'optionalAccess', _145 => _145.type]) === "curve" ? old.color : void 0;
      objects[objectIndex] = pathToObject(points2, interpolation, id, color);
      return { ...prev, objects };
    });
  };
  const updatePathPoint = (objectIndex, pointIndex, coord, raw) => {
    const p = paths.find((x) => x.objectIndex === objectIndex);
    if (!p) return;
    const pts = pathPoints(p);
    const prevPt = _nullishCoalesce(pts[pointIndex], () => ( [0, 0]));
    pts[pointIndex] = [
      coord === "x" ? _chunkJJSHIBONjs.parseViewportField.call(void 0, raw, prevPt[0]) : prevPt[0],
      coord === "y" ? _chunkJJSHIBONjs.parseViewportField.call(void 0, raw, prevPt[1]) : prevPt[1]
    ];
    replacePath(objectIndex, pts, pathInterpolation(p));
  };
  const setPathInterpolation = (objectIndex, interpolation) => {
    const p = paths.find((x) => x.objectIndex === objectIndex);
    if (!p) return;
    let pts = pathPoints(p);
    if (interpolation === "smooth" && pts.length === 2) {
      pts = [pts[0], [(pts[0][0] + pts[1][0]) / 2, (pts[0][1] + pts[1][1]) / 2], pts[1]];
    }
    replacePath(objectIndex, pts, interpolation);
  };
  const addPathControlPoint = (objectIndex) => {
    setEmbed((prev) => {
      const objects = [..._nullishCoalesce(prev.objects, () => ( []))];
      const o = objects[objectIndex];
      if (!o || o.type !== "line" && o.type !== "curve") return prev;
      const id = o.id;
      if (o.type === "line") {
        const pts = [o.start, o.end, [o.end[0] + 1, o.end[1]]];
        objects[objectIndex] = {
          type: "curve",
          id,
          controlPoints: pts,
          interpolation: "linear"
        };
        return { ...prev, objects };
      }
      const last = _nullishCoalesce(o.controlPoints[o.controlPoints.length - 1], () => ( [0, 0]));
      objects[objectIndex] = {
        ...o,
        controlPoints: [...o.controlPoints, [last[0] + 1, last[1]]]
      };
      return { ...prev, objects };
    });
  };
  const handleSave = () => {
    const viewport = _chunkJJSHIBONjs.viewportFromFields.call(void 0, viewportText, previewViewport);
    onSave(
      normalizeEmbedMode({
        ...embed,
        viewport,
        type: "graph",
        renderer: "jsxgraph"
      })
    );
    onClose();
  };
  const sectionTitle = (t) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _Typography2.default, { variant: "overline", color: "text.secondary", sx: { letterSpacing: 0.08 }, children: t });
  const viewSection = /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _Stack2.default, { spacing: 1.5, children: [
    sectionTitle("View"),
    /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _Stack2.default, { direction: "row", spacing: 1, flexWrap: "wrap", children: [
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
        _TextField2.default,
        {
          label: "x-min",
          type: "text",
          inputMode: "decimal",
          size: "small",
          value: viewportText.xMin,
          onChange: (e) => setViewportText((prev) => ({ ...prev, xMin: e.target.value })),
          onBlur: applyViewportToPreview,
          onKeyDown: (e) => e.key === "Enter" && applyViewportToPreview(),
          sx: { width: 110 }
        }
      ),
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
        _TextField2.default,
        {
          label: "x-max",
          type: "text",
          inputMode: "decimal",
          size: "small",
          value: viewportText.xMax,
          onChange: (e) => setViewportText((prev) => ({ ...prev, xMax: e.target.value })),
          onBlur: applyViewportToPreview,
          onKeyDown: (e) => e.key === "Enter" && applyViewportToPreview(),
          sx: { width: 110 }
        }
      ),
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
        _TextField2.default,
        {
          label: "y-min",
          type: "text",
          inputMode: "decimal",
          size: "small",
          value: viewportText.yMin,
          onChange: (e) => setViewportText((prev) => ({ ...prev, yMin: e.target.value })),
          onBlur: applyViewportToPreview,
          onKeyDown: (e) => e.key === "Enter" && applyViewportToPreview(),
          sx: { width: 110 }
        }
      ),
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
        _TextField2.default,
        {
          label: "y-max",
          type: "text",
          inputMode: "decimal",
          size: "small",
          value: viewportText.yMax,
          onChange: (e) => setViewportText((prev) => ({ ...prev, yMax: e.target.value })),
          onBlur: applyViewportToPreview,
          onKeyDown: (e) => e.key === "Enter" && applyViewportToPreview(),
          sx: { width: 110 }
        }
      )
    ] })
  ] });
  const equationsPanel = /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _Stack2.default, { spacing: 2, children: [
    /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _Stack2.default, { direction: "row", alignItems: "center", justifyContent: "space-between", children: [
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _Typography2.default, { variant: "subtitle2", children: "Equations" }),
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _Button2.default, { size: "small", startIcon: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _Add2.default, {}), onClick: addExpression, children: "Add equation" })
    ] }),
    expressions.map((expr, index) => /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
      _Stack2.default,
      {
        spacing: 1,
        sx: { p: 1.5, border: "1px solid", borderColor: "divider", borderRadius: 1 },
        onBlur: (e) => {
          const next = e.relatedTarget;
          if (next && e.currentTarget.contains(next)) return;
          checkEquationForMissingVariables(index, expr.latex);
        },
        children: [
          /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _Stack2.default, { direction: "row", spacing: 1, alignItems: "flex-start", children: [
            /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _Box2.default, { sx: { flex: 1, minWidth: 0 }, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
              MathLiveEditor_default,
              {
                value: expr.latex,
                onChange: (latex) => {
                  updateExpression(index, { latex });
                  if (_optionalChain([variablePrompt, 'optionalAccess', _146 => _146.exprIndex]) === index) {
                    setVariablePrompt(null);
                  }
                },
                minWidthPx: 200,
                minWidthPercent: 100,
                minHeightPx: 44,
                maxHeightPx: 88
              }
            ) }),
            /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _IconButton2.default, { size: "small", onClick: () => removeExpression(index), "aria-label": "Remove", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _Delete2.default, { fontSize: "small" }) })
          ] }),
          _optionalChain([variablePrompt, 'optionalAccess', _147 => _147.exprIndex]) === index && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _Paper2.default, { variant: "outlined", sx: { p: 1.25, bgcolor: "action.hover" }, children: [
            /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _Typography2.default, { variant: "body2", sx: { mb: 1 }, children: [
              'Variable "',
              variablePrompt.name,
              '" is not defined. Create it?'
            ] }),
            /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _Stack2.default, { direction: "row", spacing: 1, children: [
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                _Button2.default,
                {
                  size: "small",
                  variant: "contained",
                  onClick: () => confirmCreateVariable(index, variablePrompt.name),
                  children: "Yes"
                }
              ),
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                _Button2.default,
                {
                  size: "small",
                  onClick: () => dismissVariablePrompt(index, variablePrompt.name),
                  children: "No"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
            _TextField2.default,
            {
              label: "Graph label (at origin)",
              size: "small",
              fullWidth: true,
              value: _nullishCoalesce(expr.label, () => ( "")),
              placeholder: "Optional \u2014 only shown when set",
              onChange: (e) => updateExpression(index, {
                label: e.target.value.trim() === "" ? void 0 : e.target.value
              })
            }
          ),
          /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _Stack2.default, { direction: "row", spacing: 1, flexWrap: "wrap", alignItems: "center", children: [
            /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
              _TextField2.default,
              {
                label: "Domain x min",
                size: "small",
                type: "text",
                inputMode: "decimal",
                value: _nullishCoalesce(_optionalChain([expressionDomainTexts, 'access', _148 => _148[exprDomainKey(expr, index)], 'optionalAccess', _149 => _149.min]), () => ( (expr.domainMin !== void 0 ? String(expr.domainMin) : ""))),
                placeholder: "auto",
                onChange: (e) => {
                  const id = exprDomainKey(expr, index);
                  setExpressionDomainTexts((p) => ({
                    ...p,
                    [id]: {
                      min: e.target.value,
                      max: _nullishCoalesce(_optionalChain([p, 'access', _150 => _150[id], 'optionalAccess', _151 => _151.max]), () => ( (expr.domainMax !== void 0 ? String(expr.domainMax) : "")))
                    }
                  }));
                },
                onBlur: (e) => {
                  const v = parseDomainFieldCommit(e.target.value);
                  updateExpression(index, { domainMin: v });
                  const id = exprDomainKey(expr, index);
                  setExpressionDomainTexts((p) => ({
                    ...p,
                    [id]: {
                      min: v !== void 0 ? String(v) : "",
                      max: _nullishCoalesce(_optionalChain([p, 'access', _152 => _152[id], 'optionalAccess', _153 => _153.max]), () => ( (expr.domainMax !== void 0 ? String(expr.domainMax) : "")))
                    }
                  }));
                },
                onKeyDown: (e) => {
                  if (e.key !== "Enter") return;
                  e.target.blur();
                },
                sx: { width: 100 }
              }
            ),
            /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
              _TextField2.default,
              {
                label: "Domain x max",
                size: "small",
                type: "text",
                inputMode: "decimal",
                value: _nullishCoalesce(_optionalChain([expressionDomainTexts, 'access', _154 => _154[exprDomainKey(expr, index)], 'optionalAccess', _155 => _155.max]), () => ( (expr.domainMax !== void 0 ? String(expr.domainMax) : ""))),
                placeholder: "auto",
                onChange: (e) => {
                  const id = exprDomainKey(expr, index);
                  setExpressionDomainTexts((p) => ({
                    ...p,
                    [id]: {
                      min: _nullishCoalesce(_optionalChain([p, 'access', _156 => _156[id], 'optionalAccess', _157 => _157.min]), () => ( (expr.domainMin !== void 0 ? String(expr.domainMin) : ""))),
                      max: e.target.value
                    }
                  }));
                },
                onBlur: (e) => {
                  const v = parseDomainFieldCommit(e.target.value);
                  updateExpression(index, { domainMax: v });
                  const id = exprDomainKey(expr, index);
                  setExpressionDomainTexts((p) => ({
                    ...p,
                    [id]: {
                      min: _nullishCoalesce(_optionalChain([p, 'access', _158 => _158[id], 'optionalAccess', _159 => _159.min]), () => ( (expr.domainMin !== void 0 ? String(expr.domainMin) : ""))),
                      max: v !== void 0 ? String(v) : ""
                    }
                  }));
                },
                onKeyDown: (e) => {
                  if (e.key !== "Enter") return;
                  e.target.blur();
                },
                sx: { width: 100 }
              }
            ),
            /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _FormControl2.default, { size: "small", sx: { minWidth: 100 }, children: [
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _InputLabel2.default, { id: `es-${exprDomainKey(expr, index)}`, children: "Start" }),
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                _Select2.default,
                {
                  labelId: `es-${exprDomainKey(expr, index)}`,
                  label: "Start",
                  value: _nullishCoalesce(expr.startMarker, () => ( "none")),
                  onChange: (e) => updateExpression(index, { startMarker: e.target.value }),
                  children: MARKER_OPTIONS.map((opt) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _MenuItem2.default, { value: opt.value, children: opt.label }, opt.value))
                }
              )
            ] }),
            /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _FormControl2.default, { size: "small", sx: { minWidth: 100 }, children: [
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _InputLabel2.default, { id: `ee-${exprDomainKey(expr, index)}`, children: "End" }),
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                _Select2.default,
                {
                  labelId: `ee-${exprDomainKey(expr, index)}`,
                  label: "End",
                  value: _nullishCoalesce(expr.endMarker, () => ( "none")),
                  onChange: (e) => updateExpression(index, { endMarker: e.target.value }),
                  children: MARKER_OPTIONS.map((opt) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _MenuItem2.default, { value: opt.value, children: opt.label }, opt.value))
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _Typography2.default, { variant: "caption", color: "text.secondary", children: "y = f(x), relations, or bare expression. Domain / markers apply to function plots." })
        ]
      },
      exprDomainKey(expr, index)
    ))
  ] });
  const slidersPanel = /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _Stack2.default, { spacing: 2, children: [
    /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _Stack2.default, { direction: "row", alignItems: "center", justifyContent: "space-between", children: [
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _Typography2.default, { variant: "subtitle2", children: "Variables" }),
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _Button2.default, { size: "small", startIcon: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _Add2.default, {}), onClick: addSlider, children: "Add variable" })
    ] }),
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _Typography2.default, { variant: "caption", color: "text.secondary", children: "Variables appear on the graph; students can adjust them when the graph is interactive." }),
    sliders.map((slider, index) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
      _Stack2.default,
      {
        spacing: 1,
        sx: { p: 1.5, border: "1px solid", borderColor: "divider", borderRadius: 1 },
        children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _Stack2.default, { direction: "row", spacing: 1, flexWrap: "wrap", alignItems: "center", children: [
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
            _TextField2.default,
            {
              label: "Variable",
              size: "small",
              value: slider.name,
              onChange: (e) => {
                const name = sanitizeGraphVariableName(e.target.value);
                updateSlider(index, { name, bindsTo: name });
              },
              inputProps: { title: "Letters, numbers, underscore" },
              sx: { width: 92 }
            }
          ),
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
            _TextField2.default,
            {
              label: "Min",
              size: "small",
              value: String(slider.min),
              onChange: (e) => updateSlider(index, { min: _chunkJJSHIBONjs.parseViewportField.call(void 0, e.target.value, slider.min) }),
              sx: { width: 72 }
            }
          ),
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
            _TextField2.default,
            {
              label: "Max",
              size: "small",
              value: String(slider.max),
              onChange: (e) => updateSlider(index, { max: _chunkJJSHIBONjs.parseViewportField.call(void 0, e.target.value, slider.max) }),
              sx: { width: 72 }
            }
          ),
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
            _TextField2.default,
            {
              label: "Initial",
              size: "small",
              value: String(slider.initial),
              onChange: (e) => updateSlider(index, {
                initial: _chunkJJSHIBONjs.parseViewportField.call(void 0, e.target.value, slider.initial)
              }),
              sx: { width: 72 }
            }
          ),
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
            _FormControlLabel2.default,
            {
              control: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                _Checkbox2.default,
                {
                  checked: !!slider.integer,
                  onChange: (e) => {
                    const integer = e.target.checked;
                    updateSlider(index, {
                      integer,
                      step: integer ? 1 : 0.1,
                      min: integer ? Math.round(slider.min) : slider.min,
                      max: integer ? Math.round(slider.max) : slider.max,
                      initial: integer ? Math.round(slider.initial) : slider.initial
                    });
                  }
                }
              ),
              label: "Integer",
              sx: { m: 0, ml: 0.25 }
            }
          ),
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _IconButton2.default, { size: "small", onClick: () => removeSlider(index), "aria-label": "Remove", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _Delete2.default, { fontSize: "small" }) })
        ] })
      },
      _nullishCoalesce(slider.id, () => ( index))
    ))
  ] });
  const geometryPanel = /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _Stack2.default, { spacing: 2, children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
      _FormControlLabel2.default,
      {
        control: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
          _Checkbox2.default,
          {
            checked: !!_optionalChain([embed, 'access', _160 => _160.options, 'optionalAccess', _161 => _161.snapToGrid]),
            onChange: (e) => setEmbed((prev) => ({
              ...prev,
              options: { ...prev.options, snapToGrid: e.target.checked }
            }))
          }
        ),
        label: "Snap to grid"
      }
    ),
    /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _Stack2.default, { direction: { xs: "column", md: "row" }, spacing: 2, alignItems: "stretch", children: [
      /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
        _Box2.default,
        {
          sx: {
            flex: 1,
            minWidth: 0,
            pr: { md: 2 },
            borderRight: { md: "1px solid" },
            borderColor: { md: "divider" }
          },
          children: [
            /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _Stack2.default, { direction: "row", alignItems: "center", justifyContent: "space-between", sx: { mb: 1 }, children: [
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _Typography2.default, { variant: "subtitle2", children: "Points" }),
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _Button2.default, { size: "small", startIcon: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _Add2.default, {}), onClick: addPoint, children: "Add point" })
            ] }),
            /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _Stack2.default, { spacing: 1.5, children: points.map((point, index) => /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
              _Stack2.default,
              {
                direction: "row",
                spacing: 1,
                alignItems: "center",
                flexWrap: "wrap",
                sx: { p: 1.5, border: "1px solid", borderColor: "divider", borderRadius: 1 },
                children: [
                  /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                    _TextField2.default,
                    {
                      label: "x",
                      size: "small",
                      value: _nullishCoalesce(_optionalChain([pointCoordDrafts, 'access', _162 => _162[_nullishCoalesce(point.id, () => ( `point-${index}`))], 'optionalAccess', _163 => _163.x]), () => ( String(point.x))),
                      onChange: (e) => {
                        const key = _nullishCoalesce(point.id, () => ( `point-${index}`));
                        setPointCoordDrafts((prev) => ({
                          ...prev,
                          [key]: { x: e.target.value, y: _nullishCoalesce(_optionalChain([prev, 'access', _164 => _164[key], 'optionalAccess', _165 => _165.y]), () => ( String(point.y))) }
                        }));
                      },
                      onBlur: (e) => {
                        const key = _nullishCoalesce(point.id, () => ( `point-${index}`));
                        const next = parseCoordinateCommit(e.target.value);
                        if (next !== void 0) updatePoint(index, { x: next });
                        setPointCoordDrafts((prev) => {
                          const out = { ...prev };
                          delete out[key];
                          return out;
                        });
                      },
                      onKeyDown: (e) => {
                        if (e.key === "Enter") e.target.blur();
                      },
                      sx: { width: 72 }
                    }
                  ),
                  /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                    _TextField2.default,
                    {
                      label: "y",
                      size: "small",
                      value: _nullishCoalesce(_optionalChain([pointCoordDrafts, 'access', _166 => _166[_nullishCoalesce(point.id, () => ( `point-${index}`))], 'optionalAccess', _167 => _167.y]), () => ( String(point.y))),
                      onChange: (e) => {
                        const key = _nullishCoalesce(point.id, () => ( `point-${index}`));
                        setPointCoordDrafts((prev) => ({
                          ...prev,
                          [key]: { x: _nullishCoalesce(_optionalChain([prev, 'access', _168 => _168[key], 'optionalAccess', _169 => _169.x]), () => ( String(point.x))), y: e.target.value }
                        }));
                      },
                      onBlur: (e) => {
                        const key = _nullishCoalesce(point.id, () => ( `point-${index}`));
                        const next = parseCoordinateCommit(e.target.value);
                        if (next !== void 0) updatePoint(index, { y: next });
                        setPointCoordDrafts((prev) => {
                          const out = { ...prev };
                          delete out[key];
                          return out;
                        });
                      },
                      onKeyDown: (e) => {
                        if (e.key === "Enter") e.target.blur();
                      },
                      sx: { width: 72 }
                    }
                  ),
                  /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                    _TextField2.default,
                    {
                      label: "Label",
                      size: "small",
                      value: _nullishCoalesce(point.label, () => ( "")),
                      onChange: (e) => updatePoint(index, { label: e.target.value }),
                      sx: { width: 100 }
                    }
                  ),
                  /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _IconButton2.default, { size: "small", onClick: () => removePoint(index), "aria-label": "Remove", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _Delete2.default, { fontSize: "small" }) })
                ]
              },
              _nullishCoalesce(point.id, () => ( index))
            )) })
          ]
        }
      ),
      /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _Box2.default, { sx: { flex: 1, minWidth: 0 }, children: [
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _Stack2.default, { direction: "row", alignItems: "center", justifyContent: "space-between", sx: { mb: 1 }, children: [
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _Typography2.default, { variant: "subtitle2", children: "Lines & curves" }),
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _Button2.default, { size: "small", startIcon: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _Add2.default, {}), onClick: addPath, children: "Add path" })
        ] }),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _Typography2.default, { variant: "caption", color: "text.secondary", display: "block", sx: { mb: 1 }, children: "Two points + linear = segment; more points or smooth = spline." }),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _Stack2.default, { spacing: 1.5, children: paths.map((path, listIndex) => {
          const pts = pathPoints(path);
          const interp = pathInterpolation(path);
          return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
            _Stack2.default,
            {
              spacing: 1,
              sx: { p: 1.5, border: "1px solid", borderColor: "divider", borderRadius: 1 },
              children: [
                /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _Stack2.default, { direction: "row", spacing: 1, alignItems: "center", flexWrap: "wrap", children: [
                  /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _FormControl2.default, { size: "small", sx: { minWidth: 120 }, children: [
                    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _InputLabel2.default, { id: `path-style-${path.objectIndex}`, children: "Style" }),
                    /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
                      _Select2.default,
                      {
                        labelId: `path-style-${path.objectIndex}`,
                        label: "Style",
                        value: interp,
                        onChange: (e) => setPathInterpolation(
                          path.objectIndex,
                          e.target.value
                        ),
                        children: [
                          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _MenuItem2.default, { value: "linear", children: "Linear" }),
                          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _MenuItem2.default, { value: "smooth", children: "Smooth" })
                        ]
                      }
                    )
                  ] }),
                  /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _Button2.default, { size: "small", onClick: () => addPathControlPoint(path.objectIndex), children: "Add point" }),
                  /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _Box2.default, { sx: { flex: 1 } }),
                  /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                    _IconButton2.default,
                    {
                      size: "small",
                      onClick: () => removePath(path.objectIndex),
                      "aria-label": "Remove path",
                      children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _Delete2.default, { fontSize: "small" })
                    }
                  )
                ] }),
                pts.map((pt, ptIndex) => /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _Stack2.default, { direction: "row", spacing: 1, alignItems: "center", children: [
                  /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _Typography2.default, { variant: "caption", color: "text.secondary", sx: { width: 28 }, children: [
                    "P",
                    ptIndex + 1
                  ] }),
                  /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                    _TextField2.default,
                    {
                      label: "x",
                      size: "small",
                      value: _nullishCoalesce(pathCoordDrafts[`path-${path.objectIndex}-${ptIndex}-x`], () => ( String(pt[0]))),
                      onChange: (e) => setPathCoordDrafts((prev) => ({
                        ...prev,
                        [`path-${path.objectIndex}-${ptIndex}-x`]: e.target.value
                      })),
                      onBlur: (e) => {
                        const key = `path-${path.objectIndex}-${ptIndex}-x`;
                        const next = parseCoordinateCommit(e.target.value);
                        if (next !== void 0) {
                          updatePathPoint(path.objectIndex, ptIndex, "x", String(next));
                        }
                        setPathCoordDrafts((prev) => {
                          const out = { ...prev };
                          delete out[key];
                          return out;
                        });
                      },
                      onKeyDown: (e) => {
                        if (e.key === "Enter") e.target.blur();
                      },
                      sx: { width: 72 }
                    }
                  ),
                  /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                    _TextField2.default,
                    {
                      label: "y",
                      size: "small",
                      value: _nullishCoalesce(pathCoordDrafts[`path-${path.objectIndex}-${ptIndex}-y`], () => ( String(pt[1]))),
                      onChange: (e) => setPathCoordDrafts((prev) => ({
                        ...prev,
                        [`path-${path.objectIndex}-${ptIndex}-y`]: e.target.value
                      })),
                      onBlur: (e) => {
                        const key = `path-${path.objectIndex}-${ptIndex}-y`;
                        const next = parseCoordinateCommit(e.target.value);
                        if (next !== void 0) {
                          updatePathPoint(path.objectIndex, ptIndex, "y", String(next));
                        }
                        setPathCoordDrafts((prev) => {
                          const out = { ...prev };
                          delete out[key];
                          return out;
                        });
                      },
                      onKeyDown: (e) => {
                        if (e.key === "Enter") e.target.blur();
                      },
                      sx: { width: 72 }
                    }
                  )
                ] }, ptIndex))
              ]
            },
            `${path.objectIndex}-${listIndex}`
          );
        }) })
      ] })
    ] })
  ] });
  const labelsPanel = /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _Stack2.default, { spacing: 2, children: [
    /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _Stack2.default, { direction: "row", alignItems: "center", justifyContent: "space-between", children: [
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _Typography2.default, { variant: "subtitle2", children: "Text labels" }),
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _Button2.default, { size: "small", startIcon: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _Add2.default, {}), onClick: addTextLabel, children: "Add label" })
    ] }),
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _Typography2.default, { variant: "caption", color: "text.secondary", children: "Free text at coordinates. Equation labels use the equation panel." }),
    textLabels.map((label, index) => /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
      _Stack2.default,
      {
        direction: "row",
        spacing: 1,
        alignItems: "center",
        flexWrap: "wrap",
        sx: { p: 1.5, border: "1px solid", borderColor: "divider", borderRadius: 1 },
        children: [
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
            _TextField2.default,
            {
              label: "Text",
              size: "small",
              value: label.text,
              onChange: (e) => updateTextLabel(index, { text: e.target.value }),
              sx: { flex: 1, minWidth: 120 }
            }
          ),
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
            _TextField2.default,
            {
              label: "x",
              size: "small",
              value: String(label.x),
              onChange: (e) => updateTextLabel(index, { x: _chunkJJSHIBONjs.parseViewportField.call(void 0, e.target.value, label.x) }),
              sx: { width: 72 }
            }
          ),
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
            _TextField2.default,
            {
              label: "y",
              size: "small",
              value: String(label.y),
              onChange: (e) => updateTextLabel(index, { y: _chunkJJSHIBONjs.parseViewportField.call(void 0, e.target.value, label.y) }),
              sx: { width: 72 }
            }
          ),
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _IconButton2.default, { size: "small", onClick: () => removeTextLabel(index), "aria-label": "Remove", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _Delete2.default, { fontSize: "small" }) })
        ]
      },
      _nullishCoalesce(label.id, () => ( index))
    ))
  ] });
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _Dialog2.default, { open, onClose, maxWidth: "xl", fullWidth: true, scroll: "paper", children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _DialogTitle2.default, { children: "Graph settings" }),
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _DialogContent2.default, { dividers: true, sx: { pt: 2 }, children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
      _Stack2.default,
      {
        direction: { xs: "column", md: "row" },
        spacing: 3,
        alignItems: { xs: "stretch", md: "flex-start" },
        children: [
          /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
            _Box2.default,
            {
              sx: {
                flex: { md: "0 0 auto" },
                width: { md: Math.min(previewDisplaySize.width + 48, 580) },
                maxWidth: "100%"
              },
              children: [
                /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _Typography2.default, { variant: "subtitle2", gutterBottom: true, children: "Preview" }),
                /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
                  _Stack2.default,
                  {
                    direction: "row",
                    spacing: 2,
                    alignItems: "center",
                    flexWrap: "wrap",
                    sx: {
                      mb: 1,
                      py: 0.75,
                      px: 1,
                      bgcolor: "action.hover",
                      borderRadius: 1,
                      border: "1px solid",
                      borderColor: "divider"
                    },
                    children: [
                      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                        _FormControlLabel2.default,
                        {
                          control: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                            _Checkbox2.default,
                            {
                              size: "small",
                              checked: _optionalChain([embed, 'access', _170 => _170.options, 'optionalAccess', _171 => _171.showAxes]) !== false,
                              onChange: (e) => setEmbed((prev) => ({
                                ...prev,
                                options: { ...prev.options, showAxes: e.target.checked }
                              }))
                            }
                          ),
                          label: "Show axes"
                        }
                      ),
                      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                        _FormControlLabel2.default,
                        {
                          control: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                            _Checkbox2.default,
                            {
                              size: "small",
                              checked: _optionalChain([embed, 'access', _172 => _172.options, 'optionalAccess', _173 => _173.showGrid]) === true,
                              onChange: (e) => setEmbed((prev) => ({
                                ...prev,
                                options: { ...prev.options, showGrid: e.target.checked }
                              }))
                            }
                          ),
                          label: "Show grid"
                        }
                      ),
                      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                        _TextField2.default,
                        {
                          size: "small",
                          label: "Step",
                          type: "text",
                          inputMode: "decimal",
                          disabled: _optionalChain([embed, 'access', _174 => _174.options, 'optionalAccess', _175 => _175.showGrid]) !== true,
                          value: _nullishCoalesce(gridStepText, () => ( String(_nullishCoalesce(_optionalChain([embed, 'access', _176 => _176.options, 'optionalAccess', _177 => _177.gridStep]), () => ( 1))))),
                          onFocus: (e) => setGridStepText(e.target.value),
                          onChange: (e) => setGridStepText(e.target.value),
                          onBlur: (e) => {
                            const prev = _nullishCoalesce(_optionalChain([embed, 'access', _178 => _178.options, 'optionalAccess', _179 => _179.gridStep]), () => ( 1));
                            const step = parsePositiveDecimalCommit(e.target.value, prev);
                            setGridStepText(null);
                            setEmbed((p) => ({
                              ...p,
                              options: { ...p.options, gridStep: step }
                            }));
                          },
                          onKeyDown: (e) => {
                            if (e.key === "Enter") e.target.blur();
                          },
                          sx: { width: 92 }
                        }
                      )
                    ]
                  }
                ),
                open && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
                  _Box2.default,
                  {
                    sx: {
                      position: "relative",
                      width: previewDisplaySize.width,
                      maxWidth: "100%",
                      mx: "auto",
                      height: previewDisplaySize.height,
                      border: 1,
                      borderColor: "divider",
                      borderRadius: 1,
                      overflow: "hidden"
                    },
                    children: [
                      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                        _chunkJJSHIBONjs.GraphPreview_default,
                        {
                          embed: previewEmbed,
                          height: previewDisplaySize.height,
                          width: `${previewDisplaySize.width}px`
                        },
                        _chunkJJSHIBONjs.graphPreviewKey.call(void 0, previewEmbed)
                      ),
                      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                        _ButtonBase2.default,
                        {
                          type: "button",
                          disableRipple: true,
                          "aria-label": "Edit horizontal axis label",
                          onClick: (e) => setAxisPopover({ axis: "y", anchor: e.currentTarget }),
                          sx: {
                            position: "absolute",
                            bottom: 2,
                            left: "50%",
                            transform: "translateX(-50%)",
                            width: Math.min(200, previewDisplaySize.width * 0.55),
                            height: 40,
                            borderRadius: 1,
                            zIndex: 2,
                            opacity: 0,
                            "&:hover": { opacity: 0.15, bgcolor: "primary.main" }
                          }
                        }
                      ),
                      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                        _ButtonBase2.default,
                        {
                          type: "button",
                          disableRipple: true,
                          "aria-label": "Edit vertical axis label",
                          onClick: (e) => setAxisPopover({ axis: "x", anchor: e.currentTarget }),
                          sx: {
                            position: "absolute",
                            left: 2,
                            top: "50%",
                            transform: "translateY(-50%)",
                            width: 44,
                            height: Math.min(160, previewDisplaySize.height * 0.5),
                            borderRadius: 1,
                            zIndex: 2,
                            opacity: 0,
                            "&:hover": { opacity: 0.15, bgcolor: "primary.main" }
                          }
                        }
                      ),
                      /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
                        _Paper2.default,
                        {
                          elevation: 2,
                          sx: {
                            position: "absolute",
                            right: 8,
                            bottom: 8,
                            p: 1,
                            zIndex: 2,
                            bgcolor: "background.paper"
                          },
                          children: [
                            /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _Typography2.default, { variant: "caption", color: "text.secondary", display: "block", gutterBottom: true, children: "Scale ratio" }),
                            /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _Stack2.default, { direction: "row", spacing: 0.5, alignItems: "center", flexWrap: "wrap", children: [
                              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _Typography2.default, { variant: "caption", children: "x" }),
                              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                                _TextField2.default,
                                {
                                  size: "small",
                                  type: "text",
                                  inputMode: "decimal",
                                  value: _nullishCoalesce(scaleRatioXText, () => ( String(_nullishCoalesce(_optionalChain([embed, 'access', _180 => _180.options, 'optionalAccess', _181 => _181.scaleRatio, 'optionalAccess', _182 => _182.x]), () => ( 1))))),
                                  onFocus: (e) => {
                                    e.stopPropagation();
                                    setScaleRatioXText(e.target.value);
                                  },
                                  onChange: (e) => {
                                    e.stopPropagation();
                                    setScaleRatioXText(e.target.value);
                                  },
                                  onBlur: (e) => {
                                    e.stopPropagation();
                                    const prevX = _nullishCoalesce(_optionalChain([embed, 'access', _183 => _183.options, 'optionalAccess', _184 => _184.scaleRatio, 'optionalAccess', _185 => _185.x]), () => ( 1));
                                    const prevY = _nullishCoalesce(_optionalChain([embed, 'access', _186 => _186.options, 'optionalAccess', _187 => _187.scaleRatio, 'optionalAccess', _188 => _188.y]), () => ( 1));
                                    const x = parsePositiveDecimalCommit(e.target.value, prevX);
                                    setScaleRatioXText(null);
                                    setEmbed(
                                      (p) => _chunkJJSHIBONjs.withAutoDisplaySize.call(void 0, 
                                        {
                                          ...p,
                                          options: {
                                            ...p.options,
                                            stretchToFit: false,
                                            scaleRatio: { x, y: prevY }
                                          }
                                        },
                                        previewViewport
                                      )
                                    );
                                  },
                                  onKeyDown: (e) => {
                                    if (e.key === "Enter") e.target.blur();
                                  },
                                  onClick: (e) => e.stopPropagation(),
                                  sx: { width: 68 }
                                }
                              ),
                              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _Typography2.default, { variant: "caption", children: "y" }),
                              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                                _TextField2.default,
                                {
                                  size: "small",
                                  type: "text",
                                  inputMode: "decimal",
                                  value: _nullishCoalesce(scaleRatioYText, () => ( String(_nullishCoalesce(_optionalChain([embed, 'access', _189 => _189.options, 'optionalAccess', _190 => _190.scaleRatio, 'optionalAccess', _191 => _191.y]), () => ( 1))))),
                                  onFocus: (e) => {
                                    e.stopPropagation();
                                    setScaleRatioYText(e.target.value);
                                  },
                                  onChange: (e) => {
                                    e.stopPropagation();
                                    setScaleRatioYText(e.target.value);
                                  },
                                  onBlur: (e) => {
                                    e.stopPropagation();
                                    const prevX = _nullishCoalesce(_optionalChain([embed, 'access', _192 => _192.options, 'optionalAccess', _193 => _193.scaleRatio, 'optionalAccess', _194 => _194.x]), () => ( 1));
                                    const prevY = _nullishCoalesce(_optionalChain([embed, 'access', _195 => _195.options, 'optionalAccess', _196 => _196.scaleRatio, 'optionalAccess', _197 => _197.y]), () => ( 1));
                                    const y = parsePositiveDecimalCommit(e.target.value, prevY);
                                    setScaleRatioYText(null);
                                    setEmbed(
                                      (p) => _chunkJJSHIBONjs.withAutoDisplaySize.call(void 0, 
                                        {
                                          ...p,
                                          options: {
                                            ...p.options,
                                            stretchToFit: false,
                                            scaleRatio: { x: prevX, y }
                                          }
                                        },
                                        previewViewport
                                      )
                                    );
                                  },
                                  onKeyDown: (e) => {
                                    if (e.key === "Enter") e.target.blur();
                                  },
                                  onClick: (e) => e.stopPropagation(),
                                  sx: { width: 68 }
                                }
                              )
                            ] })
                          ]
                        }
                      )
                    ]
                  }
                ),
                /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _Stack2.default, { direction: "row", spacing: 1, alignItems: "center", flexWrap: "wrap", sx: { mt: 1.5 }, children: [
                  /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _Typography2.default, { variant: "body2", color: "text.secondary", children: "Graph size" }),
                  /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                    _TextField2.default,
                    {
                      label: "W",
                      type: "text",
                      inputMode: "numeric",
                      size: "small",
                      value: _nullishCoalesce(graphWText, () => ( String(previewDisplaySize.width))),
                      disabled: embed.autoDisplaySize !== false,
                      onFocus: (e) => setGraphWText(e.target.value),
                      onChange: (e) => setGraphWText(e.target.value),
                      onBlur: (e) => {
                        const n = parseGraphPixelCommit(e.target.value);
                        setGraphWText(null);
                        if (n === void 0) return;
                        const w = Math.min(
                          _chunkJJSHIBONjs.GRAPH_DISPLAY_MAX_WIDTH,
                          Math.max(_chunkJJSHIBONjs.GRAPH_DISPLAY_MIN_WIDTH, n)
                        );
                        const h = Math.min(
                          _chunkJJSHIBONjs.GRAPH_DISPLAY_MAX_HEIGHT,
                          Math.max(_chunkJJSHIBONjs.GRAPH_DISPLAY_MIN_HEIGHT, Math.round(w / Math.max(1e-4, previewAspect)))
                        );
                        setEmbed((prev) => ({
                          ...prev,
                          autoDisplaySize: false,
                          displayWidth: w,
                          displayHeight: h
                        }));
                      },
                      onKeyDown: (e) => {
                        if (e.key !== "Enter") return;
                        e.target.blur();
                      },
                      sx: { width: 100 }
                    }
                  ),
                  /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _Typography2.default, { variant: "body2", color: "text.secondary", children: "\xD7" }),
                  /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                    _TextField2.default,
                    {
                      label: "H",
                      type: "text",
                      inputMode: "numeric",
                      size: "small",
                      value: _nullishCoalesce(graphHText, () => ( String(previewDisplaySize.height))),
                      disabled: embed.autoDisplaySize !== false,
                      onFocus: (e) => setGraphHText(e.target.value),
                      onChange: (e) => setGraphHText(e.target.value),
                      onBlur: (e) => {
                        const n = parseGraphPixelCommit(e.target.value);
                        setGraphHText(null);
                        if (n === void 0) return;
                        const h = Math.min(
                          _chunkJJSHIBONjs.GRAPH_DISPLAY_MAX_HEIGHT,
                          Math.max(_chunkJJSHIBONjs.GRAPH_DISPLAY_MIN_HEIGHT, n)
                        );
                        const w = Math.min(
                          _chunkJJSHIBONjs.GRAPH_DISPLAY_MAX_WIDTH,
                          Math.max(_chunkJJSHIBONjs.GRAPH_DISPLAY_MIN_WIDTH, Math.round(h * previewAspect))
                        );
                        setEmbed((prev) => ({
                          ...prev,
                          autoDisplaySize: false,
                          displayHeight: h,
                          displayWidth: w
                        }));
                      },
                      onKeyDown: (e) => {
                        if (e.key !== "Enter") return;
                        e.target.blur();
                      },
                      sx: { width: 100 }
                    }
                  ),
                  /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _Typography2.default, { variant: "caption", color: "text.secondary", children: "px" })
                ] }),
                /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _Typography2.default, { variant: "caption", color: "text.secondary", display: "block", sx: { mt: 0.5 }, children: "Click the bottom or left edge of the graph to edit axis names." })
              ]
            }
          ),
          /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _Stack2.default, { spacing: 2.5, sx: { flex: 1, minWidth: 0 }, children: [
            /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _Typography2.default, { variant: "h6", component: "h2", children: "Graph settings" }),
            viewSection,
            sectionTitle("Objects"),
            /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
              _Tabs2.default,
              {
                value: objectsTab,
                onChange: (_, v) => setObjectsTab(v),
                variant: "scrollable",
                scrollButtons: "auto",
                sx: { borderBottom: 1, borderColor: "divider" },
                children: [
                  /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _Tab2.default, { label: "Equations" }),
                  /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _Tab2.default, { label: "Variables" }),
                  /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _Tab2.default, { label: "Points & lines" }),
                  /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _Tab2.default, { label: "Labels" })
                ]
              }
            ),
            /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
              _Box2.default,
              {
                sx: {
                  minHeight: 240,
                  maxHeight: "min(55vh, 520px)",
                  overflow: "auto",
                  pr: 0.5
                },
                children: [
                  objectsTab === 0 && equationsPanel,
                  objectsTab === 1 && slidersPanel,
                  objectsTab === 2 && geometryPanel,
                  objectsTab === 3 && labelsPanel
                ]
              }
            )
          ] })
        ]
      }
    ) }),
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
      _Popover2.default,
      {
        open: Boolean(axisPopover),
        anchorEl: _nullishCoalesce(_optionalChain([axisPopover, 'optionalAccess', _198 => _198.anchor]), () => ( null)),
        onClose: () => setAxisPopover(null),
        anchorOrigin: { vertical: "top", horizontal: "center" },
        transformOrigin: { vertical: "bottom", horizontal: "center" },
        children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _Paper2.default, { sx: { p: 2, width: 280 }, children: [
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _Typography2.default, { variant: "subtitle2", gutterBottom: true, children: _optionalChain([axisPopover, 'optionalAccess', _199 => _199.axis]) === "x" ? "Horizontal axis label" : "Vertical axis label" }),
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
            _TextField2.default,
            {
              size: "small",
              fullWidth: true,
              autoFocus: true,
              value: axisDraft,
              onChange: (e) => setAxisDraft(e.target.value),
              onKeyDown: (e) => {
                if (e.key !== "Enter") return;
                if (!axisPopover) return;
                const def = axisPopover.axis === "x" ? "x" : "y";
                const v = axisDraft.trim();
                setEmbed((prev) => ({
                  ...prev,
                  options: {
                    ...prev.options,
                    [axisPopover.axis === "x" ? "xAxisLabel" : "yAxisLabel"]: v === "" || v === def ? void 0 : v
                  }
                }));
                setAxisPopover(null);
              }
            }
          ),
          /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _Stack2.default, { direction: "row", justifyContent: "flex-end", spacing: 1, sx: { mt: 1.5 }, children: [
            /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _Button2.default, { size: "small", onClick: () => setAxisPopover(null), children: "Cancel" }),
            /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
              _Button2.default,
              {
                size: "small",
                variant: "contained",
                onClick: () => {
                  if (!axisPopover) return;
                  const def = axisPopover.axis === "x" ? "x" : "y";
                  const v = axisDraft.trim();
                  setEmbed((prev) => ({
                    ...prev,
                    options: {
                      ...prev.options,
                      [axisPopover.axis === "x" ? "xAxisLabel" : "yAxisLabel"]: v === "" || v === def ? void 0 : v
                    }
                  }));
                  setAxisPopover(null);
                },
                children: "OK"
              }
            )
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _DialogActions2.default, { children: [
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _Button2.default, { onClick: onClose, children: "Cancel" }),
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _Button2.default, { variant: "contained", onClick: handleSave, children: "Save" })
    ] })
  ] });
};
var GraphEmbedDialog_default = GraphEmbedDialog;

// src/utils/graphIds.ts
function createGraphEmbedId() {
  const suffix = Math.random().toString(36).slice(2, 10);
  return `graph_${Date.now().toString(36)}_${suffix}`;
}

// src/hooks/useGraphEmbedEditor.ts

var defaultGraphEmbed = () => ({
  type: "graph",
  renderer: "jsxgraph",
  mode: "display",
  viewport: { xMin: -10, xMax: 10, yMin: -10, yMax: 10 },
  options: {
    showAxes: true,
    showGrid: true,
    gridStep: 1,
    showLabels: true,
    scaleRatio: { x: 1, y: 1 },
    snapToGrid: false
  },
  autoDisplaySize: true,
  expressions: [],
  objects: []
});
function useGraphEmbedEditor({
  editor,
  embeds,
  onEmbedsChange,
  enabled = true
}) {
  const embedsRef = _react.useRef.call(void 0, embeds);
  embedsRef.current = embeds;
  const [dialog, setDialog] = _react.useState.call(void 0, { open: false });
  const getEmbeds = _react.useCallback.call(void 0, () => embedsRef.current, []);
  const patchEmbeds = _react.useCallback.call(void 0, 
    (embedId, embed) => {
      const next = _chunkJJSHIBONjs.upsertGraphEmbed.call(void 0, _nullishCoalesce(embedsRef.current, () => ( {})), embedId, embed);
      embedsRef.current = next;
      _optionalChain([onEmbedsChange, 'optionalCall', _200 => _200(next)]);
      return next;
    },
    [onEmbedsChange]
  );
  const openGraphEditor = _react.useCallback.call(void 0, 
    (request) => {
      if (!enabled || !onEmbedsChange) return;
      if (request.mode === "insert") {
        setDialog({
          open: true,
          mode: "insert",
          embedId: createGraphEmbedId(),
          initialEmbed: _chunkJJSHIBONjs.withAutoDisplaySize.call(void 0, defaultGraphEmbed())
        });
        return;
      }
      const existing = _chunkJJSHIBONjs.getGraphEmbed.call(void 0, embedsRef.current, request.embedId);
      setDialog({
        open: true,
        mode: "edit",
        embedId: request.embedId,
        initialEmbed: _nullishCoalesce(existing, () => ( defaultGraphEmbed())),
        editPos: request.pos
      });
    },
    [enabled, onEmbedsChange]
  );
  const closeDialog = _react.useCallback.call(void 0, () => setDialog({ open: false }), []);
  const handleDialogSave = _react.useCallback.call(void 0, 
    (embed) => {
      if (!dialog.open || !editor) return;
      const embedId = dialog.embedId;
      patchEmbeds(embedId, embed);
      if (dialog.mode === "insert") {
        editor.chain().focus().insertGraphEmbed(embedId).run();
      } else if (typeof dialog.editPos === "number") {
        editor.chain().focus().setNodeSelection(dialog.editPos).run();
      }
      editor.view.dispatch(editor.state.tr);
    },
    [dialog, editor, patchEmbeds]
  );
  const insertNewGraph = _react.useCallback.call(void 0, () => {
    openGraphEditor({ mode: "insert" });
  }, [openGraphEditor]);
  const resizeGraphEmbed = _react.useCallback.call(void 0, 
    (embedId, size) => {
      if (!enabled || !onEmbedsChange) return;
      const existing = _chunkJJSHIBONjs.getGraphEmbed.call(void 0, embedsRef.current, embedId);
      if (!existing) return;
      patchEmbeds(embedId, {
        ...existing,
        autoDisplaySize: false,
        displayWidth: size.width,
        displayHeight: size.height
      });
    },
    [enabled, onEmbedsChange, patchEmbeds]
  );
  return {
    graphEnabled: enabled && !!onEmbedsChange,
    getEmbeds,
    openGraphEditor,
    insertNewGraph,
    resizeGraphEmbed,
    dialog,
    closeDialog,
    handleDialogSave
  };
}

// src/extensions/GraphEmbed.ts

var MIN_GRAPH_WIDTH = 200;
var MAX_GRAPH_WIDTH = 960;
var MIN_GRAPH_HEIGHT = 120;
var MAX_GRAPH_HEIGHT = 800;
function applyGraphNodeLayout(dom, body, embed) {
  const { width, height } = embed ? _chunkJJSHIBONjs.resolveGraphDisplaySize.call(void 0, embed) : { width: 400, height: 400 };
  dom.style.display = "inline-block";
  dom.style.verticalAlign = "top";
  dom.style.maxWidth = "100%";
  dom.style.width = `${width}px`;
  body.style.width = "100%";
  body.style.height = `${height}px`;
  body.style.boxSizing = "border-box";
}
var GraphEmbedNode = _core.Node.create({
  name: "graphEmbed",
  group: "inline",
  inline: true,
  atom: true,
  selectable: true,
  addOptions() {
    return {
      getEmbeds: () => void 0,
      onOpenEditor: () => {
      },
      onResizeEmbed: void 0,
      allowResize: true
    };
  },
  addAttributes() {
    return {
      embedId: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-embed-id"),
        renderHTML: (attributes) => {
          if (!attributes.embedId) return {};
          return { "data-embed-id": attributes.embedId };
        }
      }
    };
  },
  parseHTML() {
    return [
      {
        tag: 'motionless[data-type="graph"]',
        getAttrs: (element) => {
          if (typeof element === "string") return false;
          const id = element.getAttribute("data-embed-id");
          return id ? { embedId: id } : false;
        }
      },
      {
        tag: 'motion[data-type="graph"]',
        getAttrs: (element) => {
          if (typeof element === "string") return false;
          const id = element.getAttribute("data-embed-id");
          return id ? { embedId: id } : false;
        }
      },
      {
        tag: 'div[data-type="graph"]',
        getAttrs: (element) => {
          if (typeof element === "string") return false;
          const id = element.getAttribute("data-embed-id");
          return id ? { embedId: id } : false;
        }
      }
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      _core.mergeAttributes.call(void 0, HTMLAttributes, {
        "data-type": "graph",
        class: "graph-embed-node"
      })
    ];
  },
  addCommands() {
    return {
      insertGraphEmbed: (embedId) => ({ commands }) => commands.insertContent({
        type: this.name,
        attrs: { embedId }
      })
    };
  },
  addNodeView() {
    const { getEmbeds, onOpenEditor, onResizeEmbed, allowResize } = this.options;
    return ({ node, getPos, editor }) => {
      const dom = document.createElement("div");
      dom.className = "graph-embed-node";
      dom.dataset.type = "graph";
      dom.contentEditable = "false";
      const header = document.createElement("div");
      header.className = "graph-embed-node__header";
      const label = document.createElement("span");
      label.className = "graph-embed-node__label";
      const editBtn = document.createElement("button");
      editBtn.type = "button";
      editBtn.className = "graph-embed-node__edit";
      editBtn.textContent = "Edit graph";
      header.appendChild(label);
      header.appendChild(editBtn);
      const body = document.createElement("div");
      body.className = "graph-embed-node__body";
      const mount = document.createElement("div");
      mount.className = "graph-embed-node__mount";
      mount.dataset.graphPreviewMount = "true";
      body.appendChild(mount);
      let resizeHandle = null;
      if (allowResize !== false && onResizeEmbed) {
        resizeHandle = document.createElement("div");
        resizeHandle.className = "graph-embed-node__resize-handle";
        resizeHandle.title = "Drag to resize graph";
        resizeHandle.setAttribute("aria-label", "Resize graph");
        body.appendChild(resizeHandle);
      }
      dom.appendChild(header);
      dom.appendChild(body);
      const openEditor = () => {
        const embedId = node.attrs.embedId;
        let pos = getPos();
        if (typeof pos !== "number") {
          editor.state.doc.descendants((n, p) => {
            if (n.type.name === "graphEmbed" && n.attrs.embedId === embedId) {
              pos = p;
              return false;
            }
          });
        }
        onOpenEditor({
          mode: "edit",
          embedId,
          pos: typeof pos === "number" ? pos : void 0
        });
      };
      const syncNode = (updatedNode) => {
        node = updatedNode;
        const embedId = node.attrs.embedId;
        dom.dataset.embedId = embedId;
        mount.dataset.graphEmbedId = embedId;
        const embed = _chunkJJSHIBONjs.getGraphEmbed.call(void 0, getEmbeds(), embedId);
        dom.classList.toggle("graph-embed-node--missing", !embed);
        if (embed) {
          label.textContent = `Graph (${_chunkJJSHIBONjs.graphModeLabel.call(void 0, embed)})`;
        } else {
          label.textContent = "Graph (missing definition)";
        }
        applyGraphNodeLayout(dom, body, embed);
      };
      syncNode(node);
      if (resizeHandle && onResizeEmbed) {
        resizeHandle.addEventListener("mousedown", (event) => {
          event.preventDefault();
          event.stopPropagation();
          const embedId = node.attrs.embedId;
          const startX = event.clientX;
          const startY = event.clientY;
          const startW = body.offsetWidth;
          const startH = body.offsetHeight;
          const onMove = (moveEvent) => {
            const width = Math.min(
              MAX_GRAPH_WIDTH,
              Math.max(MIN_GRAPH_WIDTH, startW + moveEvent.clientX - startX)
            );
            const height = Math.min(
              MAX_GRAPH_HEIGHT,
              Math.max(MIN_GRAPH_HEIGHT, startH + moveEvent.clientY - startY)
            );
            dom.style.width = `${width}px`;
            body.style.width = "100%";
            body.style.height = `${height}px`;
          };
          const onUp = (upEvent) => {
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("mouseup", onUp);
            const width = Math.min(
              MAX_GRAPH_WIDTH,
              Math.max(MIN_GRAPH_WIDTH, startW + upEvent.clientX - startX)
            );
            const height = Math.min(
              MAX_GRAPH_HEIGHT,
              Math.max(MIN_GRAPH_HEIGHT, startH + upEvent.clientY - startY)
            );
            onResizeEmbed(embedId, { width, height });
          };
          window.addEventListener("mousemove", onMove);
          window.addEventListener("mouseup", onUp);
        });
      }
      editBtn.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        openEditor();
      });
      header.addEventListener("click", (event) => {
        if (event.target === editBtn) return;
        openEditor();
      });
      return {
        dom,
        update(updatedNode) {
          if (updatedNode.type.name !== "graphEmbed") return false;
          syncNode(updatedNode);
          return true;
        },
        ignoreMutation(mutation) {
          const target = mutation.target;
          if (!(target instanceof HTMLElement)) return false;
          return body.contains(target);
        }
      };
    };
  }
});






































































exports.CHEM_STRUCTURE_ALLOWED_ATTR = _chunkJJSHIBONjs.CHEM_STRUCTURE_ALLOWED_ATTR; exports.CHEM_STRUCTURE_ALLOWED_TAGS = _chunkJJSHIBONjs.CHEM_STRUCTURE_ALLOWED_TAGS; exports.ChemStructure = ChemStructure; exports.ChemStructureDialog = ChemStructureDialogLazy_default; exports.EquationInsertPanel = EquationInsertPanel; exports.ExplanationEditor = ExplanationEditor; exports.GRAPH_DISPLAY_BASE_WIDTH = _chunkJJSHIBONjs.GRAPH_DISPLAY_BASE_WIDTH; exports.GRAPH_DISPLAY_MAX_HEIGHT = _chunkJJSHIBONjs.GRAPH_DISPLAY_MAX_HEIGHT; exports.GRAPH_DISPLAY_MAX_WIDTH = _chunkJJSHIBONjs.GRAPH_DISPLAY_MAX_WIDTH; exports.GRAPH_DISPLAY_MIN_HEIGHT = _chunkJJSHIBONjs.GRAPH_DISPLAY_MIN_HEIGHT; exports.GRAPH_DISPLAY_MIN_WIDTH = _chunkJJSHIBONjs.GRAPH_DISPLAY_MIN_WIDTH; exports.GraphAnswerInput = _chunkJJSHIBONjs.GraphAnswerInput_default; exports.GraphEmbedDialog = GraphEmbedDialog_default; exports.GraphEmbedNode = GraphEmbedNode; exports.GraphPreview = _chunkJJSHIBONjs.GraphPreview_default; exports.GraphRenderer = _chunkJJSHIBONjs.GraphRenderer_default; exports.InlineMathWithMathLive = InlineMathWithMathLive; exports.InlineMathWithParens = InlineMathWithParens; exports.MathLiveEditor = MathLiveEditor_default; exports.MathPreview = _chunkJJSHIBONjs.MathPreview_default; exports.MathematicsWithInlineEdit = MathematicsWithInlineEdit; exports.MenuBar = MenuBar_default; exports.OverleafPaste = OverleafPaste; exports.RichTextWithMath = _chunkJJSHIBONjs.RichTextWithMath; exports.SmartMathPaste = SmartMathPaste; exports.TextStyleFontSize = TextStyleFontSize; exports.TiptapEditor = TiptapEditor_default; exports.chemAwareSanitizeConfig = _chunkJJSHIBONjs.chemAwareSanitizeConfig; exports.collectChemStructureIds = _chunkJJSHIBONjs.collectChemStructureIds; exports.collectGraphEmbedIds = _chunkJJSHIBONjs.collectGraphEmbedIds; exports.computeGraphDisplaySize = _chunkJJSHIBONjs.computeGraphDisplaySize; exports.createChemStructureId = createChemStructureId; exports.createGraphEmbedId = createGraphEmbedId; exports.denormalizeTeachingDiagramKetForEditing = _chunkIZE4D3JYjs.denormalizeTeachingDiagramKetForEditing; exports.extractGraphVariableNamesFromLatex = extractGraphVariableNamesFromLatex; exports.findUndefinedGraphVariables = findUndefinedGraphVariables; exports.formatGraphOriginLabelLatex = _chunkJJSHIBONjs.formatGraphOriginLabelLatex; exports.getChemStructureEmbed = _chunkJJSHIBONjs.getChemStructureEmbed; exports.getGraphEmbed = _chunkJJSHIBONjs.getGraphEmbed; exports.graphHasSliders = _chunkJJSHIBONjs.graphHasSliders; exports.graphModeLabel = _chunkJJSHIBONjs.graphModeLabel; exports.graphPreviewKey = _chunkJJSHIBONjs.graphPreviewKey; exports.handleMathBackspaceKeyDown = handleMathBackspaceKeyDown; exports.hydrateChemStructuresInHtml = _chunkJJSHIBONjs.hydrateChemStructuresInHtml; exports.hydrateGraphsInHtml = _chunkJJSHIBONjs.hydrateGraphsInHtml; exports.isDisplayInteractive = _chunkJJSHIBONjs.isDisplayInteractive; exports.mountGraphPreviewsInElement = _chunkJJSHIBONjs.mountGraphPreviewsInElement; exports.namespaceChemPreviewSvg = _chunkJJSHIBONjs.namespaceChemPreviewSvg; exports.normalizeChemStructureSource = _chunkIZE4D3JYjs.normalizeChemStructureSource; exports.normalizeGraphMode = _chunkJJSHIBONjs.normalizeGraphMode; exports.normalizeStructurePreviewKet = _chunkIZE4D3JYjs.normalizeStructurePreviewKet; exports.normalizeTeachingDiagramKet = _chunkIZE4D3JYjs.normalizeTeachingDiagramKet; exports.normalizeViewport = _chunkJJSHIBONjs.normalizeViewport; exports.parseViewportField = _chunkJJSHIBONjs.parseViewportField; exports.prepareChemAwareHtml = _chunkJJSHIBONjs.prepareChemAwareHtml; exports.pruneUnusedChemStructures = _chunkJJSHIBONjs.pruneUnusedChemStructures; exports.pruneUnusedGraphs = _chunkJJSHIBONjs.pruneUnusedGraphs; exports.removeChemStructure = _chunkJJSHIBONjs.removeChemStructure; exports.removeGraphEmbed = _chunkJJSHIBONjs.removeGraphEmbed; exports.renderTeachingDiagramSvg = _chunkIZE4D3JYjs.renderTeachingDiagramSvg; exports.resolveGraphDisplaySize = _chunkJJSHIBONjs.resolveGraphDisplaySize; exports.unmountGraphPreviewsInElement = _chunkJJSHIBONjs.unmountGraphPreviewsInElement; exports.upsertChemStructure = _chunkJJSHIBONjs.upsertChemStructure; exports.upsertGraphEmbed = _chunkJJSHIBONjs.upsertGraphEmbed; exports.useChemStructureEditor = useChemStructureEditor; exports.useGraphEmbedEditor = useGraphEmbedEditor; exports.viewportFieldsFromEmbed = _chunkJJSHIBONjs.viewportFieldsFromEmbed; exports.viewportFromFields = _chunkJJSHIBONjs.viewportFromFields; exports.withAutoDisplaySize = _chunkJJSHIBONjs.withAutoDisplaySize;
//# sourceMappingURL=index.js.map