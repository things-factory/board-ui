import { html } from 'lit-html'

import { store } from '@things-factory/shell'
import { addRoutingType } from '@things-factory/menu-base'

import { APPEND_CONTEXT_TOOL, TOOL_POSITION } from '@things-factory/layout-base'

export default function bootstrap() {
  store.dispatch(addRoutingType('VIEWER', 'board-viewer'))
  store.dispatch(addRoutingType('PLAYER', 'board-player'))

  import('./layout/group-category-tools')

  store.dispatch({
    type: APPEND_CONTEXT_TOOL,
    tool: {
      position: TOOL_POSITION.CENTER,
      template: html`
        <group-category-tools></group-category-tools>
      `,
      context: 'board-list'
    }
  })
}
