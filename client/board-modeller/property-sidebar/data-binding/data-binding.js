/**
 * @license Copyright © HatioLab Inc. All rights reserved.
 */

import { LitElement, html, css } from 'lit-element'

import '@things-factory/i18n-base'
import './data-binding-mapper'

import { PropertySharedStyle } from '../property-shared-style'

const PROPS = [
  '',
  'text',
  ['fillStyle', 'fill style'],
  ['strokeStyle', 'stroke style'],
  ['fontColor', 'font color'],
  'value',
  'data',
  'source',
  'started',
  'hidden',
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

class PropertyDataBinding extends LitElement {
  static get is() {
    return 'property-data-binding'
  }

  static get properties() {
    return {
      scene: Object,
      value: Object,
      mapping: Object,
      mappingIndex: Number
    }
  }

  static get styles() {
    return [
      PropertySharedStyle,
      css`
        paper-tabs {
          width: 229px;
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

        /*
        things-editor-color {
          -webkit-border-radius: 0px;
          -moz-border-radius: 0px;
          border-radius: 0px;
          border: 1px solid rgba(0, 0, 0, 0.15);
          font-size: 12px;
          font-weight: 300;
        }
        */

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
    this.value = {}
    this.mapping = {}
    this.mappingIndex = 0
  }

  firstUpdated() {
    this.shadowRoot.addEventListener('change', this._onValueChange.bind(this))
  }

  updated(change) {
    change.has('value') && this._onValueChanged(this.value)
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
        </div>
      </fieldset>

      <fieldset>
        <legend><i18n-msg msgid="label.value" auto>value</i18n-msg></legend>

        <things-editor-code value-key="data" .value=${this._getData(this.value.data)}> </things-editor-code>
      </fieldset>

      <fieldset>
        <legend><i18n-msg msgid="label.mapping" auto>Mapping</i18n-msg></legend>

        <paper-tabs
          @iron-select=${e => this._setMappingIndex(e.target.selected)}
          .selected=${this.mappingIndex}
          noink
          no-bar
        >
          <paper-tab data-mapping="1">1</paper-tab>
          <paper-tab data-mapping="2">2</paper-tab>
          <paper-tab data-mapping="3">3</paper-tab>
          <paper-tab data-mapping="4">4</paper-tab>
          <paper-tab data-mapping="5">5</paper-tab>
          <paper-tab data-mapping="6">6</paper-tab>
          <paper-tab data-mapping="7">7</paper-tab>
        </paper-tabs>

        <data-binding-mapper
          @value-change="${e => this._onMappingChanged(e)}"
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
  _resetMappingTaps() {
    var last = -1
    var mappings = this.value.mappings || []

    Array.from(this.shadowRoot.querySelectorAll('paper-tab[data-mapping]')).map((tab, i) => {
      if (mappings[i]) {
        tab.active = true
        tab.disabled = false
        tab.setAttribute('has-set', true)

        last = i
      } else {
        tab.active = false
        tab.removeAttribute('has-set')
        tab.disabled = last < i - 1
      }
    })
  }

  _setMappingIndex(idx) {
    this.mappingIndex = idx || 0

    this._resetMappingTaps()
  }

  _getData(data) {
    return typeof data !== 'object' ? data || '' : JSON.stringify(data, null, 1)
  }

  async _onValueChanged(value) {
    await this.renderComplete

    this._setMappingIndex(0)
  }

  _onValueChange(e) {
    var element = e.target
    var key = element.getAttribute('value-key')

    if (!key) {
      return
    }

    var value

    switch (element.tagName) {
      case 'THINGS-EDITOR-ANGLE-INPUT':
        value = Number(element.radian) || 0
        break

      case 'INPUT':
        switch (element.type) {
          case 'checkbox':
            value = element.checked
            break
          case 'number':
            value = Number(element.value) || 0
            break
          case 'text':
            value = String(element.value)
        }
        break

      case 'PAPER-BUTTON':
        value = element.active
        break

      case 'PAPER-LISTBOX':
        value = element.selected
        break

      default:
        value = element.value
        break
    }

    if (key == 'data') {
      try {
        value = JSON.parse(value)
      } catch (e) {}
    }

    this.dispatchEvent(
      new CustomEvent('property-change', {
        bubbles: true,
        composed: true,
        detail: {
          [key]: value
        }
      })
    )
  }

  _onMappingChanged(e) {
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

      this.dispatchEvent(
        new CustomEvent('property-change', {
          bubbles: true,
          composed: true,
          detail: {
            mappings: mappings.filter(function(m) {
              return !!m
            })
          }
        })
      )

      this._resetMappingTaps()
    } else {
      mappings[this.mappingIndex] = null

      this.dispatchEvent(
        new CustomEvent('property-change', {
          bubbles: true,
          composed: true,
          detail: {
            mappings: mappings.filter(function(m) {
              return !!m
            })
          }
        })
      )
    }
  }
}

customElements.define(PropertyDataBinding.is, PropertyDataBinding)
