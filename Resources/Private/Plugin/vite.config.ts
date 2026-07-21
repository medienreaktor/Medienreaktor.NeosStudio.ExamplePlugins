import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// A Studio plugin is a self-contained IIFE bundle with stable filenames (no
// hash) so the PHP side can reference it from Settings.yaml. React and the
// Studio plugin API are NOT bundled - they are marked external and resolve to
// the globals the shell publishes on `window` (see the shell's plugin-api).
// This is what guarantees the plugin renders with the shell's single React
// instance and registers into the shell's real registry singletons.
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../../Public/Plugin',
    emptyOutDir: true,
    lib: {
      entry: fileURLToPath(new URL('./src/main.tsx', import.meta.url)),
      name: 'NeosStudioExamplePlugins',
      formats: ['iife'],
      fileName: () => 'plugin.js',
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        '@medienreaktor/neos-studio',
      ],
      output: {
        // Map each external import to the global the shell installs.
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'ReactJSXRuntime',
          '@medienreaktor/neos-studio': 'NeosStudio',
        },
        // Emit the bundled CSS as a stable `plugin.css` next to `plugin.js`.
        assetFileNames: 'plugin.[ext]',
      },
    },
  },
})
