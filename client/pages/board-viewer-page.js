import { buildLabelPrintCommand } from '@things-factory/barcode-base'
import { client, PageView, store } from '@things-factory/shell'
import gql from 'graphql-tag'
import { css, html } from 'lit-element'
import { connect } from 'pwa-helpers/connect-mixin.js'
import { provider } from '../board-provider'
import '../board-viewer/board-viewer'
import './things-scene-components.import'

class BoardViewerPage extends connect(store)(PageView) {
  static get properties() {
    return {
      _board: Object,
      _boardId: String,
      _baseUrl: String,
      _license: Object
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
        accept: ['label', 'usb'],
        name: this._board && this._board.name,
        content: () => {
          return this.getGrf()
        },
        options: {}
      },
      screencastable: true,
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

  updated(changes) {
    if (changes.has('_boardId')) {
      this.shadowRoot.querySelector('board-viewer').closeScene()
      this.refresh()
    }

    if (changes.has('_license')) {
      if (scene && scene.license) scene.license(this._license.key)
    }
  }

  pageUpdated(changes, lifecycle) {
    if (this.active) {
      this._boardId = lifecycle.resourceId
    } else {
      this._boardId = null
      this.shadowRoot.querySelector('board-viewer').closeScene()
    }
  }

  stateChanged(state) {
    this._baseUrl = state.app.baseUrl
    this._license = state.license
  }

  async refresh() {
    if (!this._boardId) {
      return
    }
    var response = await client.query({
      query: gql`
        query FetchBoardById($id: String!) {
          board(id: $id) {
            id
            name
            model
          }
        }
      `,
      variables: { id: this._boardId }
    })

    var board = response.data.board

    this._board = {
      ...board,
      model: JSON.parse(board.model)
    }

    this.updateContext()
  }

  async getGrf() {
    var { labelRotation } = this._board.model

    var { width, height, data } = (await this.shadowRoot.querySelector('board-viewer').getSceneImageData()) || {}
    if (!width) {
      throw 'Cannot get SceneImageData...'
    }

    return buildLabelPrintCommand(data, width, height, labelRotation)
  }
}

customElements.define('board-viewer-page', BoardViewerPage)
