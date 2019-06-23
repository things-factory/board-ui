import { html, css } from 'lit-element'

import { connect } from 'pwa-helpers/connect-mixin.js'
import { store, PageView } from '@things-factory/shell'

import { fetchBoard } from '@things-factory/board-base'
import { provider } from '../board-provider'

import '../board-viewer/board-viewer'

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

          width: 100%; /* 전체화면보기를 위해서 필요함. */
          height: 100%;

          overflow: hidden;
        }

        board-viewer {
          flex: 1;
        }
      `
    ]
  }

  get context() {
    return {
      title: this._board && this._board.name,
      printable: {
        accept: ['paper', 'label'],
        name: this._board && this._board.name,
        content: () => {
          return this._board
        },
        options: {}
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

  stateChanged(state) {
    this._baseUrl = state.app.baseUrl
    this._boardId = state.route.resourceId
  }

  async refresh() {
    var response = await fetchBoard(this._boardId)
    var board = response.board

    this._board = {
      ...board,
      model: JSON.parse(board.model)
    }
  }

  async onPageActive(active) {
    if (active) {
      this.refresh()
    } else {
      this.shadowRoot.querySelector('board-viewer').closeScene()
    }
  }
}

customElements.define('board-viewer-page', BoardViewerPage)
