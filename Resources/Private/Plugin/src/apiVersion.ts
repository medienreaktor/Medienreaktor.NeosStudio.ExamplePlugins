import { version } from '@medienreaktor/neos-studio'

/**
 * The plugin API version this package is written against. The shell bumps
 * `version` on a breaking change of the plugin API; on another one this
 * plugin registers nothing - a missing panel and a console warning beat a
 * crashing one. Both bundles (plugin.js in the shell, guest.js in the
 * preview) check it before registering.
 */
const SUPPORTED_API_VERSION = 2

export function supportedApiVersion(bundle: string): boolean {
  if (version === SUPPORTED_API_VERSION) return true
  console.warn(
    `Medienreaktor.NeosStudio.ExamplePlugins (${bundle}) supports the Studio plugin API version ${SUPPORTED_API_VERSION}, the shell has ${String(version)} - not registering.`,
  )
  return false
}
