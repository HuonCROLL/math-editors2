import type { MathfieldElement } from 'mathlive';
import type * as React from 'react';  // gives us the React types below

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      /** MathLive web-component                                               */
      'math-field': React.DetailedHTMLProps<
        React.HTMLAttributes<MathfieldElement>,
        MathfieldElement
      >;
    }
  }
}

export {};          // keep the file a module
