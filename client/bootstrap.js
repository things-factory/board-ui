import { store } from '@things-factory/shell'

import { ADD_MODELLER_EDITORS } from '@things-factory/modeller-ui'
import { registerEditor, registerRenderer } from '@things-factory/grist-ui'

import board from './reducers/board'

import { BoardRenderer } from './data-grist/board-renderer'
import { BoardEditor } from './data-grist/board-editor'

import './board-modeller/editors/board-editor-property'

export default function bootstrap() {
  registerRenderer('board', BoardRenderer)
  registerEditor('board', BoardEditor)

  store.addReducers({ board })

  store.dispatch({
    type: ADD_MODELLER_EDITORS,
    editors: {
      'board-selector': 'property-editor-board-selector'
    }
  })
}
