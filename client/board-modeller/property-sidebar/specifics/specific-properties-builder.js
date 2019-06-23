/**
 * @license Copyright © HatioLab Inc. All rights reserved.
 */

import { LitElement } from 'lit-element'
import '../../editors/things-editor-property'

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
  textarea: '',
  checkbox: false,
  select: '',
  color: '#000000',
  'solidcolor-stops': null,
  'gradientcolor-stops': null,
  multiplecolor: null,
  editortable: null,
  imageselector: '',
  options: null,
  date: null
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
    this.shadowRoot.addEventListener('change', this._onValueChanged.bind(this))
  }

  updated(change) {
    change.has('props') && this._onPropsChanged(this.props)
    change.has('value') && this._setValues()
  }

  stateChanged(state) {
    this.propertyEditor = state.propertyEditor
  }

  _onPropsChanged(props) {
    this.shadowRoot.textContent = ''
    ;(props || []).forEach(prop => {
      let elementType = this.propertyEditor[prop.type]
      if (!elementType) {
        console.warn('Property Editor not defined', prop.type)
        return
      }
      let element = document.createElement(elementType)

      element.label = prop.label
      element.type = prop.type
      element.setAttribute('name', prop.name)
      prop.placeholder = prop.placeholder
      if (prop.observe) {
        element.observe = prop.observe
      }
      element.property = prop.property
      element.setAttribute('property-editor', true)

      this.shadowRoot.appendChild(element)
    })
  }

  _setValues() {
    this.value &&
      Array.from(this.shadowRoot.querySelectorAll('[name]')).forEach(prop => {
        let name = prop.getAttribute('name')
        prop.value = this.value[name] || DEFAULT_VALUE[prop.type]
      })
  }

  _onValueChanged(e) {
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
