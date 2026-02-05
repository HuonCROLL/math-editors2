import {TextStyle} from '@tiptap/extension-text-style'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    fontSize: {
      setFontSize: (fontSize: string) => ReturnType
      unsetFontSize: () => ReturnType
    }
  }
}

export const TextStyleFontSize = TextStyle.extend({
  // keep name as "textStyle" (inherited) so removeEmptyTextStyle works
  addAttributes() {
    return {
      ...(this.parent?.() ?? {}),
      fontSize: {
        default: null,

        // read inline style="font-size: 16px" -> "16px"
        parseHTML: (element) => {
          const size = element.style.fontSize
          return size && size.trim().length > 0 ? size : null
        },

        // write style="font-size: 16px"
        renderHTML: (attributes) => {
          const fontSize = attributes.fontSize as string | null | undefined
          if (!fontSize) return {}
          return { style: `font-size: ${fontSize}` }
        },
      },
    }
  },

  addCommands() {
    return {
      ...(this.parent?.() ?? {}),

      setFontSize:
        (fontSize: string) =>
        ({ commands }) => {
          // expects values like "16px", "1.25rem", etc.
          return commands.setMark(this.name, { fontSize })
        },

      unsetFontSize:
        () =>
        ({ chain }) => {
          return chain()
            .setMark(this.name, { fontSize: null })
            .removeEmptyTextStyle()
            .run()
        },
    }
  },
})
