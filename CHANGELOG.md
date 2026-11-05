# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- A keyboard shortcut example: `mod+shift+e` shows a greeting toast, through
  Studio's `shortcuts` registry.
- A node decorator example: a clock badge on nodes edited in the last 24
  hours, through Studio's `nodeDecorators` registry.

### Changed

- **The examples take Neos Studio's design tokens.** Their CSS read Studio's
  old dark palette and looked wrong in the light theme; it now uses the custom
  properties Studio publishes for plugins (`var(--color-card)`,
  `var(--text-body)`, `var(--radius-md)`, `var(--spacing)`) and follows the
  theme. The button and the input mirror Studio's own, with focus styles, and
  their sizes sit on Studio's 16px spacing scale.
- The plugin is typed against the declarations Studio generates into
  `Resources/Public/Studio/types/index.d.ts`, mapped in `tsconfig.json`,
  instead of the former `StudioApi` package.
- Requires Neos Studio 1.19.1.
- The Composer package leaves out the CI configuration.

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

[Unreleased]: https://github.com/medienreaktor/Medienreaktor.NeosStudio.ExamplePlugins/compare/1.0.1...HEAD
[1.0.1]: https://github.com/medienreaktor/Medienreaktor.NeosStudio.ExamplePlugins/compare/1.0...1.0.1
[1.0]: https://github.com/medienreaktor/Medienreaktor.NeosStudio.ExamplePlugins/releases/tag/1.0
