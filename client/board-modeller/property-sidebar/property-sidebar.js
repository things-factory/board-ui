/**
 * @license Copyright © HatioLab Inc. All rights reserved.
 */

import { LitElement, html, css } from 'lit-element'

import '@material/mwc-icon'

import { deepClone, ScrollbarStyles } from '@things-factory/shell'

import './shapes/shapes'
import './styles/styles'
import './effects/effects'
import './specifics/specifics'
import './data-binding/data-binding'
import './inspector/inspector'

class PropertySidebar extends LitElement {
  constructor() {
    super()

    this.scene = null
    this.bounds = {}
    this.model = {}
    this.selected = []
    this.specificProps = []
    this.tabIndex = 'shape'
    this.collapsed = false
    this.fonts = []
    this.propertyEditor = []
  }

  static get properties() {
    return {
      scene: Object,
      bounds: Object,
      model: Object,
      selected: Array,
      specificProps: Array,
      tabIndex: String,
      collapsed: Boolean,
      fonts: Array,
      propertyEditor: Array
    }
  }

  static get styles() {
    return [
      ScrollbarStyles,
      css`
        :host {
          border-left: 1px solid var(--paper-blue-grey-100);
          width: 270px;
          display: flex;
          flex-direction: column;
          background-color: var(--property-sidebar-background-color);
        }

        [tab] {
          display: flex;
          background-color: rgba(0, 0, 0, 0.08);
          opacity: 0.85;
        }

        [tab] mwc-icon {
          flex: 1;

          display: flex;
          align-items: center;
          justify-content: center;

          color: var(--property-sidebar-tab-icon-color);
          height: 40px;
        }

        [tab] [selected] {
          background-color: var(--property-sidebar-background-color);
          border-left: 1px solid rgba(255, 255, 255, 0.5);
          border-right: 1px solid rgba(0, 0, 0, 0.15);
          opacity: 1;
        }

        [content] {
          flex: 1;

          overflow: hidden;
          overflow-y: auto;
        }

        [content] > :not([active]) {
          display: none;
        }
      `
    ]
  }

  propertyTarget = null

  firstUpdated() {
    this.shadowRoot.addEventListener('property-change', this._onPropertyChanged.bind(this))
    this.shadowRoot.addEventListener('bounds-change', this._onBoundsChanged.bind(this))
  }

  updated(change) {
    change.has('scene') && this._onSceneChanged(this.scene)
    change.has('selected') && this._onSelectedChanged(this.selected)
    change.has('collapsed') && this._onCollapsed(this.collapsed)
  }

  render() {
    var tabIndex = this.tabIndex ? this.tabIndex : 'shape'

    return html`
      <div
        tab
        @click=${e => {
          this.tabIndex = e.target.getAttribute('name')
        }}
      >
        <mwc-icon name="shape" ?selected=${tabIndex == 'shape'}>format_shapes</mwc-icon>
        <mwc-icon name="style" ?selected=${tabIndex == 'style'}>palette</mwc-icon>
        <mwc-icon name="effect" ?selected=${tabIndex == 'effect'}>movie_filter</mwc-icon>
        <mwc-icon name="specific" ?selected=${tabIndex == 'specific'}>tune</mwc-icon>
        <mwc-icon name="data-binding" ?selected=${tabIndex == 'data-binding'}>share</mwc-icon>
        <mwc-icon name="inspector" ?selected=${tabIndex == 'inspector'}>visibility</mwc-icon>
      </div>

      <div content>
        ${html`
          ${{
            shape: html`
              <property-shape
                .value=${this.model}
                .bounds=${this.bounds}
                .selected=${this.selected}
                ?active=${tabIndex == 'shape'}
              >
              </property-shape>
            `,
            style: html`
              <property-style
                .value=${this.model}
                .selected=${this.selected}
                .fonts=${this.fonts}
                ?active=${tabIndex == 'style'}
              >
              </property-style>
            `,
            effect: html`
              <property-effect .value=${this.model} .scene=${this.scene} ?active=${tabIndex == 'effect'}>
              </property-effect>
            `,
            specific: html`
              <property-specific
                .value=${this.model}
                .scene=${this.scene}
                .selected=${this.selected}
                .props=${this.specificProps}
                .propertyEditor=${this.propertyEditor}
                ?active=${tabIndex == 'specific'}
              >
              </property-specific>
            `,
            'data-binding': html`
              <property-data-binding .scene=${this.scene} .value=${this.model} ?active=${tabIndex == 'data-binding'}>
              </property-data-binding>
            `,
            inspector: html`
              <scene-inspector .scene=${this.scene} ?active=${tabIndex == 'inspector'}></scene-inspector>
            `
          }[this.tabIndex]}
        `}
      </div>
    `
  }

