import { store } from '@things-factory/shell'

import board from './reducers/board'
import { fetchFontList } from '@things-factory/font-base'

import { registerEditor, registerRenderer } from '@things-factory/grist-ui'

import { BoardRenderer } from './data-grist/board-renderer'
import { BoardEditor } from './data-grist/board-editor'

export default function bootstrap() {
  registerRenderer('board', BoardRenderer)
  registerEditor('board', BoardEditor)

  store.addReducers({ board })

  // var lastUser
  // store.subscribe(() => {
  //   var state = store.getState()
  //   var user = state.auth.user

  //   if (user && user !== lastUser) {
  //     lastUser = user

  //     store.dispatch(fetchFontList({}))
  //   }
  // })
}
