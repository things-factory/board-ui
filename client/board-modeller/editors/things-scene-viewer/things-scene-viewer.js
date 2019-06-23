import { LitElement, html, css } from 'lit-element'

import { create as createScene } from '@hatiolab/things-scene'

import './confidential-overlay'

import './things-scene-layer'
import './things-scene-handler'

export default class ThingsSceneViewer extends LitElement {
  constructor() {
    super()

    this.scene = null
    this.model = {}
    /* Scene Mode - mode 0 : view mode, mode 1 : edit mode, mode 2 : shift mode */
    this.mode = 0
    /* Transform Mode - 'translate' | 'scale' | 'rotate' */
    this.transformMode = 'translate'
    /* Space Mode - 'world' | 'local' */
    this.spaceMode = 'world'
    this.screenSize = 13.3
    this.variables = {}
    this.data = {}
    this.fit = 'none'
    this.selected = []
    this.disposeWhenDetached = false
    this.baseUrl = ''
    this.provider = null
    this.name = 'noname'
    this.enableInspector = true
    this.showInspector = false
  }

  static get is() {
    return 'things-scene-viewer'
  }

  static get properties() {
    return {
      scene: Object,
      model: Object,
      /* Scene Mode - mode 0 : view mode, mode 1 : edit mode, mode 2 : shift mode */
      mode: Number,
      /* Transform Mode - 'translate' | 'scale' | 'rotate' */
      transformMode: String,
      /* Space Mode - 'world' | 'local' */
      spaceMode: String,
      screenSize: Number,
      variables: Object,
      data: Object,
      /*
       * 캔바스에 모델을 어떻게 적절하게 보여줄 것인지를 설정한다.
       *
       * @none 가로, 세로 스케일을 1로 고정하고, {0, 0}좌표로 translate시킨다.
       * @both 캔바스에 모델을 꼭 채우도록 가로, 세로 스케일을 조정하고, {0, 0}좌표로 translate시킨다.
       * @width 캔바스의 폭에 모델의 폭을 일치하도록 가로, 세로 스케일을 동일하게 조정하고, {0, 0}좌표로 translate시킨다.
       * @height 캔바스의 높이에 모델의 높이를 일치하도록 가로, 세로 스케일을 동일하게 조정하고, {0, 0}좌표로 translate시킨다.
       * @center 가로, 세로 스케일을 1로 고정하고 모델이 화면의 중앙에 위치하도록 translate시킨다.
       * @ratio 모델의 모든 부분이 캔바스에 최대 크기로 표현될 수 있도록 가로, 세로 동일한 스케일로 조정하고, {0, 0}좌표로 translate시킨다.
       */
      fit: String,
      selected: Array,
      disposeWhenDetached: Boolean,
      baseUrl: String,
      provider: Object,
      name: String,
      enableInspector: Boolean,
      showInspector: Boolean
    }
  }

  static get styles() {
    return [
      css`
        :host {
          outline: none;
        }
      `
    ]
  }

  connectedCallback() {
    super.connectedCallback()

    window.addEventListener('resize', () => {
      requestAnimationFrame(this.resize.bind(this))
    })
  }

  disconnectedCallback() {
    super.disconnectedCallback()

    if (this.scene && this.disposeWhenDetached) {
      this._disposeScene()
    }
  }

  render() {
    return html`
      <slot></slot>
    `
  }

  updated(change) {
    change.has('model') && this._onModelChanged(this.model)
    change.has('mode') && this._onModeChanged(this.mode)
    change.has('screenSize') && this._onDisplayChanged(this.screenSize)
    change.has('data') && this._onDataChanged(this.data)
    change.has('baseUrl') && this._onBaseUrlChanged(this.baseUrl)
    change.has('transformMode') && this._onTransformModeChanged(this.transformMode)
    change.has('spaceMode') && this._onSpaceModeChanged(this.spaceMode)
  }

  _setScene(scene) {
    this.scene = scene
    this.dispatchEvent(
      new CustomEvent('scene-changed', {
        bubbles: true,
        composed: true,
        detail: { value: scene }
      })
    )
  }

  _setMode(mode) {
    this.mode = mode
    this.dispatchEvent(
      new CustomEvent('mode-changed', {
        bubbles: true,
        composed: true,
        detail: { value: mode }
      })
    )
  }