  _onPropertyChanged(e) {
    var detail = e.detail

    if (this.propertyTarget) {
      /* 단일 컴포넌트의 경우에 적용 */
      this.scene && this.scene.undoableChange(() => this.propertyTarget.set(detail))
    } else {
      /* 여러 컴포넌트의 경우에 적용 */
      this.scene && this.scene.undoableChange(() => this.selected.forEach(component => component.set(detail)))
    }
  }

  _onBoundsChanged(e) {
    var detail = e.detail

    if (this.propertyTarget) {
      /* 단일 컴포넌트의 경우에 적용 */
      this.scene.undoableChange(() => {
        this.propertyTarget.bounds = {
          ...this.propertyTarget.bounds,
          ...detail
        }
      })
    } else {
      /* 여러 컴포넌트의 경우에 적용 */
      this.scene.undoableChange(() => {
        this.selected.forEach(component => {
          component.bounds = {
            ...component.bounds,
            ...detail
          }
        })
      })
    }
  }

  _onChangedByScene(after, before) {
    this.model = {
      ...this.model,
      ...after
    }
  }

  _setPropertyTargetAsDefault() {
    if (!this.scene) {
      this._setPropertyTarget(null)
      this.specificProps = []
      this.model = {}
      this.bounds = {}
    } else {
      this._setPropertyTarget(this.scene.root)
      this.specificProps = deepClone(this.scene.root.nature.properties)
      this.model = { ...this.propertyTarget.model }
      this._setBounds(this.propertyTarget.bounds)
    }
  }

  _onCollapsed(collapsed) {
    !collapsed && (this.style.display = '')

    this.animate(
      collapsed
        ? [{ transform: 'translateX(0)', opacity: 1, easing: 'ease-in' }, { transform: 'translateX(100%)', opacity: 1 }]
        : [
            { transform: 'translateX(100%)', opacity: 1 },
            { transform: 'translateX(0)', opacity: 1, easing: 'ease-out' }
          ],
      {
        duration: 500
      }
    ).onfinish = () => {
      collapsed && (this.style.display = 'none')
      dispatchEvent(new Event('resize'))
    }
  }

  async _onSceneChanged() {
    await this.renderComplete

    this._setPropertyTargetAsDefault()
  }

  async _onSelectedChanged(after, before) {
    await this.renderComplete

    if (after.length == 1) {
      this._setPropertyTarget(after[0])
      // 컴포넌트 특성 속성(specific properties)을 먼저 바꾸고, 모델을 바꾸어준다.
      // 컴포넌트 속성에 따라 UI 컴포넌트가 준비되고, 이후에 모델값을 보여주도록 하기 위해서이다.
      this.specificProps = deepClone(this.propertyTarget.nature.properties)
      this.model = {
        ...this.propertyTarget.model
      }
      this._setBounds(this.propertyTarget.bounds)
    } else if (after.length == 0) {
      // 선택이 안된 경우

      this._setPropertyTargetAsDefault()
    } else {
      // 다중 선택된 경우

      var type = after[0].model.type
      for (let i = 1; i < after.length; i++) {
        if (after[i].model.type != type) {
          type = undefined
          break
        }
      }

      this._setPropertyTarget(null)

      if (type) this.specificProps = deepClone(after[0].nature.properties)
      else this.specificProps = null

      this.model = {
        type: type,
        alpha: 1
      }
      this.bounds = {}
    }
  }

  _setPropertyTarget(newTarget) {
    var oldTarget = this.propertyTarget

    if (oldTarget) {
      oldTarget.off('change', this._onChangedByScene, this)
    }
    if (newTarget) {
      newTarget.on('change', this._onChangedByScene, this)
    }

    this.propertyTarget = newTarget
  }

  _setBounds(bounds) {
    this.bounds = {
      left: bounds.left,
      top: bounds.top,
      width: Math.round(bounds.width),
      height: Math.round(bounds.height)
    }
  }
}

customElements.define('property-sidebar', PropertySidebar)
