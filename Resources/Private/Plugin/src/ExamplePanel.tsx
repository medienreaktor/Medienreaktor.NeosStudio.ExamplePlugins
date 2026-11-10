import { useState } from 'react'
import {
  apiFetch,
  Button,
  Icon,
  toast,
  useQuery,
  useStudio,
  useStudioEvent,
  type CurrentAccount,
  type StudioEventMap,
} from '@medienreaktor/neos-studio'
import { t } from './i18n'

/**
 * A panel is a prop-less component: it reads everything it needs from
 * `useStudio()` - the same hook (and the same React) the shell's own panels
 * use, because at runtime this bundle resolves `react` and the plugin API to
 * the shell's globals. Register it (see main.tsx) and the shell docks it like
 * any built-in panel.
 *
 * It also shows the other parts of the plugin API a panel typically needs:
 *  - the shell's components (Button, Icon) - plugins build their UI from them
 *    and only style their own layout (plugin.css);
 *  - translated labels from this package's XLIFF files (`t`, see i18n.ts);
 *  - `useQuery` on the shell's own query cache, with a key starting with the
 *    package key so it can never collide with the shell's;
 *  - `useStudioEvent`, here to show the last property the editor saved.
 */
export function ExamplePanel() {
  const studio = useStudio()
  const node = studio.inspectedNode

  const account = useQuery({
    queryKey: ['Medienreaktor.NeosStudio.ExamplePlugins', 'me'],
    queryFn: () => apiFetch<CurrentAccount>('/me'),
    staleTime: 5 * 60 * 1000,
  })

  const [lastSaved, setLastSaved] = useState<
    StudioEventMap['node.edited'] | null
  >(null)
  useStudioEvent('node.edited', setLastSaved)

  return (
    <div className="nsx-panel">
      <p className="nsx-panel__lead">
        <Icon name="puzzle-piece" className="nsx-panel__icon" />{' '}
        {t(
          'panel.lead',
          'This panel ships from a package separate from the Studio shell. It reads live app state through useStudio().',
        )}
      </p>

      <dl className="nsx-facts">
        <dt>{t('panel.signedInAs', 'Signed in as')}</dt>
        <dd>
          {account.data
            ? (account.data.user?.label ?? account.data.account.identifier)
            : '–'}
        </dd>
        <dt>{t('panel.workspace', 'Workspace')}</dt>
        <dd>{studio.workspaceName ?? '–'}</dd>
        <dt>{t('panel.selectedDocument', 'Selected document')}</dt>
        <dd>{studio.selectedDocument?.label ?? '–'}</dd>
        <dt>{t('panel.inspectedNode', 'Inspected node')}</dt>
        <dd>{node?.label ?? '–'}</dd>
        <dt>{t('panel.nodeType', 'Node type')}</dt>
        <dd>
          <code>{node?.nodeType ?? '–'}</code>
        </dd>
        <dt>{t('panel.lastSaved', 'Last saved')}</dt>
        <dd>{lastSaved ? <code>{lastSaved.name}</code> : '–'}</dd>
      </dl>

      <Button
        variant="outline"
        size="sm"
        className="nsx-panel__action"
        onClick={() =>
          toast.success(
            node
              ? t('panel.toast.inspecting', 'Inspecting "{0}".', [
                  node.label ?? node.nodeType,
                ])
              : t(
                  'panel.toast.nothing',
                  'Nothing is inspected yet - select a node.',
                ),
            { title: t('plugin.name', 'Example plugin') },
          )
        }
      >
        {t('panel.showToast', 'Show a toast')}
      </Button>
    </div>
  )
}
