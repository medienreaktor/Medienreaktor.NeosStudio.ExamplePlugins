# Medienreaktor.NeosStudio.ExamplePlugins

[![Packagist Version](https://img.shields.io/packagist/v/medienreaktor/neos-studio-example-plugins)](https://packagist.org/packages/medienreaktor/neos-studio-example-plugins)
[![PHP Version Support](https://img.shields.io/packagist/dependency-v/medienreaktor/neos-studio-example-plugins/php)](https://www.php.net/)
[![Test Status](https://github.com/medienreaktor/Medienreaktor.NeosStudio.ExamplePlugins/actions/workflows/ci.yml/badge.svg)](https://github.com/medienreaktor/Medienreaktor.NeosStudio.ExamplePlugins/actions/workflows/ci.yml)
[![License](https://img.shields.io/badge/license-GPL--3.0--or--later-blue.svg)](LICENSE)

A boilerplate for extending **Neos Studio** 2 (plugin API version 2) from a
separate package. It shows the plugin API's parts in the running shell:

- an **Example panel** (docked in the right/secondary region) that reads live
  app state through `useStudio()`, loads data with `useQuery` on the shell's
  own query cache, shows the last saved property through `useStudioEvent`,
  and raises a toast from the shell's own `Button`,
- an **Example inspector editor** — a colour picker with the shell's `Input` —
  usable by any node type property via
  `editor: 'Medienreaktor.NeosStudio.ExamplePlugins/Editors/Example'`
  ([`NodeTypes.ExamplePlugin.yaml`](Configuration/NodeTypes.ExamplePlugin.yaml)
  wires it to the Neos.Demo text element),
- an **Example node action**, "Copy node ID", in the context menus of the
  document tree, the content outliner and the preview, and in the documents
  toolbar's "…" menu,
- an **Example rich text extension**: a highlight mark (`<mark>`, or type
  `==text==`) with a toolbar button, enabled on the Neos.Demo text element in
  both the inspector and inline editing in the preview,
- an **Example keyboard shortcut** (`mod+shift+e`, listed in the shell's
  shortcut overview under Shift+?),
- an **Example node decorator** that badges recently edited nodes with a clock
  overlay in every tree (node decorators can also replace the type icon or
  tint/dim a whole row — the shell's hidden/deleted marks use the same
  registry), and
- **translated labels** from the package's own XLIFF files, in English and
  German.

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

`Medienreaktor.NeosStudio` 2.0.5 or newer must be installed (node actions,
events, shared queries, translations and rich text extensions came with
2.0.4, correct TipTap command types with 2.0.5); the plugin is purely
additive.

## Plugin API version

`version` from the plugin API is the shell's plugin API version; the shell
bumps it on a breaking change. This package is written against version 2 (the
Studio on Neos.Api: Neos.Api's `Node`, `Workspace`, ... models and
`NodeAddress` objects - see "Plugin API version 2" in the Studio's README) and
both bundles only register when the shell reports that version, logging a
warning otherwise (the guard is
[`apiVersion.ts`](Resources/Private/Plugin/src/apiVersion.ts)). Keep that guard in
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

## Translations

The plugin's labels live in
[`Resources/Private/Translations/<locale>/Main.xlf`](Resources/Private/Translations)
and are read with the plugin API's `translate` (wrapped as `t` in
[`i18n.ts`](Resources/Private/Plugin/src/i18n.ts), which prefixes the
package's `Medienreaktor.NeosStudio.ExamplePlugins:Main:` ids).
[`Settings.yaml`](Configuration/Settings.yaml) adds the package to
`Neos.Neos.userInterface.translation.autoInclude`, which puts the labels into
the translation bundle Studio loads. After adding that to an existing
installation, flush the bundle once:
`./flow flow:cache:flushone Neos_Neos_XliffToJsonTranslations`.

The plugin registers before the labels have loaded, so labels handed to a
registry are functions (`title: () => t('panel.title', 'Example')`), which
are translated when shown; the shortcut, whose title is a plain string,
registers after `translationsLoaded()`.

## Rich text in two windows

The highlight mark lives in
[`richText.ts`](Resources/Private/Plugin/src/richText.ts), built only with
the plugin API's `tiptap` building blocks. The inspector's rich text editor
runs in the shell, where `plugin.js` registers it. Inline editing runs inside
the preview frame with its own TipTap, so a second bundle, `guest.js` (entry
[`guest.ts`](Resources/Private/Plugin/src/guest.ts),
[`vite.guest.config.ts`](Resources/Private/Plugin/vite.guest.config.ts)),
registers the same module there; `Settings.yaml` lists it as the plugin's
`guestJavascript`. In the frame, `window.NeosStudio` offers only `version`,
`richTextExtensions` and `tiptap`, so `richText.ts` imports nothing else.
The node type enables it with `editorOptions.formatting.highlight: true`.

## Building

```bash
cd Resources/Private/Plugin
npm install
npm run build        # emits Resources/Public/Plugin/{plugin.js,plugin.css,guest.js}
```

Then flush Flow caches (so the new Settings/NodeTypes are picked up) and reload
`/neos/studio`. Use `npm run dev` to rebuild on change while developing.

`npm run build` type-checks before it bundles, against the declarations Studio
ships in `Resources/Public/Studio/types/index.d.ts` (since 2.0), mapped in
[`tsconfig.json`](Resources/Private/Plugin/tsconfig.json) to the Studio
package next to this one - so it needs Studio installed alongside, as in a
Neos distribution. `npm run bundle` builds both bundles without the type
check; CI runs that, as its frontend job has no Studio checkout. Outside a
distribution, install the types instead (`npm install -D
@medienreaktor/neos-studio@<Studio version>`, a types-only package published
with each Studio release) and drop the `paths` mapping.

Run `npm run format` before committing; CI checks the formatting.

## Layout

| Path | What |
| --- | --- |
| `Resources/Private/Plugin/src/main.tsx` | Entry point of `plugin.js` — checks the plugin API version, registers the panel, editor, node action, rich text extension, shortcut and node decorator |
| `Resources/Private/Plugin/src/guest.ts` | Entry point of `guest.js`, loaded into the preview frame — registers the rich text extension for inline editing |
| `Resources/Private/Plugin/src/ExamplePanel.tsx` | The panel component |
| `Resources/Private/Plugin/src/ExampleEditor.tsx` | The property editor |
| `Resources/Private/Plugin/src/nodeActions.ts` | The "Copy node ID" node action |
| `Resources/Private/Plugin/src/richText.ts` | The highlight mark and its toolbar button, shared by both bundles |
| `Resources/Private/Plugin/src/i18n.ts` | `t()`, the package's translated labels |
| `Resources/Private/Plugin/src/apiVersion.ts` | The plugin API version guard both bundles use |
| `Resources/Private/Translations/` | The package's labels (en, de) |
| `Resources/Private/Plugin/src/plugin.css` | Scoped styles on Studio's design tokens (`var(--color-card)`, `var(--text-body)`, …), so the plugin follows the theme |
| `Configuration/Settings.yaml` | Registers the bundles with the shell, adds the labels to the translation bundle |
| `Configuration/NodeTypes.ExamplePlugin.yaml` | Wires the editor and the highlight formatting to `Neos.Demo:Content.Text` |

## License

This package is free software, released under the [GNU General Public License, version 3 or later](LICENSE).

Copyright (C) 2026 medienreaktor GmbH
