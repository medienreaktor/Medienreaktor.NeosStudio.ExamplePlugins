import {
  version,
  panels,
  editors,
  shortcuts,
  nodeDecorators,
  toast,
} from '@medienreaktor/neos-studio'
import { ExamplePanel } from './ExamplePanel'
import { ExampleEditor } from './ExampleEditor'
import './plugin.css'

/**
 * Plugin entry point. The StudioController injects this bundle as a deferred
 * `type="module"` tag after the shell's own module, so by the time this runs
 * the shell has installed its globals, registered its built-ins and mounted.
 * The registries are observable, so registering now just triggers a re-render:
 * the panel docks and the editor becomes available wherever a node type
 * references its id.
 *
 * Namespace ids with your package key so they never collide with the shell's
 * or another plugin's.
 *
 * The shell bumps `version` on a breaking change of the plugin API. This
 * plugin is written against version 2, so it registers nothing on another
 * version: a missing panel and a console warning beat a crashing one.
 */
const SUPPORTED_API_VERSION = 2

if (version === SUPPORTED_API_VERSION) {
  register()
} else {
  console.warn(
    `Medienreaktor.NeosStudio.ExamplePlugins supports the Studio plugin API version ${SUPPORTED_API_VERSION}, the shell has ${String(version)} - not registering.`,
  )
}

function register() {
  panels.register({
    id: 'Medienreaktor.NeosStudio.ExamplePlugins:example',
    title: 'Example',
    component: ExamplePanel,
    defaultPlacement: { kind: 'dock', region: 'secondary' },
  })

  editors.register({
    id: 'Medienreaktor.NeosStudio.ExamplePlugins/Editors/Example',
    component: ExampleEditor,
  })

  /**
   * A keyboard shortcut. 'mod' is ⌘ on macOS and Ctrl elsewhere; the shortcut
   * appears automatically in the shell's shortcut overview (Shift+?). Module-level
   * registration suits always-available actions like this one - inside a
   * registered component, prefer the useKeyboardShortcut hook so the shortcut
   * unmounts with it.
   */
  shortcuts.register({
    id: 'Medienreaktor.NeosStudio.ExamplePlugins:hello',
    combo: 'mod+shift+e',
    title: 'Example plugin greeting',
    category: 'Example plugin',
    handler: () => {
      toast.info('Hello from the example plugin!')
    },
  })

  /**
   * A node decorator: every tree row (document tree, content outliner, search
   * results, pickers) runs the registered decorators against its node. A
   * decoration can replace the type icon, layer a small badge onto its corner,
   * or tint/dim the whole row - the shell's own type icon and hidden/deleted
   * marks come from the same registry (at order 0/10, so a plugin's decoration,
   * default order 100, wins where they overlap).
   *
   * This one badges nodes edited within the last 24 hours. Decorators run
   * during render for every visible row, so derive the decoration cheaply from
   * the node object (tags, properties, nodeType, timestamps).
   */
  nodeDecorators.register({
    id: 'Medienreaktor.NeosStudio.ExamplePlugins:recentlyChanged',
    decorate: (node) => {
      if (!node.timestamps.lastModified) return null
      const age = Date.now() - new Date(node.timestamps.lastModified).getTime()
      if (age > 24 * 60 * 60 * 1000) return null
      return {
        overlay: {
          icon: 'clock',
          // A public role colour (see the Studio's css-variables.json), so the
          // badge follows the theme; palette shades are internal.
          color: 'var(--color-primary-text)',
          label: 'Changed in the last 24 hours',
          position: 'top-right',
        },
      }
    },
  })
}
