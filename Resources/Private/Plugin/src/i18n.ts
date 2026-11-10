import { translate, type TranslateArgs } from '@medienreaktor/neos-studio'

/**
 * This package's labels, from its own XLIFF files
 * (Resources/Private/Translations/<locale>/Main.xlf). They reach the browser
 * with Studio's own because Configuration/Settings.yaml adds the package to
 * `Neos.Neos.userInterface.translation.autoInclude`. The fallback is the
 * English text, shown for a missing label - and before the labels have
 * loaded, which is why labels handed to a registry are functions (`() =>
 * t(...)`): they are translated when shown, not when this plugin registers.
 */
export function t(id: string, fallback: string, args?: TranslateArgs): string {
  return translate(
    `Medienreaktor.NeosStudio.ExamplePlugins:Main:${id}`,
    fallback,
    args,
  )
}
