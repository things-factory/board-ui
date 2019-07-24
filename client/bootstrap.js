import { store } from '@things-factory/shell'

import board from './reducers/board'

export default function bootstrap() {
  store.addReducers({ board })
}
