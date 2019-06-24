/**
 * @license Copyright © HatioLab Inc. All rights reserved.
 */

import { LitElement, html, css } from 'lit-element'

import '@material/mwc-icon'

import '@polymer/paper-tabs/paper-tabs'

import { ScrollbarStyles } from '@things-factory/shell'

import './shapes/shapes'
import './styles/styles'
import './effects/effects'
import './specifics/specifics'
import './data-binding/data-binding'

class PropertySidebar extends LitElement {
  constructor() {
    super()

    this.scene = null
    this.bounds = {}
    this.model = {}
    this.selected = []
    this.specificProps = []
    this.tabIndex = 0
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
      tabIndex: Number,
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
          background-color: var(--paper-blue-grey-50);
        }

        paper-tabs {
          background-color: rgba(0, 0, 0, 0.08);
          max-height: 40px;
        }

        paper-tab.iron-selected {
          background-color: var(--paper-blue-grey-50);
          border-right: 1px solid rgba(0, 0, 0, 0.1);
        }

        paper-tabs mwc-icon {
          color: var(--primary-color);
        }

        iron-pages {
          overflow: hidden;
          overflow-y: auto;

          flex: 1;
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
    return html`
      <paper-tabs @selected-changed=${e => (this.tabIndex = e.target.selected)} .selected=${this.tabIndex} noink no-bar>
        <paper-tab> <mwc-icon>format_shapes</mwc-icon> </paper-tab>
        <paper-tab> <mwc-icon>palette</mwc-icon> </paper-tab>
        <paper-tab> <mwc-icon>movie_filter</mwc-icon> </paper-tab>
        <paper-tab> <mwc-icon>tune</mwc-icon> </paper-tab>
        <paper-tab> <mwc-icon>share</mwc-icon> </paper-tab>
      </paper-tabs>

      <iron-pages .selected="${this.tabIndex}">
        <property-shape .value=${this.model} .bounds=${this.bounds} .selected=${this.selected}> </property-shape>

        <property-style .value=${this.model} .selected=${this.selected} .fonts=${this.fonts}> </property-style>

        <property-effect .value=${this.model} .scene=${this.scene}> </property-effect>

        <property-specific
          .value=${this.model}
          .scene=${this.scene}
          .selected=${this.selected}
          .props=${this.specificProps}
          .propertyEditor=${this.propertyEditor}
        >
        </property-specific>

        <property-data-binding .scene=${this.scene} .value=${this.model}> </property-data-binding>
      </iron-pages>
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
    for (var property in after) {
      if (property) this.model[property] = after[property]
    }

    // this.model = JSON.parse(JSON.stringify(this.model))

    /*
     * this.model의 내부 속성만 변경되기 때문에,
     * property-specific의 변경을 위해서 rerender()를 호출해서, 강제로 갱신하도록 한다.
     */
    this.shadowRoot.querySelector('property-specific').rerender()
    this.propertyTarget && this._setBounds(this.propertyTarget.bounds)
  }

  _setPropertyTargetAsDefault() {
    if (!this.scene) {
      this._setPropertyTarget(null)
      this.specificProps = []
      this.model = {}
      this.bounds = {}
    } else {
      this._setPropertyTarget(this.scene.root)
      this.specificProps = JSON.parse(JSON.stringify(this.scene.root.nature.properties))
      this.model = JSON.parse(JSON.stringify(this.propertyTarget.model))
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
      this.specificProps = JSON.parse(JSON.stringify(this.propertyTarget.nature.properties))
      this.model = JSON.parse(JSON.stringify(this.propertyTarget.model))
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

      if (type) this.specificProps = JSON.parse(JSON.stringify(after[0].nature.properties))
      else this.specificProps = null

      this.model = {
        type: type,
        alpha: 1
      }
      this.bounds = {}
    }
  }

  _setPropertyTarget(newTarget) {
    var oldTarget = this.target

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
