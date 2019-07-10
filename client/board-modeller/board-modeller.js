import { LitElement, html, css } from 'lit-element'

import '@material/mwc-fab'

import '@polymer/paper-dialog/paper-dialog'
import '../board-viewer/board-viewer'

import './editors/things-scene-viewer/things-scene-viewer'

import './component-toolbar/component-toolbar'
import './property-sidebar/property-sidebar'

class BoardModeller extends LitElement {
  constructor() {
    super()

    this.boardName = ''
    this.model = null
    this.baseUrl = ''
    this.selected = []
    this.mode = 1
    this.provider = null
    this.hideProperty = false
    this.overlay = null
    this.scene = null
    this.componentGroupList = []
    this.fonts = []
    this.propertyEditor = []
  }

  static get properties() {
    return {
      boardName: String,
      model: Object,
      baseUrl: String,
      selected: Array,
      mode: Number,
      provider: Object,
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
          flex-direction: row;
          height: 100%;
          overflow: hidden;
        }

        #scene-wrap {
          flex: 1;
          position: relative;

          display: flex;
          flex-direction: row;
        }

        things-scene-viewer {
          flex: 1;
          width: 100%;
          height: 100%;
        }

        mwc-fab {
          position: absolute;
          right: 15px;
          bottom: 15px;
        }
      `
    ]
  }

  render() {
    return html`
      <component-toolbar
        .scene=${this.scene}
        .mode=${this.mode}
        @mode-changed=${e => {
          this.mode = e.detail.value
        }}
        .componentGroupList=${this.componentGroupList}
        .group=${this.group}
      >
      </component-toolbar>

      <div id="scene-wrap">
        <things-scene-viewer
          id="scene"
          .scene=${this.scene}
          @scene-changed=${e => {
            this.scene = e.detail.value
          }}
          .model=${this.model}
          .selected=${this.selected}
          @selected-changed=${e => {
            this.selected = e.detail.value
          }}
          .mode=${this.mode}
          @mode-changed=${e => {
            this.mode = e.detail.value
          }}
          fit="ratio"
          .baseUrl=${this.baseUrl}
          @contextmenu=${e => this.onContextMenu(e)}
          .provider=${this.provider}
          name="modeller"
        >
          <things-scene-layer type="selection-layer"></things-scene-layer>
          <things-scene-layer type="modeling-layer"></things-scene-layer>
          <things-scene-layer type="guide-layer">
            <things-scene-property name="ruler" value="disabled"></things-scene-property>
          </things-scene-layer>
          <things-scene-layer type="shift-layer">
            <things-scene-property name="text" value="${this.overlay}"></things-scene-property>
            <things-scene-property name="alpha" value="0.3"></things-scene-property>
            <things-scene-property name="fontFamily" value="arial"></things-scene-property>
            <things-scene-property name="fontSize" value="30" type="number"></things-scene-property>
            <things-scene-property name="fontColor" value="navy"></things-scene-property>
            <things-scene-property name="textBaseline" value="top"></things-scene-property>
            <things-scene-property name="textAlign" value="left"></things-scene-property>
            <things-scene-property name="paddingTop" value="50" type="number"></things-scene-property>
            <things-scene-property name="paddingLeft" value="50" type="number"></things-scene-property>
          </things-scene-layer>
          <things-scene-layer type="tag-layer"></things-scene-layer>
          <things-scene-handler type="text-editor"></things-scene-handler>
          <things-scene-handler type="move-handler"></things-scene-handler>
        </things-scene-viewer>

        <mwc-fab icon="save" @click=${e => this.onTapSave(e)} title="save"> </mwc-fab>
      </div>

      <property-sidebar
        .scene=${this.scene}
        .selected=${this.selected}
        ?collapsed=${this.hideProperty}
        .fonts=${this.fonts}
        .propertyEditor=${this.propertyEditor}
      >
      </property-sidebar>
    `
  }

  close() {
    // TODO 왜 모델러가 클리어되지 않는가 ?
    this.model = null
    this.requestUpdate()
  }

  get modellingContainer() {
    return this.shadowRoot.getElementById('scene-wrap')
  }

  bindShortcutEvent(target = this) {
    target.addEventListener('keydown', this.onKeydown.bind(this))
  }

  onKeydown(e) {
    var userOS = this._isMacOS()
    this.onShortcut(e, userOS)
  }

  onShortcut(e, MacOS) {
    if (MacOS) var ctrlKey = e.metaKey
    else var ctrlKey = e.ctrlKey

    switch (e.code) {
      case 'KeyS':
        if (ctrlKey) {
          this.onTapSave()
          e.preventDefault()
        }
        break
    }
  }

  preview() {
    this.previewModel = JSON.parse(JSON.stringify(this.scene.model))

    /*
     * paper-dialog appears behind backdrop when inside a <app-header-layout ..
     * https://github.com/PolymerElements/paper-dialog/issues/152
     **/

    var preview = document.createElement('board-viewer')

    preview.style.width = '100%'
    preview.style.height = '100%'
    preview.style.margin = '0'
    preview.style.padding = '0'
    preview.style.flex = 1
    preview.provider = this.provider
    preview.board = {
      id: 'preview',
      model: this.previewModel
    }

    var dialog = document.createElement('paper-dialog')

    dialog.style.width = '100%'
    dialog.style.height = '100%'
    dialog.style.display = 'flex'
    dialog.style['flex-direction'] = 'column'
    dialog.setAttribute('with-backdrop', true)
    dialog.setAttribute('auto-fit-on-attach', true)
    dialog.setAttribute('always-on-top', true)
    dialog.addEventListener('iron-overlay-closed', () => {
      preview.board = null
      dialog.parentNode.removeChild(dialog)
    })

    dialog.appendChild(preview)
    document.body.appendChild(dialog)

    dialog.open()

    requestAnimationFrame(() => {
      dispatchEvent(new Event('resize'))
    })
  }

  onTapSave() {
    this.dispatchEvent(new CustomEvent('save-model', { bubbles: true, composed: true, detail: { model: this.model } }))
  }

  _isMacOS() {
    return navigator.userAgent.indexOf('Mac') != -1
  }
}

customElements.define('board-modeller', BoardModeller)
