import { store } from '@things-factory/shell'

import board from './reducers/board'

import { registerEditor, registerRenderer } from '@things-factory/grist-ui'

import { BoardRenderer } from './data-grist/board-renderer'
import { BoardEditor } from './data-grist/board-editor'

export default function bootstrap() {
  registerRenderer('board', BoardRenderer)
  registerEditor('board', BoardEditor)

  store.addReducers({ board })
}
