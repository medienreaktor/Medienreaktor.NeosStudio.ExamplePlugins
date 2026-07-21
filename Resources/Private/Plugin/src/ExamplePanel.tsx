import { useStudio, toast } from '@medienreaktor/neos-studio'

/**
 * A panel is a prop-less component: it reads everything it needs from
 * `useStudio()` - the same hook (and the same React) the shell's own panels
 * use, because at runtime this bundle resolves `react` and the plugin API to
 * the shell's globals. Register it (see main.tsx) and the shell docks it like
 * any built-in panel.
 */
export function ExamplePanel() {
  const studio = useStudio()
  const node = studio.inspectedNode

  return (
    <div className="nsx-panel">
      <p className="nsx-panel__lead">
        This panel ships from <code>Medienreaktor.NeosStudio.ExamplePlugins</code>,
        a package separate from the Studio shell. It reads live app state through{' '}
        <code>useStudio()</code>.
      </p>

      <dl className="nsx-facts">
        <dt>Workspace</dt>
        <dd>{studio.workspaceName ?? '–'}</dd>
        <dt>Selected document</dt>
        <dd>{studio.selectedDocument?.label ?? '–'}</dd>
        <dt>Inspected node</dt>
        <dd>{node?.label ?? '–'}</dd>
        <dt>Node type</dt>
        <dd>
          <code>{node?.nodeType ?? '–'}</code>
        </dd>
      </dl>

      <button
        type="button"
        className="nsx-button"
        onClick={() =>
          toast.success(
            node
              ? `Inspecting "${node.label ?? node.nodeType}".`
              : 'Nothing is inspected yet - select a node.',
            { title: 'Example plugin' },
          )
        }
      >
        Show a toast
      </button>
    </div>
  )
}
