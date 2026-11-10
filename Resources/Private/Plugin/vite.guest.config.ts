import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'

// The guest bundle: Studio loads it into the edit-mode preview frame (the
// plugin entry's `guestJavascript` in Settings.yaml), where inline editing
// runs a TipTap of its own. Built like plugin.js - an IIFE with the plugin
// API external - but there `window.NeosStudio` is the preview's reduced API
// (version, richTextExtensions, tiptap). Runs after the main build, so it
// must not empty the output directory.
export default defineConfig({
  build: {
    outDir: '../../Public/Plugin',
    emptyOutDir: false,
    lib: {
      entry: fileURLToPath(new URL('./src/guest.ts', import.meta.url)),
      name: 'NeosStudioExamplePluginsGuest',
      formats: ['iife'],
      fileName: () => 'guest.js',
    },
    rollupOptions: {
      external: ['@medienreaktor/neos-studio'],
      output: {
        globals: { '@medienreaktor/neos-studio': 'NeosStudio' },
      },
    },
  },
})
