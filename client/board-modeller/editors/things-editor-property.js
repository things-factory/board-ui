/**
 * @license Copyright © HatioLab Inc. All rights reserved.
 */

import { LitElement, html } from 'lit-element'

import '@things-factory/i18n-base'
import './things-editor-color'
import './things-editor-color-stops'
import './things-editor-multiple-color'
import './things-editor-angle-input'
import './things-editor-table'
import './things-editor-code'
import './things-editor-options'

import { ThingsEditorPropertyStyles } from './things-editor-property-styles'

export default class ThingsEditorProperty extends LitElement {
  static get is() {
    return 'things-editor-property'
  }

  static get properties() {
    return {
      value: Object,
      type: String,
      label: String,
      property: Object,
      _msgId: String
    }
  }

  static get styles() {
    return [ThingsEditorPropertyStyles]
  }

  connectedCallback() {
    super.connectedCallback()

    this.shadowRoot.addEventListener('change', this._valueChanged.bind(this))
  }

  editorTemplate(props) {
    return html``
  }

  render() {
    return html`
      ${this.editorTemplate(this)}
      ${this.label
        ? html`
            <label for="editor">
              <i18n-msg msgid=${this._computeLabelId(this.label)}>${this.label}</i18n-msg>
            </label>
          `
        : html``}
    `
  }

  get valueProperty() {
    return 'value'
  }

  _computeLabelId(label) {
    if (label.indexOf('label.') >= 0) return label

    return 'label.' + label
  }

  _valueChanged(e) {
    this.value = e.target[this.valueProperty]
    this.dispatchEvent(new CustomEvent('change', { bubbles: true, composed: true }))

    if (!this.observe) return
    this.observe.call(this, this.value)
  }
}

class PropertyEditorLegend extends ThingsEditorProperty {
  static get is() {
    return 'property-editor-legend'
  }

  static get styles() {
    return [ThingsEditorPropertyStyles]
  }

  editorTemplate(props) {
    return html`
      <legend>${props.property.label}</legend>
    `
  }
}

customElements.define(PropertyEditorLegend.is, PropertyEditorLegend)

class PropertyEditorNumber extends ThingsEditorProperty {
  static get is() {
    return 'property-editor-number'
  }

  static get styles() {
    return [ThingsEditorPropertyStyles]
  }

  editorTemplate(props) {
    return html`
      <input id="editor" type="number" .value=${props.value} />
    `
  }
}

customElements.define(PropertyEditorNumber.is, PropertyEditorNumber)

class PropertyEditorAngle extends ThingsEditorProperty {
  static get is() {
    return 'property-editor-angle'
  }

  static get styles() {
    return [ThingsEditorPropertyStyles]
  }

  get valueProperty() {
    return 'radian'
  }

  editorTemplate(props) {
    return html`
      <things-editor-angle-input
        id="editor"
        .radian=${props.value}
        placeholder=${props.placeholder || ''}
      ></things-editor-angle-input>
    `
  }
}

customElements.define(PropertyEditorAngle.is, PropertyEditorAngle)

class PropertyEditorString extends ThingsEditorProperty {
  static get is() {
    return 'property-editor-string'
  }

  static get styles() {
    return [ThingsEditorPropertyStyles]
  }

  editorTemplate(props) {
    return html`
      <input type="text" id="editor" .value=${props.value} placeholder=${props.placeholder || ''} />
    `
  }
}

customElements.define(PropertyEditorString.is, PropertyEditorString)

class PropertyEditorTextArea extends ThingsEditorProperty {
  static get is() {
    return 'property-editor-textarea'
  }

  static get styles() {
    return [ThingsEditorPropertyStyles]
  }

  editorTemplate(props) {
    return html`
      <things-editor-code id="editor" .value=${props.value} fullwidth> </things-editor-code>
    `
  }
}

customElements.define(PropertyEditorTextArea.is, PropertyEditorTextArea)

class PropertyEditorCheckbox extends ThingsEditorProperty {
  static get is() {
    return 'property-editor-checkbox'
  }

  static get styles() {
    return [ThingsEditorPropertyStyles]
  }

  get valueProperty() {
    return 'checked'
  }

  editorTemplate(props) {
    return html`
      <input type="checkbox" id="editor" .checked=${props.value} placeholder=${props.placeholder || ''} />
    `
  }
}

customElements.define(PropertyEditorCheckbox.is, PropertyEditorCheckbox)

class PropertyEditorSelect extends ThingsEditorProperty {
  static get is() {
    return 'property-editor-select'
  }

  static get styles() {
    return [ThingsEditorPropertyStyles]
  }

