import { html } from 'lit-html'

import { store } from '@things-factory/shell'
import { addRoutingType } from '@things-factory/menu-base'

import board from './reducers/board'
import { APPEND_NAVBAR, REMOVE_NAVBAR, TOOL_POSITION } from '@things-factory/layout-base'
import { APPEND_CONTEXT_TOOL, REMOVE_CONTEXT_TOOL } from '@things-factory/context-base'

export default function bootstrap() {
  store.dispatch(addRoutingType('VIEWER', 'board-viewer'))
  store.dispatch(addRoutingType('PLAYER', 'board-player'))

  import('./layout/menu-tools')

  const tool = {
    position: TOOL_POSITION.CENTER,
    show: true,
    template: html`
      <menu-tools></menu-tools>
    `,
    context: 'board_topmenu'
  }

  const navbar = {
    position: TOOL_POSITION.CENTER,
    show: true,
    template: html`
      <menu-tools></menu-tools>
    `
  }

  var width

  store.subscribe(async () => {
    var state = store.getState()

    if (state.layout.width == width) {
      return
    }

    width = state.layout.width

    if (width == 'WIDE') {
      store.dispatch({
        type: REMOVE_CONTEXT_TOOL,
        tool
      })

      store.dispatch({
        type: APPEND_NAVBAR,
        name: 'board-topmenu',
        navbar
      })
    } else {
      store.dispatch({
        type: REMOVE_NAVBAR,
        name: 'board-topmenu'
      })

      store.dispatch({
        type: APPEND_CONTEXT_TOOL,
        tool
      })
    }
  })

  store.addReducers({ board })
}
