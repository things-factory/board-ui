/**
 * @license Copyright © HatioLab Inc. All rights reserved.
 */

import '@things-factory/i18n-base'
import { css, html } from 'lit-element'
import { AbstractProperty } from '../abstract-property'
import { PropertySharedStyle } from '../property-shared-style'
import './data-binding-mapper'

const PROPS = [
  '',
  'text',
  ['fillStyle', 'fill style'],
  ['strokeStyle', 'stroke style'],
  ['fontColor', 'font color'],
  'value',
  'data',
  'source',
  'hidden',
  'started',
  'play',
  ['ref', 'reference'],
  'options',
  'rotate',
  'scale',
  'translate',
  'dimension',
  'location',
  'accessor'
].map(prop => {
  return typeof prop == 'string' ? { name: prop, label: prop } : { name: prop[0], label: prop[1] }
})

class PropertyDataBinding extends AbstractProperty {
  static get is() {
    return 'property-data-binding'
  }

  static get properties() {
    return {
      scene: Object,
      value: Object,
      mapping: Object,
      mappingIndex: Number,
      _afterRender: Function
    }
  }

  static get styles() {
    return [
      PropertySharedStyle,
      css`
        #tab-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        #tab-header > paper-icon-button {
          padding: 0px;
          width: 25px;
          height: 25px;
        }

        paper-tabs {
          flex: 1;
          height: 25px;
          border: 1px solid rgba(0, 0, 0, 0.2);
          border-width: 1px 1px 0 1px;
        }

        paper-tab {
          background-color: rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(0, 0, 0, 0.07);
          border-width: 0 1px 0 0;
          padding: 0 5px;
          color: #fff;
          font-size: 13px;
          max-width: 25px;
          min-width: 25px;
        }

        paper-tab[disabled] {
          background-color: rgba(0, 0, 0, 0.1);
        }

        paper-tab:last-child {
          border-width: 0;
        }

        paper-tab.iron-selected {
          background-color: rgba(255, 255, 255, 0.5);
          color: #585858;
        }

        [has-set]::before {
          content: '';
          position: relative;
          left: 3px;
          width: 5px;
          height: 5px;
          display: inline-block;
          border-radius: 50%;
          background-color: #4caf50;
        }

        things-editor-code {
          max-width: 260px;
          height: 300px;
          overflow: auto;
        }

        data-binding-mapper {
          --things-select: {
            min-width: 50%;
            margin-bottom: 10px;
            padding: 3px 20px 2px 5px;
            -webkit-border-radius: 4px;
            -moz-border-radius: 4px;
            border-radius: 4px;
            border: 1px solid rgba(0, 0, 0, 0.15);
            font-size: 15px;
            font-weight: 300;
            -webkit-appearance: none;
          }
        }
      `
    ]
  }

  constructor() {
    super()
    this.scene = null
    this.value = {
      mappings: []
    }
    this.mapping = {}
    this.mappingIndex = 0
  }

  get mappings() {
    return this.value.mappings || []
  }

  firstUpdated() {
    this.renderRoot.addEventListener('change', this._onValueChange.bind(this))

    this.tabContainer.addEventListener('scroll', e => {
      this._onTabScroll(e)
    })
  }

  updated(change) {
    if (change.has('value')) {
      this._onValueChanged(this.value)
    }
  }

  render() {
    return html`
      <fieldset>
        <div class="property-grid">
          <label> <i18n-msg msgid="label.id" auto>ID</i18n-msg> </label>
          <input value-key="id" .value=${this.value.id || ''} />

          <label> <i18n-msg msgid="label.class" auto>Class</i18n-msg> </label>
          <input value-key="class" .value=${this.value.class || ''} />

          <label> <i18n-msg msgid="label.template-prefix" auto>Template Prefix</i18n-msg> </label>
          <input value-key="templatePrefix" .value=${this.value.templatePrefix || ''} />

          <div class="checkbox-row">
            <input type="checkbox" value-key="ndns" .checked=${this.value.ndns} />
            <label> <i18n-msg msgid="label.ndns" auto>No Data No Show</i18n-msg> </label>
          </div>
        </div>
      </fieldset>

      <fieldset>
        <legend><i18n-msg msgid="label.value" auto>value</i18n-msg></legend>

        <things-editor-code value-key="data" .value=${this._getData(this.value.data)}> </things-editor-code>
      </fieldset>

      <fieldset>
        <legend><i18n-msg msgid="label.mapping" auto>Mapping</i18n-msg></legend>
        <div id="tab-header">
          <paper-icon-button
            id="tab-nav-left-button"
            icon="chevron-left"
            @click=${e => {
              this._onTabScrollNavLeft(e)
            }}
            disabled
          ></paper-icon-button>
          <paper-tabs
            id="tabs"
            @iron-select=${e => this._setMappingIndex(e.target.selected)}
            .selected=${this.mappingIndex}
            noink
            no-bar
            scrollable
            hide-scroll-buttons
            fit-container
          >
            ${this.mappings.map(
              (m, i) =>
                html`
                  <paper-tab data-mapping="${i + 1}">${i + 1}</paper-tab>
                `
            )}
            <paper-tab data-mapping="${this.mappings.length + 1}">${this.mappings.length + 1}</paper-tab>
          </paper-tabs>
          <paper-icon-button
            id="tab-nav-right-button"
            icon="chevron-right"
            @click=${e => {
              this._onTabScrollNavRight(e)
            }}
            disabled
          ></paper-icon-button>
        </div>

        <data-binding-mapper
          @value-change="${e => this._onMappingChanged(e)}"
          .scene=${this.scene}
          .mapping=${(this.value.mappings && this.value.mappings[this.mappingIndex]) || {}}
          .properties=${PROPS}
        >
        </data-binding-mapper>
      </fieldset>
    `
  }

