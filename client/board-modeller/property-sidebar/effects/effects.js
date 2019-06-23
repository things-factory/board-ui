/**
 * @license Copyright © HatioLab Inc. All rights reserved.
 */

import { LitElement, html } from 'lit-element'

import '@things-factory/i18n-base'

import './property-shadow'
import './property-event'
import './property-animations'

import { PropertySharedStyle } from '../property-shared-style'

class PropertyEffects extends LitElement {
  static get properties() {
    return {
      value: Object,
      scene: Object
    }
  }

  static get styles() {
    return [PropertySharedStyle]
  }

  constructor() {
    super()

    this.value = {}
  }

  firstUpdated() {
    this.shadowRoot.addEventListener('change', this._onValueChange.bind(this))
  }

  render() {
    return html`
      <fieldset>
        <legend><i18n-msg msgid="label.shadow">shadow</i18n-msg></legend>

        <property-shadow value-key="shadow" .value=${this.value.shadow || {}}> </property-shadow>
      </fieldset>

      <fieldset>
        <legend><i18n-msg msgid="label.retention">retention</i18n-msg></legend>

        <div class="property-grid">
          <label> <i18n-msg msgid="label.retention">retention</i18n-msg> </label>
          <input type="number" value-key="retention" .value=${this.value.retention} placeholder="ms" />
        </div>
      </fieldset>

      <property-animations value-key="animation" .value=${this.value.animation || {}}> </property-animations>

      <property-event value-key="event" .scene=${this.scene} .value=${this.value.event || {}}> </property-event>
    `
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
}

customElements.define('property-effect', PropertyEffects)