  editorTemplate(props) {
    return html`
      <select id="editor">
        ${props.property.options.map(
          item => html`
            <option value=${props._getOptionValue(item)} ?selected=${props._isSelected(props.value, item)}
              >${this._getOptionDisplay(item)}</option
            >
          `
        )}
      </select>
    `
  }

  _getOptionValue(item) {
    if (typeof item == 'string') return item

    return item.value
  }

  _getOptionDisplay(item) {
    if (typeof item == 'string') return item

    return item.display
  }

  _isSelected(value, item) {
    return value == this._getOptionValue(item)
  }
}

customElements.define(PropertyEditorSelect.is, PropertyEditorSelect)

class PropertyEditorColor extends ThingsEditorProperty {
  static get is() {
    return 'property-editor-color'
  }

  static get styles() {
    return [ThingsEditorPropertyStyles]
  }

  editorTemplate(props) {
    return html`
      <things-editor-color
        id="editor"
        .value=${props.value}
        placeholder=${props.placeholder || ''}
        .properties=${props.property}
      ></things-editor-color>
    `
  }
}

customElements.define(PropertyEditorColor.is, PropertyEditorColor)

class PropertyEditorSolidColorStops extends ThingsEditorProperty {
  static get is() {
    return 'property-editor-solid-colorstops'
  }

  static get styles() {
    return [ThingsEditorPropertyStyles]
  }

  editorTemplate(props) {
    return html`
      <things-editor-color-stops
        id="editor"
        type="solid"
        .value=${props.value}
        .min=${props.property && props.property.min}
        .max=${props.property && props.property.max}
        fullwidth
      >
      </things-editor-color-stops>
    `
  }
}

customElements.define(PropertyEditorSolidColorStops.is, PropertyEditorSolidColorStops)

class PropertyEditorGradientColorStops extends ThingsEditorProperty {
  static get is() {
    return 'property-editor-gradient-colorstops'
  }

  static get styles() {
    return [ThingsEditorPropertyStyles]
  }

  editorTemplate(props) {
    return html`
      <things-editor-color-stops
        id="editor"
        type="gradient"
        .value=${props.value}
        .min=${props.property && props.property.min}
        .max=${props.property && props.property.max}
        fullwidth
      >
      </things-editor-color-stops>
    `
  }
}

customElements.define(PropertyEditorGradientColorStops.is, PropertyEditorGradientColorStops)

class PropertyEditorMultipleColor extends ThingsEditorProperty {
  static get is() {
    return 'property-editor-multiple-color'
  }

  static get styles() {
    return [ThingsEditorPropertyStyles]
  }

  get valueProperty() {
    return 'values'
  }

  editorTemplate(props) {
    return html`
      <things-editor-multiple-color id="editor" .values=${props.value}></things-editor-multiple-color>
    `
  }
}

customElements.define(PropertyEditorMultipleColor.is, PropertyEditorMultipleColor)

class PropertyEditorImageSelector extends ThingsEditorProperty {
  static get is() {
    return 'property-editor-image-selector'
  }

  static get styles() {
    return [ThingsEditorPropertyStyles]
  }

  editorTemplate(props) {
    return html`
      <input type="text" id="editor" .value=${props.value} />
    `
  }
}

customElements.define(PropertyEditorImageSelector.is, PropertyEditorImageSelector)

class PropertyEditorDate extends ThingsEditorProperty {
  static get is() {
    return 'property-editor-date'
  }

  static get styles() {
    return [ThingsEditorPropertyStyles]
  }

  editorTemplate(props) {
    return html`
      <input type="date" id="editor" .value=${props.value} />
    `
  }
}

customElements.define(PropertyEditorDate.is, PropertyEditorDate)

class PropertyEditorOptions extends ThingsEditorProperty {
  static get is() {
    return 'property-editor-options'
  }

  static get styles() {
    return [ThingsEditorPropertyStyles]
  }

  get valueProperty() {
    return 'options'
  }

  editorTemplate(props) {
    return html`
      <things-editor-options id="editor" .options=${props.value} fullwidth></things-editor-options>
    `
  }
}

customElements.define(PropertyEditorOptions.is, PropertyEditorOptions)

class PropertyEditorTable extends ThingsEditorProperty {
  static get is() {
    return 'property-editor-table'
  }

  static get styles() {
    return [ThingsEditorPropertyStyles]
  }

  editorTemplate(props) {
    return html`
      <things-editor-table id="editor" .property=${props.property} fullwidth></things-editor-table>
    `
  }
}

customElements.define(PropertyEditorTable.is, PropertyEditorTable)
