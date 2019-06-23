import { html, css } from 'lit-element'
import { connect } from 'pwa-helpers/connect-mixin.js'

import '@polymer/paper-dialog/paper-dialog'
import '@polymer/paper-dialog-scrollable/paper-dialog-scrollable'
import { saveAs } from 'file-saver'

import { store, PageView, togglefullscreen } from '@things-factory/shell'
import { fetchBoard, createBoard, updateBoard, ADD_BOARD_COMPONENTS } from '@things-factory/board-base'
import { i18next } from '@things-factory/i18n-base'

import { provider } from '../board-provider'

import '../board-modeller/board-modeller'
import '../board-modeller/edit-toolbar'
import '../layout/page-toolbar'

class BoardModellerPage extends connect(store)(PageView) {
  constructor() {
    super()

    import('./things-scene-components-with-tools.import')
      .then(exported => {
        let components = exported.default

        /* 각 모듈의 locale정보로 resource bundle을 추가한다. */
        for (let component in components) {
          let locales = components[component].locales

          locales &&
            Object.keys(locales).forEach(lng => {
              i18next.addResourceBundle(lng, 'translations', locales[lng], true, true)
            })
        }

        store.dispatch({
          type: ADD_BOARD_COMPONENTS,
          components
        })
      })
      .catch(error => 'An error occurred while loading the component')

    /* 각 모듈의 locale정보로 resource bundle을 추가한다. */
    // for (let element in elements) {
    //   let locales = elements[element].locales

    //   locales &&
    //     Object.keys(locales).forEach(lng => {
    //       i18next.addResourceBundle(lng, 'translations', locales[lng], true, true)
    //     })
    // }

    // store.dispatch({
    //   type: 'MODULE-PLUGIN',
    //   elements
    // })

    this.boardName = ''
    this.model = null
    this.baseUrl = ''
    this.selected = []
    this.mode = 1
    // this.provider = null
    this.hideProperty = false
    this.overlay = null
    this.scene = null
    this.componentGroupList = []
    this.fonts = []
    this.boardGroupList = []
    this.group = null
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
      boardGroupList: Array,
      group: Object,
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
    var response = await fetchBoard(this.boardId)
    var board = response.board

    this.board = {
      ...board,
      model: JSON.parse(board.model)
    }

    this.boardName = this.board.name
    this.model = {
      ...this.board.model
    }
  }

  onPageActive(active) {
    if (active) {
      this.refresh()
    } else {
      this.shadowRoot.querySelector('board-modeller').close()
    }
  }

  stateChanged(state) {
    this.boardId = state.route.resourceId
    this.baseUrl = state.route.rootPath

    // this.componentGroupList = state.component.groupList
    // this.fonts = state.fontList

    // this.boardGroupList = state.boardGroupList
    // this.group = state.boardGroupCurrent
    // this.propertyEditor = state.propertyEditor
  }

  render() {
    return html`
      <page-toolbar>
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
      </page-toolbar>

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

      <paper-dialog
        id="save-new-dialog"
        entry-animation="scale-up-animation"
        exit-animation="fade-out-animation"
        @iron-overlay-closed=${e => this.onSaveNewDialogClosed(e)}
        no-overlap
      >
        <h2><i18n-msg msgid="label.save-new-board">Save New Board</i18n-msg></h2>
        <paragraph>
          <i18n-msg msgid="label.pls-name-board">Please, give a name for the new board.</i18n-msg>
        </paragraph>

        <paper-input
          always-float-label
          .label="${i18next.t('label.name')}"
          @change="${e => (this.newBoardName = e.target.value)}"
          .value=${this.newBoardName}
        >
        </paper-input>
        <paper-textarea
          always-float-label
          .label="${i18next.t('label.description')}"
          @value-changed=${e => (this.newBoardDescription = e.target.value)}
          rows="1"
          .value=${this.newBoardDescription}
        >
        </paper-textarea>

        <label>${i18next.t('label.group')}</label>
        <select
          @change=${e => (this.newBoardGroup = e.target.value)}
          .value=${this.newBoardGroup || (this.group && this.group.id)}
        >
          <option value=""></option>
          ${this.boardGroupList.map(
            item => html`
              <option value=${item.id}>${item.name}</option>
            `
          )}
        </select>

        <div class="buttons">
          <paper-button dialog-dismiss> <i18n-msg msgid="button.cancel">Cancel</i18n-msg> </paper-button>
          <paper-button dialog-confirm autofocus>
            <i18n-msg msgid="button.accept">Accept</i18n-msg>
          </paper-button>
        </div>
      </paper-dialog>
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

  createBoard() {
    try {
      store
        .dispatch(
          createBoard({
            ...this.board,
            model: this.scene.model
          })
        )
        .then(dispatch => {
          var state = store.getState()
          dispatch(setRoute('modeller', state.boardCurrent.id))
        })
    } catch (e) {
      if (this.showToastMsg) this.showToastMsg(e)
    }
  }

  updateBoard() {
    try {
      store.dispatch(
        updateBoard({
          ...this.board,
          model: this.scene.model
        })
      )
    } catch (e) {
      if (this.showToastMsg) this.showToastMsg(e)
    }
  }

  saveBoard() {
    if (!this.board.name) {
      this.newBoardName = ''
      this.newBoardDescription = ''
      this.newBoardGroup = this.group.id

      this.shadowRoot.getElementById('save-new-dialog').open()
    } else {
      this.updateBoard()
    }
  }

  onSaveNewDialogClosed(e) {
    var dialog = e.target

    if (!dialog.closingReason.confirmed) return

    this.board.name = this.newBoardName
    this.board.description = this.newBoardDescription
    this.board.group = this.newBoardGroup

    this.createBoard()
  }
}

customElements.define('board-modeller-page', BoardModellerPage)
