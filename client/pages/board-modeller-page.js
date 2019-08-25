import { html, css } from 'lit-element'
import { connect } from 'pwa-helpers/connect-mixin.js'
import gql from 'graphql-tag'

import { saveAs } from 'file-saver'

import { store, PageView, togglefullscreen, client } from '@things-factory/shell'

import { provider } from '../board-provider'

import { ADD_BOARD_COMPONENTS } from '../actions/board'

import '../board-modeller/board-modeller'
import '../board-modeller/edit-toolbar'

import './things-scene-components.import'
import components from './things-scene-components-with-tools.import'

class BoardModellerPage extends connect(store)(PageView) {
  constructor() {
    super()

    store.dispatch({
      type: ADD_BOARD_COMPONENTS,
      components
    })

    this.boardName = ''
    this.model = null
    this.baseUrl = ''
    this.selected = []
    this.mode = 1
    this.hideProperty = false
    this.overlay = null
    this.scene = null
    this.componentGroupList = []
    this.fonts = []
    this.board = null
    this.propertyEditor = []
  }

  static get properties() {
    return {
      boardName: String,
      model: Object,
      baseUrl: String,
      selected: Array,
      mode: Number,
      // provider: Object,
      hideProperty: Boolean,
      overlay: String,
      scene: Object,
      componentGroupList: Array,
      fonts: Array,
      propertyEditor: Array
    }
  }

  static get styles() {
    return [
      css`
        :host {
          display: flex;
          flex-direction: column;

          overflow: hidden;
        }

        board-modeller {
          flex: 1;
        }
      `
    ]
  }

  get context() {
    return {
      title: this.boardName
    }
  }

  async refresh() {
    if (!this.boardId) {
      var board = {
        width: 800,
        height: 600,
        model: JSON.stringify({
          width: 800,
          height: 600
        })
      }
    } else {
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
        variables: { id: this.boardId }
      })

      var board = response.data.board
    }

    this.board = {
      ...board,
      model: JSON.parse(board.model)
    }

    this.boardName = this.board.name
    this.model = {
      ...this.board.model
    }

    this.updateContext()
  }

  activated(active) {
    if (!active) {
      this.shadowRoot.querySelector('board-modeller').close()
    } else {
      this.refresh()
    }
  }

  stateChanged(state) {
    this.boardId = state.route.resourceId
    this.baseUrl = state.route.rootPath
    this.propertyEditor = state.board.editors

    this.componentGroupList = state.board.templates
    this.fonts = state.font
  }

  render() {
    return html`
      <edit-toolbar
        id="edittoolbar"
        .scene=${this.scene}
        .board=${this.board}
        .selected=${this.selected}
        ?hideProperty=${this.hideProperty}
        @hide-property-changed=${e => (this.hideProperty = e.detail.value)}
        @open-preview=${e => this.onOpenPreview(e)}
        @download-model=${e => this.onDownloadModel(e)}
        @modeller-fullscreen=${e => this.onFullscreen(e)}
      >
      </edit-toolbar>

      <board-modeller
        .mode=${this.mode}
        @mode-changed=${e => {
          this.mode = e.detail.value
        }}
        .model=${this.model}
        @model-changed=${e => {
          this.model = e.detail.value
        }}
        .scene=${this.scene}
        @scene-changed=${e => {
          this.scene = e.detail.value
        }}
        .selected=${this.selected}
        @selected-changed=${e => {
          this.selected = e.detail.value
        }}
        .baseUrl=${this.baseUrl}
        .provider=${provider}
        @save-model=${e => this.saveBoard()}
        .componentGroupList=${this.componentGroupList}
        .fonts=${this.fonts}
        .propertyEditor=${this.propertyEditor}
      >
      </board-modeller>
    `
  }

  onOpenPreview() {
    this.shadowRoot.querySelector('board-modeller').preview()
  }

  onDownloadModel() {
    if (!this.scene) return

    var model = JSON.stringify(this.model, null, 2)
    var filename = (this.boardName || 'NONAME') + '-' + Date.now() + '.json'
    saveAs(new Blob([model], { type: 'application/octet-stream' }), filename)
  }

  onFullscreen() {
    togglefullscreen(this)
  }

  async updateBoard() {
    try {
      var { id, name, description, groupId } = this.board
      var model = JSON.stringify(this.scene.model)

      await client.mutate({
        mutation: gql`
          mutation UpdateBoard($id: String!, $patch: BoardPatch!) {
            updateBoard(id: $id, patch: $patch) {
              id
            }
          }
        `,
        variables: {
          id,
          patch: { name, description, model, groupId }
        }
      })

      document.dispatchEvent(
        new CustomEvent('notify', {
          detail: {
            level: 'info',
            message: 'saved'
          }
        })
      )
    } catch (ex) {
      document.dispatchEvent(
        new CustomEvent('notify', {
          detail: {
            level: 'error',
            message: ex,
            ex: ex
          }
        })
      )
    }

    this.updateContext()
  }

  async saveBoard() {
    await this.updateBoard()
  }
}

customElements.define('board-modeller-page', BoardModellerPage)
