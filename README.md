# Medienreaktor.NeosStudio.ExamplePlugins

[![Packagist Version](https://img.shields.io/packagist/v/medienreaktor/neos-studio-example-plugins)](https://packagist.org/packages/medienreaktor/neos-studio-example-plugins)
[![PHP Version Support](https://img.shields.io/packagist/dependency-v/medienreaktor/neos-studio-example-plugins/php)](https://www.php.net/)
[![Test Status](https://github.com/medienreaktor/Medienreaktor.NeosStudio.ExamplePlugins/actions/workflows/ci.yml/badge.svg)](https://github.com/medienreaktor/Medienreaktor.NeosStudio.ExamplePlugins/actions/workflows/ci.yml)
[![License](https://img.shields.io/badge/license-GPL--3.0--or--later-blue.svg)](LICENSE)

A boilerplate for extending **Neos Studio** 2 (plugin API version 2) from a
separate package. It registers four things into the running shell:

- an **Example panel** (docked in the right/secondary region) that reads live
  app state through `useStudio()` and raises a toast from the shell's own
  `Button`,
- an **Example inspector editor** — a colour picker with the shell's `Input` —
  usable by any node type property via
  `editor: 'Medienreaktor.NeosStudio.ExamplePlugins/Editors/Example'`
  ([`NodeTypes.ExamplePlugin.yaml`](Configuration/NodeTypes.ExamplePlugin.yaml)
  wires it to the Neos.Demo text element),
- an **Example keyboard shortcut** (`mod+shift+e`, listed in the shell's
  shortcut overview under Shift+?), and
- an **Example node decorator** that badges recently edited nodes with a clock
  overlay in every tree (node decorators can also replace the type icon or
  tint/dim a whole row — the shell's hidden/deleted marks use the same
  registry).

Copy this package, rename it, and replace the examples with your own.

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
   registries. Types for `@medienreaktor/neos-studio` come from the shell's
   `Resources/Public/Studio/types/index.d.ts`, mapped in
   [`tsconfig.json`](Resources/Private/Plugin/tsconfig.json) `paths` (with
   `react`/`react-dom` mapped to this plugin's `@types`, as that file lies
   outside it). It is generated from the shell's own plugin-API source on
   every shell build — so the types you code against are always the shell's
   real types, never a hand-copied subset.
3. **The shell injects the bundle.** `StudioController` reads the
   `Medienreaktor.NeosStudio.plugins` setting (see
   [`Configuration/Settings.yaml`](Configuration/Settings.yaml)) and injects the
   built `plugin.js` / `plugin.css` into the served SPA as a deferred
   `type="module"` tag *after* the shell's own module — so the shell installs
   its globals and mounts first, then the plugin registers. Registries are
   observable, so late registration just triggers a re-render.

`Medienreaktor.NeosStudio` 2.0.3 or newer must be installed (the UI
components came with it); the plugin is purely additive.

## Plugin API version

`version` from the plugin API is the shell's plugin API version; the shell
bumps it on a breaking change. This package is written against version 2 (the
Studio on Neos.Api: Neos.Api's `Node`, `Workspace`, ... models and
`NodeAddress` objects - see "Plugin API version 2" in the Studio's README) and
[`main.tsx`](Resources/Private/Plugin/src/main.tsx) only registers when the
shell reports that version, logging a warning otherwise. Keep that guard in
your copy and raise it when you port the plugin to a new version.

## UI and styling

Build plugin UI from the shell's components - `Button`, `Input`, `Select`,
`Dialog`, `DropdownMenu`, `Tooltip`, ... imported from
`@medienreaktor/neos-studio` like the registries. They are the shell's own
instances, so they look and behave like the built-in UI in both themes. Their
names and props are the contract, not their markup or class names.

Everything else - layout, and controls no component covers, like the colour
swatches here - is plain CSS in
[`plugin.css`](Resources/Private/Plugin/src/plugin.css). The shell's Tailwind
build does not see a plugin's markup, so do not rely on Tailwind utility
classes. Use the shell's public CSS variables (`--color-foreground`,
`--color-muted-foreground`, `--color-border`, `--radius-md`, `--text-body`,
`--font-mono`, `--spacing`, ...; the full list and the rules are under
"Styling plugins" in the Studio's README): they switch with the theme, so the
plugin follows light and dark mode without a rebuild. Prefix your class names
(`nsx-` here) and keep lengths in rem.

## Building

```bash
cd Resources/Private/Plugin
npm install
npm run build        # emits Resources/Public/Plugin/{plugin.js,plugin.css}
```

Then flush Flow caches (so the new Settings/NodeTypes are picked up) and reload
`/neos/studio`. Use `npm run dev` to rebuild on change while developing.

`npm run build` type-checks before it bundles, against the declarations Studio
ships in `Resources/Public/Studio/types/index.d.ts` (since 2.0), mapped in
[`tsconfig.json`](Resources/Private/Plugin/tsconfig.json) to the Studio
package next to this one - so it needs Studio installed alongside, as in a
Neos distribution. `npx vite build` bundles without the type check; CI runs
that, as its frontend job has no Studio checkout.

Run `npm run format` before committing; CI checks the formatting.

## Layout

| Path | What |
| --- | --- |
| `Resources/Private/Plugin/src/main.tsx` | Entry point — checks the plugin API version, registers the panel, editor, shortcut and node decorator |
| `Resources/Private/Plugin/src/ExamplePanel.tsx` | The panel component |
| `Resources/Private/Plugin/src/ExampleEditor.tsx` | The property editor |
| `Resources/Private/Plugin/src/plugin.css` | Scoped styles on Studio's design tokens (`var(--color-card)`, `var(--text-body)`, …), so the plugin follows the theme |
| `Configuration/Settings.yaml` | Registers the bundle with the shell |
| `Configuration/NodeTypes.ExamplePlugin.yaml` | Demo property wiring the editor to `Neos.Demo:Content.Text` |

## License

This package is free software, released under the [GNU General Public License, version 3 or later](LICENSE).

Copyright (C) 2026 medienreaktor GmbH
