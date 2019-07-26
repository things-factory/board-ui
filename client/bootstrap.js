import { store } from '@things-factory/shell'

import board from './reducers/board'
import { fetchFontList } from '@things-factory/font-base'

export default function bootstrap() {
  store.addReducers({ board })

  var lastUser
  store.subscribe(() => {
    var state = store.getState()
    var user = state.auth.user

    if(user && user !== lastUser) {
      lastUser = user

      store.dispatch(fetchFontList())
    }
  })
}
