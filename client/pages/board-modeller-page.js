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

import { isMacOS } from '../board-modeller/is-macos'

const NOOP = () => {}

export class BoardModellerPage extends connect(store)(PageView) {
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
      propertyEditor: Array,
      _license: Object,
      _showSpinner: Boolean
    }
  }

  static get styles() {
    return [
      css`
        :host {
          display: flex;
          flex-direction: column;

          overflow: hidden;
          position: relative;
        }

        board-modeller {
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

  get context() {
    return {
      title: this.board ? this.boardName : this._showSpinner ? 'Fetching board...' : 'Board Not Found'
    }
  }

  get oopsNote() {
    return {
      icon: 'color_lens',
      title: 'EMPTY BOARD',
      description: 'There are no board to be designed'
    }
  }

  get editToolbar() {
    return this.renderRoot.querySelector('#edittoolbar')
  }

  get modeller() {
    return this.renderRoot.querySelector('board-modeller')
  }

  async refresh() {
    if (!this.boardId) {
      this.board = null

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
        variables: { id: this.boardId }
      })

      var board = response.data.board

      if (!board) {
        this._board = null
        throw 'board not found'
      }

      this.board = {
        ...board,
        model: JSON.parse(board.model)
      }

      this.boardName = this.board.name
      this.model = {
        ...this.board.model
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

  pageUpdated(changes, lifecycle) {
    if (this.active) {
      this.boardId = lifecycle.resourceId

      this.refresh()
      this.bindShortcutEvent()
    } else {
      this.modeller.close()
      this.unbindShortcutEvent()
    }
  }

  updated(changes) {
    if (changes.has('_license')) {
      if (scene && scene.license) scene.license(this._license.key)
    }
  }

  stateChanged(state) {
    this.baseUrl = state.route.rootPath
    this.propertyEditor = state.board.editors

    this.componentGroupList = state.board.templates
    this.fonts = state.font

    this._license = state.license
  }

  render() {
    var oops = !this._showSpinner && !this.model && this.oopsNote

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
          <oops-spinner ?show=${this._showSpinner}></oops-spinner>
        `

    return html``
  }

  onOpenPreview() {
    this.modeller.preview()
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
      this._showSpinner = true

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
    } finally {
      this._showSpinner = false
    }

    this.updateContext()
  }

  async saveBoard() {
    await this.updateBoard()
  }

  bindShortcutEvent() {
    var isMac = isMacOS()

    // TODO: Global Hotkey에 대한 정의를 edit-toolbar에서 가져올 수 있도록 수정해야 함.
    const GLOBAL_HOTKEYS = ['Digit1', 'Digit2', 'F11', 'KeyD', 'KeyP', 'KeyS']

    this._shortcutHandler = e => {
      var tagName = e.composedPath()[0].tagName
      var isInput = tagName.isContentEditable || tagName == 'INPUT' || tagName == 'SELECT' || tagName == 'TEXTAREA'
      var isGlobalHotkey = GLOBAL_HOTKEYS.includes(e.code)

      if (!isGlobalHotkey && isInput) return
      if (!this.editToolbar.onShortcut(e, isMac)) this.modeller.onShortcut(e, isMac)
    }

    document.addEventListener('keydown', this._shortcutHandler)
  }

  unbindShortcutEvent() {
    if (this._shortcutHandler) {
      document.removeEventListener('keydown', this._shortcutHandler)
      delete this._shortcutHandler
    }
  }
}

customElements.define('board-modeller-page', BoardModellerPage)
