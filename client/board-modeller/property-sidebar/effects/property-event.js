/**
 * @license Copyright © HatioLab Inc. All rights reserved.
 */

import { LitElement, html } from 'lit-element'

import '@things-factory/i18n-base'
import './property-event-hover'
import './property-event-tap'

import { PropertySharedStyle } from '../property-shared-style'

class PropertyEvent extends LitElement {
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
        <legend><i18n-msg msgid="label.hover-event">hover event</i18n-msg></legend>

        <property-event-hover value-key="hover" .scene=${this.scene} .value=${this.value.hover || {}}>
        </property-event-hover>
      </fieldset>

      <fieldset>
        <legend><i18n-msg msgid="label.tap-event">tap event</i18n-msg></legend>

        <property-event-tap value-key="tap" .scene=${this.scene} .value=${this.value.tap || {}}> </property-event-tap>
      </fieldset>
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

    this.value = {
      ...this.value,
      [key]: value
    }

    this.dispatchEvent(new CustomEvent('change', { bubbles: true, composed: true }))
  }
}

customElements.define('property-event', PropertyEvent)
