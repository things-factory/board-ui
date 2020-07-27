import { buildLabelPrintCommand } from '@things-factory/barcode-base'
import { client, PageView, store } from '@things-factory/shell'
import gql from 'graphql-tag'
import { css, html } from 'lit-element'
import { connect } from 'pwa-helpers/connect-mixin.js'
import { provider } from '../board-provider'
import '../board-viewer/board-viewer'
import './things-scene-components.import'

const NOOP = () => {}

export class BoardViewerPage extends connect(store)(PageView) {
  static get properties() {
    return {
      _board: Object,
      _boardId: String,
      _baseUrl: String,
      _showSpinner: Boolean
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
          position: relative;
        }

        board-viewer {
          flex: 1;
        }

        oops-spinner {
          display: none;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }

        oops-spinner[show] {
          display: block;
        }

        oops-note {
          display: block;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }
      `
    ]
  }

  get oopsNote() {
    return {
      icon: 'insert_chart_outlined',
      title: 'EMPTY BOARD',
      description: 'There are no board to be shown'
    }
  }

  get context() {
    return {
      title: this._board ? this._board.name : this._showSpinner ? 'Fetching board...' : 'Board Not Found'
    }
  }

  render() {
    var oops = !this._showSpinner && !this._board && this.oopsNote

    return oops
      ? html`
          <oops-note
            icon=${oops.icon}
            title=${oops.title}
            description=${oops.description}
            @click=${oops.click || NOOP}
          ></oops-note>
        `
      : html`
          <board-viewer .board=${this._board} .provider=${provider}></board-viewer>
          <oops-spinner ?show=${this._showSpinner}></oops-spinner>
        `
  }

  updated(changes) {
    if (changes.has('_boardId')) {
      var boardViewerElement = this.shadowRoot.querySelector('board-viewer')
      boardViewerElement && boardViewerElement.closeScene()
      this.refresh()
    }
  }

  pageUpdated(changes, lifecycle) {
    if (this.active) {
      this._boardId = lifecycle.resourceId
    } else {
      this._boardId = null
      let boardViewer = this.shadowRoot.querySelector('board-viewer')
      boardViewer && boardViewer.closeScene()
    }
  }

  stateChanged(state) {
    this._baseUrl = state.app.baseUrl
  }

  async refresh() {
    if (!this._boardId) {
      return
    }

    try {
      this._showSpinner = true
      this.updateContext()

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

      if (!board) {
        this._board = null
        throw 'board not found'
      }

      this._board = {
        ...board,
        model: JSON.parse(board.model)
      }
    } catch (ex) {
      document.dispatchEvent(
        new CustomEvent('notify', {
          detail: {
            level: 'error',
            message: ex,
            ex
          }
        })
      )
    } finally {
      this._showSpinner = false
      this.updateContext()
    }
  }

  async getGrf() {
    var { labelRotation } = this._board.model

    var { width, height, data } = (await this.shadowRoot.querySelector('board-viewer').getSceneImageData()) || {}
    if (!width) {
      throw 'Cannot get SceneImageData...'
    }

    return buildLabelPrintCommand(data, width, height, labelRotation)
  }

  async printTrick() {
    await this.renderRoot.querySelector('board-viewer').printTrick()
  }
}

customElements.define('board-viewer-page', BoardViewerPage)
