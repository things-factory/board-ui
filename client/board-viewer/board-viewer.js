import { LitElement, html, css } from 'lit-element'

import '@material/mwc-fab'
import '@material/mwc-icon'

import { create } from '@hatiolab/things-scene'
import { togglefullscreen, isIOS, sleep } from '@things-factory/shell'

import { style } from './board-viewer-style'

export class BoardViewer extends LitElement {
  constructor() {
    super()

    this.board = {}
    this.provider = null
    this.scene = null

    this.forward = []
    this.backward = []
  }

  static get properties() {
    return {
      board: Object,
      provider: Object,
      baseUrl: String
    }
  }

  static get styles() {
    return [style]
  }

  render() {
    var fullscreen = !isIOS()
      ? html`
          <mwc-fab
            id="fullscreen"
            icon="fullscreen"
            @click=${e => this.onTapFullscreen(e)}
            @mouseover=${e => this.transientShowButtons(stop)}
            @mouseout=${e => this.transientShowButtons()}
            title="fullscreen"
          ></mwc-fab>
        `
      : html``

    return html`
      <mwc-icon
        id="prev"
        @click=${e => this.onTapPrev(e)}
        @mouseover=${e => this.transientShowButtons(true)}
        @mouseout=${e => this.transientShowButtons()}
        hidden
        >keyboard_arrow_left</mwc-icon
      >

      <div
        id="target"
        @touchstart=${e => this.transientShowButtons()}
        @mousemove=${e => this.transientShowButtons()}
      ></div>

      <mwc-icon
        id="next"
        @click=${e => this.onTapNext(e)}
        @mouseover=${e => this.transientShowButtons(true)}
        @mouseout=${e => this.transientShowButtons()}
        hidden
        >keyboard_arrow_right</mwc-icon
      >

      ${fullscreen}
    `
  }

  firstUpdated() {
    window.addEventListener('resize', () => {
      this.scene && this.scene.fit()
    })

    this.shadowRoot.addEventListener(
      'close-scene',
      e => {
        e.preventDefault()
        this.onTapPrev()
      },
      false
    )
  }

  updated(changes) {
    if (changes.has('board')) {
      if (this.board && this.board.id) {
        this.initScene()
      } else {
        this.closeScene()
      }
    }
  }

  initScene() {
    if (!this.board || !this.board.id) return

    var scene = create({
      model: {
        ...this.board.model
      },
      mode: 0,
      refProvider: this.provider
    })

    if (this.baseUrl) {
      scene.baseUrl = this.baseUrl
    }

    this.provider.add(this.board.id, scene)

    this.showScene(this.board.id)

    /* provider.add 시에 추가된 레퍼런스 카운트를 다운시켜주어야 함 */
    scene.release()
  }

  closeScene() {
    if (this.scene) {
      this.unbindSceneEvents(this.scene)

      this.scene.target = null
      this.scene.release()

      delete this.scene
    }

    // delete queued scenes
    this.forward.forEach(scene => scene.release())
    this.forward = []

    this.backward.forEach(scene => scene.release())
    this.backward = []
  }

  get target() {
    return this.shadowRoot.querySelector('#target')
  }

  get prev() {
    return this.shadowRoot.querySelector('#prev')
  }

  get next() {
    return this.shadowRoot.querySelector('#next')
  }

  get fullscreen() {
    return this.shadowRoot.querySelector('#fullscreen')
  }

  releaseScene() {
    if (this.scene) {
      this.unbindSceneEvents(this.scene, this)

      this.scene.target = null
      this.scene.release()

      delete this.scene

      // delete queued scenes
      this.forward.forEach(scene => {
        scene.release()
      })
      this.forward = []

      this.backward.forEach(scene => {
        scene.release()
      })
      this.backward = []

      this.transientShowButtons()
    }
  }

  setupScene(scene) {
    this.scene = scene

    /* scene의 기존 target을 보관한다. */
    this._oldtarget = this.scene.target

    this.scene.fit(this.board.model.fitMode)
    this.scene.target = this.target

    this.bindSceneEvents(this.scene)

    this.transientShowButtons()
  }

