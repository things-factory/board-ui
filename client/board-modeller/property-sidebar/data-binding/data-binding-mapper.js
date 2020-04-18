/**
 * @license Copyright © HatioLab Inc. All rights reserved.
 */

import { LitElement, html, css } from 'lit-element'

import '@polymer/paper-radio-button/paper-radio-button'
import '@polymer/paper-radio-group/paper-radio-group'

import '@things-factory/i18n-base'
import '@things-factory/modeller-ui/client/editors/things-editor-code'
import '@things-factory/modeller-ui/client/editors/things-editor-value-map'
import '@things-factory/modeller-ui/client/editors/things-editor-value-range'

/**
element for mapping data value editing

Example:

  <data-binding-mapper mapping=${mapping}>
  </data-binding-mapper>
*/
export default class DataBindingMapper extends LitElement {
  static get is() {
    return 'data-binding-mapper'
  }

  static get properties() {
    return {
      mapping: Object,
      rule: Object,
      properties: Array,
      scene: Object,
      _valueTypes: Object,
      _componentIds: Array
    }
  }

  static get styles() {
    return [
      css`
        :host {
          display: block;
          background-color: rgba(255, 255, 255, 0.5);
          overflow: hidden;
          padding: 7px 0 0 0;
          border: 1px solid rgba(0, 0, 0, 0.2);
          border-width: 0 1px 1px 1px;
          padding: 4px;

          display: grid;
          grid-template-columns: repeat(10, 1fr);
          grid-gap: 4px;
          grid-auto-rows: minmax(24px, auto);
        }

        label {
          grid-column: span 3;
          text-align: right;
          text-transform: capitalize;
        }

        input,
        select,
        paper-radio-group {
          grid-column: span 7;
        }

        select {
          height: 22px;
          border-color: lightgray;
        }

        [rule-editors] {
          grid-column: span 10;

          display: 'flex';
          align-content: auto;
        }

        [rule-editors] :not([active]) {
          display: none;
        }

        paper-radio-button {
          padding: 2px 1px 2px 4px !important;
        }

        things-editor-code {
          height: 300px;
          overflow: auto;
        }
      `
    ]
  }

  constructor() {
    super()
    this.mapping = {
      rule: 'value'
    }
    this.rule = {}
    this.properties = []

    this._valueTypes = {
      play: 'boolean',
      hidden: 'boolean',
      started: 'boolean',

      rotation: 'number',
      value: 'number',

      fillStyle: 'color',
      strokeStyle: 'color',
      fontColor: 'color',

      data: 'object',
      source: 'object',
      location: 'object',
      dimension: 'object',

      text: 'string',
      ref: 'string'
    }

    this._componentIds = []
  }

  firstUpdated() {
    this.renderRoot.addEventListener('change', e => this._onChange(e))
  }

  updated(change) {
    change.has('mapping') && this._onChangedMapping(this.mapping)
  }

