import { html, css } from 'lit-element'

import { connect } from 'pwa-helpers/connect-mixin.js'
import { store, PageView } from '@things-factory/shell'

import { fetchBoard } from '@things-factory/board-base'
import { provider } from '../board-provider'

import '@things-shell/board-viewer'

class BoardViewerPage extends connect(store)(PageView) {
  constructor() {
    super()

    import('./things-scene-components.import')
      .then(exported => {})
      .catch(error => 'An error occurred while loading scene-components')
  }

  static get properties() {
    return {
      _board: Object,
      // _provider: Object,
      _boardId: String,
      _baseUrl: String
    }
  }

  static get styles() {
    return [
      css`
        :host {
          display: flex;
          flex-direction: column;

          width: 100vw; /* 전체화면보기를 위해서 필요함. */
          height: 100vh;

          overflow: hidden;
        }

        board-viewer {
          flex: 1;

          width: 100vw; /* 전체화면보기를 위해서 필요함. */
          height: 100vh;

          position: relative;
        }
      `
    ]
  }

  get context() {
    return {
      title: this._board && this._board.name,
      printable: {
        accept: ['paper', 'label']
      },
      exportable: {
        accept: ['json'],
        name: this._board && this._board.name,
        data: () => {
          return this._board.model
        }
      }
    }
  }

  render() {
    return html`
      <board-viewer .board=${this._board} .provider=${provider}></board-viewer>
    `
  }

  async updated(changed) {
    if (changed.has('active')) {
      var response = await fetchBoard(this._boardId)
      var board = response.board

      this._board = {
        ...board,
        model: JSON.parse(board.model)
      }
    }
  }

  stateChanged(state) {
    this._baseUrl = state.app.baseUrl
    this._boardId = state.route.resourceId
  }
}

customElements.define('board-viewer-page', BoardViewerPage)
