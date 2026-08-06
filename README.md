# Medienreaktor.NeosStudio.ExamplePlugins

A boilerplate for extending **Neos Studio** from a separate package. It
registers two things into the running shell:

- an **Example panel** (docked in the right/secondary region) that reads live
  app state through `useStudio()`,
- an **Example inspector editor** — a colour picker — usable by any node type
  property via `editor: 'Medienreaktor.NeosStudio.ExamplePlugins/Editors/Example'`, and
- an **Example node decorator** that badges recently edited nodes with a clock
  overlay in every tree (node decorators can also replace the type icon or
  tint/dim a whole row — the shell's hidden/deleted marks use the same
  registry).

Copy this package, rename it, and replace the example panel/editor with your
own.

## How it works

The Studio shell (`Medienreaktor.NeosStudio`) is a single bundle whose
registries (`panels`, `editors`, …) are module-level singletons. A plugin
cannot `import` them directly — it would get its own empty copies and its own
React, whose hooks and context would not line up with the shell's. So:

1. **The shell publishes its API on `window`.** Its entry module calls
   `installPluginApiGlobals()`, which puts `React`, `ReactDOM`,
   `react/jsx-runtime` and the plugin API (`window.NeosStudio`) on the global
   object before it mounts.
2. **The plugin is built as an IIFE with those marked external.** See
   [`Resources/Private/Plugin/vite.config.ts`](Resources/Private/Plugin/vite.config.ts):
   `react`, `react-dom`, `react/jsx-runtime` and `@medienreaktor/neos-studio`
   resolve to the shell's globals at runtime. The plugin therefore renders with
   the shell's single React instance and registers into the shell's real
   registries. Types for `@medienreaktor/neos-studio` come from the package of
   the same name (a `file:` dependency in `package.json`), whose `index.d.ts`
   is generated from the shell's own plugin-API source — so the types you code
   against are always the shell's real types, never a hand-copied subset.
3. **The shell injects the bundle.** `StudioController` reads the
   `Medienreaktor.NeosStudio.plugins` setting (see
   [`Configuration/Settings.yaml`](Configuration/Settings.yaml)) and injects the
   built `plugin.js` / `plugin.css` into the served SPA as a deferred
   `type="module"` tag *after* the shell's own module — so the shell installs
   its globals and mounts first, then the plugin registers. Registries are
   observable, so late registration just triggers a re-render.

`Medienreaktor.NeosStudio` must be installed; the plugin is purely additive.

## Building

```bash
cd Resources/Private/Plugin
npm install
npm run build        # emits Resources/Public/Plugin/{plugin.js,plugin.css}
```

Then flush Flow caches (so the new Settings/NodeTypes are picked up) and reload
`/neos/studio`. Use `npm run dev` to rebuild on change while developing.

## Layout

| Path | What |
| --- | --- |
| `Resources/Private/Plugin/src/main.tsx` | Entry point — registers the panel and editor |
| `Resources/Private/Plugin/src/ExamplePanel.tsx` | The panel component |
| `Resources/Private/Plugin/src/ExampleEditor.tsx` | The property editor |
| `Configuration/Settings.yaml` | Registers the bundle with the shell |
| `Configuration/NodeTypes.ExamplePlugin.yaml` | Demo property wiring the editor to `Neos.Demo:Content.Text` |

## License

This package is free software, released under the [GNU General Public License, version 3 or later](LICENSE).

Copyright (C) 2026 medienreaktor GmbH
