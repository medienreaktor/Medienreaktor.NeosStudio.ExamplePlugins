import { nodeActions, toast } from '@medienreaktor/neos-studio'
import { t } from './i18n'

/**
 * A node action: "Copy node ID" in the context menus of the document tree,
 * the content outliner and the preview's content elements, and in the
 * documents toolbar's "…" menu. The shell renders it; `run` may be async -
 * the shell shows a busy state while it runs and an error toast if it
 * throws, so no try/catch is needed here.
 */
export function registerNodeActions(): void {
  nodeActions.register({
    id: 'Medienreaktor.NeosStudio.ExamplePlugins:copyNodeId',
    label: () => t('action.copyNodeId', 'Copy node ID'),
    icon: 'fingerprint',
    group: 'Medienreaktor.NeosStudio.ExamplePlugins',
    run: async (node) => {
      await navigator.clipboard.writeText(node.nodeAggregateId)
      toast.success(
        t('action.copyNodeId.done', 'Copied the ID of "{0}".', [
          node.label ?? node.nodeAggregateId,
        ]),
      )
    },
  })
}
