# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.0.1] - 2026-11-10

### Added

- A node action example: "Copy node ID" in the node context menus and the
  documents toolbar, through Studio's `nodeActions` registry.
- A rich text extension example: a highlight mark with a toolbar button,
  enabled on the Neos.Demo text element, in the inspector and - through a
  second bundle, `guest.js`, loaded into the preview frame - inline editing.
- The panel loads data with `useQuery` on Studio's own query cache and shows
  the last saved property through the `useStudioEvent` hook.
- The plugin's labels are translated (English, German) from the package's
  own XLIFF files, which `Settings.yaml` adds to Neos' translation bundle.

### Changed

- Requires Neos Studio 2.0.5.
- `npm run bundle` builds both bundles; CI runs it.

## [2.0.0] - 2026-11-10

Targets Neos Studio 2 and its plugin API version 2.

### Added

- **The examples use Studio's UI components.** The panel's button is Studio's
  `Button`, the colour editor's text field Studio's `Input`, imported from
  `@medienreaktor/neos-studio` like the registries - the README's "UI and
  styling" explains when to use a component and when the plugin's own CSS.
- The plugin checks the plugin API version and only registers on version 2,
  logging a warning otherwise.
- A keyboard shortcut example: `mod+shift+e` shows a greeting toast, through
  Studio's `shortcuts` registry.
- A node decorator example: a clock badge on nodes edited in the last 24
  hours, through Studio's `nodeDecorators` registry.

### Changed

- **Requires Neos Studio 2.0.3**, the first release with the UI components
  in the plugin API, and so PHP 8.4 and Neos 9.2. Plugin API version 2 means
  Neos.Api's `Node`, `Workspace`, ... models and `NodeAddress` objects.
- **The examples take Neos Studio's design tokens.** Their CSS read Studio's
  old dark palette and looked wrong in the light theme; it now uses the custom
  properties Studio publishes for plugins (`var(--color-foreground)`,
  `var(--text-body)`, `var(--radius-md)`, `var(--spacing)`) and follows the
  theme, with sizes on Studio's 16px spacing scale. The node decorator's badge
  uses the public `--color-primary-text` instead of an internal palette shade.
- The plugin is typed against the declarations Studio ships in
  `Resources/Public/Studio/types/index.d.ts`, mapped in `tsconfig.json`,
  instead of the former `StudioApi` package. They are self-contained apart
  from React, so the plugin only needs `@types/react`.
- The Composer package leaves out the CI configuration.

### Removed

- The plugin's hand-made button and input styles (`.nsx-button`,
  `.nsx-input`); Studio's components replace them.

## [1.0.1] - 2026-07-21

### Changed

- No changes; the tag points to the same commit as 1.0.

## [1.0] - 2026-07-21

### Added

- **A boilerplate for Neos Studio plugins**: an example panel and an example
  inspector property editor, registered into the Studio shell from a separate
  package. The bundle is built as an IIFE with `react` and
  `@medienreaktor/neos-studio` external, resolved from the shell's window
  globals at runtime, and registered through the
  `Medienreaktor.NeosStudio.plugins` setting.
- The GPL-3.0 license, and Composer constraints and a branch alias for the
  sibling packages.

[Unreleased]: https://github.com/medienreaktor/Medienreaktor.NeosStudio.ExamplePlugins/compare/2.0.1...HEAD
[2.0.1]: https://github.com/medienreaktor/Medienreaktor.NeosStudio.ExamplePlugins/compare/2.0.0...2.0.1
[2.0.0]: https://github.com/medienreaktor/Medienreaktor.NeosStudio.ExamplePlugins/compare/1.0.1...2.0.0
[1.0.1]: https://github.com/medienreaktor/Medienreaktor.NeosStudio.ExamplePlugins/compare/1.0...1.0.1
[1.0]: https://github.com/medienreaktor/Medienreaktor.NeosStudio.ExamplePlugins/releases/tag/1.0
