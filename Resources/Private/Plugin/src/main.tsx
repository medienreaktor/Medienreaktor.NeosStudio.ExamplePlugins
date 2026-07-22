import { panels, editors, shortcuts, toast } from '@medienreaktor/neos-studio'
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
 */
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
