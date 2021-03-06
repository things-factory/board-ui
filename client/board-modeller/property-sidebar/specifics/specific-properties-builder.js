/**
 * @license Copyright © HatioLab Inc. All rights reserved.
 */

import { LitElement } from 'lit-element'
import '@things-factory/modeller-ui/client/editors/things-editor-property'

/**
모든 에디터들은 change 이벤트를 지원해야 한다. 또한, 모든 에디터들은 value속성에 값을 가져야 한다.

Example:

    <specific-properties-builder value="{{value}}">
      <label>Center X</label>
      <input type="number" .value="${value.cx}">
      <label>Width</label>
      <input type="number" .value="${value.width}">
    </specific-properties-builder>
*/

const DEFAULT_VALUE = {
  legend: '',
  number: 0,
  angle: 0,
  string: '',
  password: '',
  textarea: '',
  checkbox: false,
  select: '',
  color: '#000000',
  'solidcolor-stops': null,
  'gradientcolor-stops': null,
  'gltf-selector': '',
  'image-selector': '',
  multiplecolor: null,
  editortable: null,
  imageselector: '',
  options: null,
  date: null
}

function convertValue(type, value) {
  var converted = String(value).trim() == '' ? undefined : value
  switch (type) {
    case 'number':
    case 'angle':
      converted = parseFloat(value)
      converted = converted == NaN ? undefined : converted
      break
  }

  return converted
}

class SpecificPropertiesBuilder extends LitElement {
  static get is() {
    return 'specific-properties-builder'
  }

  static get properties() {
    return {
      value: Object,
      props: Array,
      propertyEditor: Object
    }
  }

  constructor() {
    super()

    this.props = []
  }

  firstUpdated() {
    this.renderRoot.addEventListener('change', this._onValueChanged.bind(this))
  }

  updated(change) {
    change.has('props') && this._onPropsChanged(this.props)
    change.has('value') && this._setValues()
  }

  _onPropsChanged(props) {
    this.renderRoot.textContent = ''
    ;(props || []).forEach(prop => {
      let elementType = this.propertyEditor[prop.type]
      if (!elementType) {
        console.warn('Property Editor not defined', prop.type)
        return
      }
      let element = document.createElement(elementType)

      element.label = prop.label
      element.type = prop.type
      element.placeholder = prop.placeholder
      element.setAttribute('name', prop.name)

      if (prop.observe) {
        element.observe = prop.observe
      }
      element.property = prop.property
      element.setAttribute('property-editor', true)

      this.renderRoot.appendChild(element)
    })
  }

  _setValues() {
    this.value &&
      Array.from(this.renderRoot.querySelectorAll('[name]')).forEach(prop => {
        let name = prop.getAttribute('name')
        var convertedValue = convertValue(prop.type, this.value[name])
        if (convertedValue == undefined) convertedValue = DEFAULT_VALUE[prop.type]
        prop.value = convertedValue
      })
  }

  _onValueChanged(e) {
    e.stopPropagation()
    var prop = e.target

    while (prop && !prop.hasAttribute('property-editor')) {
      prop = prop.parentNode
    }

    if (!prop || !prop.hasAttribute('property-editor')) {
      return
    }

    var name = prop.getAttribute('name')
    this.value[name] = prop.value
    this._setValues()

    this.dispatchEvent(
      new CustomEvent('property-change', {
        bubbles: true,
        composed: true,
        detail: {
          [name]: prop.value
        }
      })
    )
  }
}

customElements.define(SpecificPropertiesBuilder.is, SpecificPropertiesBuilder)