  render() {
    return html`
      <label> <i18n-msg msgid="label.accessor">accessor</i18n-msg> </label>
      <input value-key="accessor" type="text" data-mapping-accessor .value=${this.mapping.accessor || ''} />

      <label> <i18n-msg msgid="label.target">target</i18n-msg> </label>

      <input
        id="target-input"
        type="text"
        value-key="target"
        list="target-list"
        .value=${this.mapping.target || ''}
        @focusin=${e => {
          if (!this.scene) this._componentIds = []
          this._componentIds = this.scene.ids.map(info => info.key).filter(id => !!id)
        }}
      />
      <datalist id="target-list">
        <option value="(self)"></option>
        <option value="(key)"></option>
        ${this._componentIds.length
          ? html` ${this._componentIds.map(id => html` <option value=${id}></option> `)} `
          : html``}
      </datalist>

      <label> <i18n-msg msgid="label.property">property</i18n-msg> </label>
      <select value-key="property" .value=${this.mapping.property}>
        ${this.properties.map(
          item =>
            html` <option .value=${item.name} ?selected=${item.name == this.mapping.property}>${item.label}</option> `
        )}
      </select>

      <label> <i18n-msg msgid="label.rule-type">rule type</i18n-msg> </label>
      <paper-radio-group
        @paper-radio-group-changed=${e => this._onChangeRule(e)}
        .selected=${this.mapping.rule || 'value'}
      >
        <paper-radio-button name="value">
          <i18n-msg msgid="label.value">value</i18n-msg>
        </paper-radio-button>
        <paper-radio-button name="map"> <i18n-msg msgid="label.map">map</i18n-msg> </paper-radio-button>
        <paper-radio-button name="range">
          <i18n-msg msgid="label.range">range</i18n-msg>
        </paper-radio-button>
        <paper-radio-button name="eval">
          <i18n-msg msgid="label.eval">eval</i18n-msg>
        </paper-radio-button>
      </paper-radio-group>

      <div rule-editors class="content">
        <things-editor-value-map
          value-key="map"
          .value=${this.rule.map || {}}
          .valuetype=${this._valuetype(this.mapping.property)}
          ?active=${this.mapping.rule == 'map'}
        >
        </things-editor-value-map>

        <things-editor-value-range
          value-key="range"
          .value=${this.rule.range || []}
          .valuetype=${this._valuetype(this.mapping.property)}
          ?active=${this.mapping.rule == 'range'}
        >
        </things-editor-value-range>

        <things-editor-code
          value-key="eval"
          id="eval-editor"
          .value=${this.rule.eval || ''}
          ?active=${this.mapping.rule == 'eval'}
        >
        </things-editor-code>
      </div>
    `
  }

  _valuetype(property) {
    return this._valueTypes[property] || 'string'
  }

  async _onChangedMapping(change) {
    if (this._keep_saved_rule_params) {
      this._keep_saved_rule_params = false
    } else {
      await this.renderComplete

      var rule = {}

      if (this.mapping) {
        switch (this.mapping.rule) {
          case 'map':
            rule.map = this.mapping.param || {}
            break
          case 'range':
            rule.range = this.mapping.param || []
            break
          case 'eval':
            rule.eval = this.mapping.param || ''
            break
          default:
            this.mapping.rule = 'value'
            break
        }
      }

      this.rule = rule
      this.requestUpdate()
    }
  }

  _onChangeRule(e) {
    /* [주의]
    paper-radio-group의 on-selected-changed 이벤트를 사용하면, cyclic 이 발생할 수 있으므로,
    사용자의 액션에 의한 이벤트인 on-click 이벤트를 사용한다.
    */
    var element = e.target
    var value = element.selected

    let param

    switch (value) {
      case 'map':
        param = this.rule.map
        break
      case 'range':
        param = this.rule.range
        break
      case 'eval':
        param = this.rule.eval || ''

        let editor = this.renderRoot.querySelector('#eval-editor')
        // rule.eval에 값이 없을 때, ace-editor 내용이 초기화되지 않는 문제때문에 처리함.
        if (!param) {
          editor.value = 'return'
        }
        break
      default:
    }

    this.mapping = {
      ...this.mapping,
      rule: value,
      param
    }

    this._keep_saved_rule_params = true
    this.dispatchEvent(new CustomEvent('value-change', { bubbles: true, composed: true }))
  }

  _onChange(e) {
    var element = e.target
    var key = element.getAttribute('value-key')

    if (!key) return

    var value = element.value

    if (key == 'target') {
      if (value.length > 0 && !/^[.#(\[]/.test(value)) {
        value = '#' + value.trim()

        this.renderRoot.querySelector('#target-input').value = value
      }

      this.mapping = {
        ...this.mapping,
        target: value
      }
    } else if (key == 'accessor') {
      this.mapping = {
        ...this.mapping,
        accessor: (value || '').trim()
      }
    } else if (key == 'property') {
      this.mapping = {
        ...this.mapping,
        property: (value || '').trim()
      }
    } else if (key == 'map' || key == 'range' || key == 'eval') {
      this.rule[key] = value
      this.mapping = {
        ...this.mapping,
        param: value
      }
    }

    if (!this.mapping.rule) this.mapping.rule = 'value'

    this._keep_saved_rule_params = true
    this.dispatchEvent(
      new CustomEvent('value-change', {
        bubbles: true,
        composed: true,
        detail: {
          changed: {
            [key]: value
          }
        }
      })
    )
  }
}

customElements.define(DataBindingMapper.is, DataBindingMapper)
