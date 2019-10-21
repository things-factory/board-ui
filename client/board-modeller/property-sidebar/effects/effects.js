/**
 * @license Copyright © HatioLab Inc. All rights reserved.
 */

import '@things-factory/i18n-base'
import { html } from 'lit-element'
import { AbstractProperty } from '../abstract-property'
import { PropertySharedStyle } from '../property-shared-style'
import './property-animations'
import './property-event'
import './property-shadow'

class PropertyEffects extends AbstractProperty {
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
    this.renderRoot.addEventListener('change', this._onValueChange.bind(this))
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
}

customElements.define('property-effect', PropertyEffects)
