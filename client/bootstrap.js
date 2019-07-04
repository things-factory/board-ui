import { html } from 'lit-html'

import { store } from '@things-factory/shell'
import { i18next } from '@things-factory/i18n-base'
import { addRoutingType } from '@things-factory/menu-base'

import board from './reducers/board'

import {
  APPEND_CONTEXT_TOOL,
  REMOVE_CONTEXT_TOOL,
  APPEND_NAVBAR,
  REMOVE_NAVBAR,
  TOOL_POSITION
} from '@things-factory/layout-base'

export default function bootstrap() {
  i18next.loadNamespaces('board-ui', err => {
    err && console.error(err)
  })

  store.dispatch(addRoutingType('VIEWER', 'board-viewer'))
  store.dispatch(addRoutingType('PLAYER', 'board-player'))

  import('./layout/menu-tools')

  const tool = {
    position: TOOL_POSITION.CENTER,
    template: html`
      <menu-tools></menu-tools>
    `,
    context: 'board-page'
  }

  const navbar = {
    position: TOOL_POSITION.CENTER,
    template: html`
      <menu-tools></menu-tools>
    `
  }

  var width

  store.subscribe(() => {
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
        navbar
      })
    } else {
      store.dispatch({
        type: REMOVE_NAVBAR,
        navbar
      })

      store.dispatch({
        type: APPEND_CONTEXT_TOOL,
        tool
      })
    }
  })

  store.addReducers({ board })
}