  /**
   * mappings 편집의 변화에 반응하여 mapping 탭의 active 여부를 갱신한다.
   */
  _resetMappingTabs() {
    var last = -1
    var mappings = this.value.mappings || []

    Array.from(this.renderRoot.querySelectorAll('paper-tab[data-mapping]')).map((tab, i) => {
      if (mappings[i]) {
        tab.active = true
        tab.setAttribute('has-set', true)

        last = i
      } else {
        tab.active = false
        tab.removeAttribute('has-set')
      }
    })

    this._onTabScroll()
  }

  _setMappingIndex(idx) {
    this.mappingIndex = isNaN(Number(idx)) ? 0 : Number(idx)

    this._resetMappingTabs()
  }

  _getData(data) {
    return typeof data !== 'object' ? data || '' : JSON.stringify(data, null, 1)
  }

  async _onValueChanged(value) {
    await this.renderComplete

    if (this._afterRender) {
      this._afterRender()
    } else {
      this._setMappingIndex(0)
    }

    this._afterRender = null
  }

  _onValueChange(e) {
    var element = e.target
    var key = element.getAttribute('value-key')

    var value = this._getValueFromEventTarget(element)

    if (!key) {
      return
    }

    if (key == 'data') {
      try {
        value = JSON.parse(value)
      } catch (e) {}
    }

    this.value = {
      ...this.value,
      [key]: value
    }

    this._onAfterValueChange(key, value)
  }

  get tabContainer() {
    return this.renderRoot.querySelector('#tabs').shadowRoot.querySelector('#tabsContainer')
  }

  async _onMappingChanged(e) {
    var mapping = e.target.mapping

    /* data spread target의 변경이 있는 경우, target 컴포넌트들의 태그를 블링크 시킨다 */
    if (mapping && mapping.target) {
      this.scene &&
        this.scene.findAll(mapping.target, this.scene.selected && this.scene.selected[0]).forEach((c, i) => {
          if (i == 0) c.trigger('tagreset')
          c.trigger('tag', {})
        })
    }

    /* mapping의 모든 속성이 편집되면, 모델에 반영한다. */
    var mappings = [...(this.value.mappings || [])]

    if (mapping.target && mapping.property && mapping.rule) {
      mappings[this.mappingIndex] = mapping

      var mappingIdx = this.mappingIndex
      this._afterRender = () => {
        this._setMappingIndex(mappingIdx)
        this.tabContainer.scrollLeft = this.tabContainer.scrollWidth
      }

      this.dispatchEvent(
        new CustomEvent('property-change', {
          bubbles: true,
          composed: true,
          detail: {
            mappings: mappings.filter(m => !!m)
          }
        })
      )

      await this.requestUpdate()
    } else if (!mapping.target && !mapping.property) {
      // accessor를 입력중인 경우 tabIndex Change 방지
      if (e.detail && e.detail.changed && !e.detail.changed.accessor) {
        mappings[this.mappingIndex] = null
        var nextMappingIdx = Math.max(this.mappingIndex - 1, 0)
        this._afterRender = () => {
          this._setMappingIndex(nextMappingIdx)
        }
        this.dispatchEvent(
          new CustomEvent('property-change', {
            bubbles: true,
            composed: true,
            detail: {
              mappings: mappings.filter(m => !!m)
            }
          })
        )
      }
    }
  }

  _onTabScroll(e) {
    var tabNavLeftButton = this.renderRoot.querySelector('#tab-nav-left-button')
    var tabNavRightButton = this.renderRoot.querySelector('#tab-nav-right-button')

    if (this.tabContainer.clientWidth == this.tabContainer.scrollWidth) {
      tabNavLeftButton.disabled = true
      tabNavRightButton.disabled = true
    }
    // left-end
    else if (this.tabContainer.scrollLeft == 0) {
      tabNavLeftButton.disabled = true
      tabNavRightButton.disabled = false
    }
    // right-end
    else if (this.tabContainer.scrollLeft + this.tabContainer.clientWidth >= this.tabContainer.scrollWidth) {
      tabNavLeftButton.disabled = false
      tabNavRightButton.disabled = true
    } else {
      tabNavLeftButton.disabled = false
      tabNavRightButton.disabled = false
    }
  }

  _onTabScrollNavLeft(e) {
    this.tabContainer.style.scrollBehavior = 'smooth'
    this.tabContainer.scrollLeft -= this.tabContainer.clientWidth
    this.tabContainer.style.scrollBehavior = 'auto'
  }

  _onTabScrollNavRight(e) {
    this.tabContainer.style.scrollBehavior = 'smooth'
    this.tabContainer.scrollLeft += this.tabContainer.clientWidth
    this.tabContainer.style.scrollBehavior = 'auto'
  }
}

customElements.define('property-data-binding', PropertyDataBinding)
