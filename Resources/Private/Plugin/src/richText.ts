import { richTextExtensions, tiptap } from '@medienreaktor/neos-studio'

/**
 * A rich text extension: a "highlight" mark (`<mark>`) with a toolbar button,
 * enabled on a property by `editorOptions.formatting.highlight: true` (see
 * Configuration/NodeTypes.ExamplePlugin.yaml).
 *
 * This module runs in two windows. plugin.js imports it in the shell, for the
 * inspector's rich text editor; guest.js imports it in the preview frame, for
 * inline editing, which runs a TipTap of its own there. In the frame,
 * `window.NeosStudio` offers only `version`, `richTextExtensions` and
 * `tiptap` - so this module imports nothing else from the plugin API (no
 * translate: its labels stay English). The TipTap building blocks always
 * come from the plugin API, never from a TipTap bundled into the plugin: a
 * second copy breaks the editor's schema and plugin identity.
 */
export function registerHighlight(): void {
  const { Mark, markInputRule, mergeAttributes } = tiptap

  const Highlight = Mark.create({
    name: 'highlight',
    // Neos stores the editor's HTML, so what renderHTML writes is what
    // parseHTML must read back the next time the property is edited.
    parseHTML: () => [{ tag: 'mark' }],
    renderHTML: ({ HTMLAttributes }) => [
      'mark',
      mergeAttributes(HTMLAttributes),
      0,
    ],
    // ==text== while typing
    addInputRules() {
      return [
        markInputRule({ find: /(?:^|\s)(==([^=]+)==)$/, type: this.type }),
      ]
    },
  })

  richTextExtensions.register({
    id: 'Medienreaktor.NeosStudio.ExamplePlugins:highlight',
    formatting: 'highlight',
    extensions: () => [Highlight],
    toolbar: [
      {
        id: 'highlight',
        label: 'Highlight',
        // The inspector shows the Font Awesome icon; the preview page has no
        // icon font, so its toolbar shows the svg.
        icon: 'highlighter',
        svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 11-6 6v3h9l3-3"/><path d="m22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4"/></svg>',
        isActive: (editor) => editor.isActive('highlight'),
        run: (editor) => editor.chain().focus().toggleMark('highlight').run(),
      },
    ],
  })
}