  async showScene(boardId, bindingData) {
    if (!boardId) return

    try {
      var scene = await this.provider.get(boardId, true)

      var old_scene = this.scene
      this.scene = scene

      if (scene.target === this.target) {
        scene.release()
        return
      }

      if (old_scene) {
        /* old scene을 backward에 보관한다. */
        this.unbindSceneEvents(old_scene)
        /* 원래의 target에 되돌린다. */
        old_scene.target = this._oldtarget
        this.backward.push(old_scene)
      }

      this.forward.forEach(scene => {
        scene.release()
      })

      /* forward를 비운다. */
      this.forward = []

      this.setupScene(scene)

      if (bindingData) {
        scene.data = bindingData
      }
    } catch (e) {
      console.error(e)
    }
  }

  bindSceneEvents() {
    this.scene.on('goto', this.onLinkGoto, this)
    this.scene.on('link-open', this.onLinkOpen, this)
    this.scene.on('link-move', this.onLinkMove, this)
  }

  unbindSceneEvents(scene) {
    this.scene.off('goto', this.onLinkGoto, this)
    this.scene.off('link-open', this.onLinkOpen, this)
    this.scene.off('link-move', this.onLinkMove, this)
  }

  transientShowButtons(stop) {
    var buttons = [this.fullscreen, this.next, this.prev]

    if (!this._fade_animations) {
      this._fade_animations = buttons
        .filter(button => button)
        .map(button => {
          let animation = button.animate(
            [
              {
                opacity: 1,
                easing: 'ease-in'
              },
              { opacity: 0 }
            ],
            { delay: 1000, duration: 2000 }
          )

          animation.onfinish = () => {
            button.hidden = true
          }

          return animation
        })
    }

    this.next.hidden = this.forward.length <= 0
    this.prev.hidden = this.backward.length <= 0
    this.fullscreen && (this.fullscreen.hidden = false)

    this._fade_animations.forEach(animation => {
      animation.cancel()
      if (stop) return

      animation.play()
    })
  }

  /* event handlers */

  onTapNext() {
    var scene = this.forward.pop()
    if (!scene) return

    if (this.scene) {
      this.scene.target = null
      /* 원래의 target에 되돌린다. */
      this.scene.target = this._oldtarget
      this.unbindSceneEvents(this.scene)
      this.backward.push(this.scene)
    }

    this.setupScene(scene)
  }

  onTapPrev() {
    var scene = this.backward.pop()
    if (!scene) return

    if (this.scene) {
      this.scene.target = null
      /* 원래의 target에 되돌린다. */
      this.scene.target = this._oldtarget
      this.unbindSceneEvents(this.scene)
      this.forward.push(this.scene)
    }

    this.setupScene(scene)
  }

  onTapFullscreen() {
    togglefullscreen(this.target)
  }

  onLinkGoto(targetBoardId, value, fromComponent) {
    this.showScene(targetBoardId, fromComponent.data)
  }

  onLinkOpen(url, value, fromComponent) {
    if (!url) return

    try {
      window.open(url)
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
    }
  }

  onLinkMove(url, value, fromComponent) {
    if (!url) return

    location.href = url
  }

  async getSceneImageData() {
    if (!this.scene) {
      return
    }

    var { width, height } = this.scene.model
    var pixelRatio = window.devicePixelRatio

    // 1. Scene의 바운드에 근거하여, 오프스크린 캔바스를 만든다.
    var canvas = document.createElement('canvas')
    canvas.width = Number(width)
    canvas.height = Number(height)

    var root = this.scene.root
    // 2. 모델레이어의 원래 위치와 스케일을 저장한다.
    var translate = root.get('translate')
    var scale = root.get('scale')

    // 3. 위치와 스케일 기본 설정.
    root.set('translate', { x: 0, y: 0 })
    root.set('scale', { x: 1 / pixelRatio, y: 1 / pixelRatio })

    // 4. 오프스크린 캔바스의 Context2D를 구한뒤, 모델레이어를 그 위에 그린다.
    var context = canvas.getContext('2d')

    root.draw(context)

    root.set('translate', translate)
    root.set('scale', scale)

    var data = canvas.getContext('2d').getImageData(0, 0, width, height).data

    return {
      width,
      height,
      data
    }
  }
}

customElements.define('board-viewer', BoardViewer)