  _setVariables(variables) {
    this.variables = variables
    this.dispatchEvent(
      new CustomEvent('variables-changed', {
        bubbles: true,
        composed: true,
        detail: { value: variables }
      })
    )
  }

  _setSelected(selected) {
    this.selected = selected
    this.dispatchEvent(
      new CustomEvent('selected-changed', {
        bubbles: true,
        composed: true,
        detail: { value: selected }
      })
    )
  }

  _disposeScene() {
    if (this.scene) {
      this.scene.off('selected', this._onSelectedChanged, this)
      this.scene.off('mode', this._onSceneModeChanged, this)

      if (this.provider) {
        this.scene.release()
      } else {
        this.scene.dispose()
      }

      this._setScene(null)
      this._setSelected([])
    }
  }

  resize(force) {
    if (typeof this.scene == 'object') {
      if (force || this.fit === 'both' || Math.abs(this.offsetWidth - (this.lastOffsetWidth || 0)) >= 1) {
        requestAnimationFrame(() => {
          if (this.scene) {
            this.scene.resize()
            this.scene.fit(this.fit)
          }
        })
      }

      this.lastOffsetWidth = this.offsetWidth
    }
  }

  _onModelChanged(model) {
    this._disposeScene()

    if (!model) {
      return
    }

    const layers = Array.from(this.querySelectorAll('things-scene-layer')).map(layer => layer.getModel())

    const handlers = Array.from(this.querySelectorAll('things-scene-handler')).map(handler =>
      handler.getAttribute('type')
    )

    this._setScene(
      createScene({
        target: this,
        model: JSON.parse(JSON.stringify(model)),
        layers,
        handlers,
        mode: this.mode,
        refProvider: this.provider
      })
    )

    if (this.provider) {
      this.provider.add(this.name, this.scene)
    }

    this.scene.screen = this.screenSize

    /* 이 컴포넌트의 폭이 값을 가지고 있으면 - 화면상에 자리를 잡고 보여지고 있음을 의미한다.
     * 이 때는 정상적으로 그려주고,
     * 그렇지 않으면, 다음 Resize Handling시에 처리하도록 한다.
     */
    this.resize(true)

    this._setVariables(model.variables || this.scene.variables)

    this.scene.on('selected', this._onSelectedChanged, this)
    this.scene.on('mode', this._onSceneModeChanged, this)

    this._onModeChanged(this.mode)
    this._onDisplayChanged(this.screenSize)
    this._onBaseUrlChanged(this.baseUrl)
  }

  _onDisplayChanged(screenSize) {
    if (!this.scene) {
      return
    }

    if (screenSize) {
      this.scene.screen = parseFloat(screenSize)
    }
  }

  _onModeChanged(mode) {
    // if (!this.scene) {
    //   return
    // }
    // this.scene.mode = Number(mode)
  }

  _onDataChanged(data) {
    if (!this.scene || !data) {
      return
    }

    this.scene.data = data
  }

  _onSelectedChanged(after) {
    /*
     scene 컴포넌트의 속성을 속성 에디터(input box등)에서 변경하다가,
     scene의 다른 컴포넌트를 클릭해서 포커스(선택) 컴포넌트를 변경하게되면,
     속성 에디터(input box등)의 value change 이벤트의 처리와 충돌(레이스)하게된다.
     
     기대하는 순서는 먼저 속성 에디터의 value change 이벤트를 처리한 후에,
     selected 이벤트를 처리할 수 있도록 requestAnimationFrame으로 한 프레임을 지연하도록 하였다.
     */
    requestAnimationFrame(() => {
      this._setSelected(after)
    })
  }

  _onSceneModeChanged(after) {
    if (!this.scene) {
      return
    }

    if (this.mode !== after) {
      this._setMode(after)
    }

    if (after === 2) {
      this.style.cursor = 'all-scroll'
    } else {
      this.style.cursor = 'default'
    }
  }

  _onBaseUrlChanged(after) {
    if (!this.scene) {
      return
    }

    this.scene.baseUrl = after
  }

  _onTransformModeChanged(after) {
    if (!this.scene) {
      return
    }

    this.scene.transformMode = {
      mode: this.transformMode,
      space: this.spaceMode
    }
  }

  _onSpaceModeChanged(after) {
    if (!this.scene) {
      return
    }

    this.scene.transformMode = {
      mode: this.transformMode,
      space: this.spaceMode
    }
  }
}

customElements.define(ThingsSceneViewer.is, ThingsSceneViewer)
