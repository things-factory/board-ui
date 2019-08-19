/**
 * @license Copyright © HatioLab Inc. All rights reserved.
 */

import { LitElement, html } from 'lit-element'

import '@things-factory/i18n-base'

import { EffectsSharedStyle } from './effects-shared-style'

class PropertyEventHover extends LitElement {
  static get properties() {
    return {
      value: Object,
      scene: Object
    }
  }

  static get styles() {
    return [EffectsSharedStyle]
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
      <input type="checkbox" value-key="emphasize" .checked=${this.value.emphasize} />
      <label class="checkbox-label"> <i18n-msg msgid="label.emphasize">emphasize</i18n-msg> </label>

      <label> <i18n-msg msgid="label.action">action</i18n-msg> </label>
      <select id="tap-select" value-key="action" .value=${this.value.action || ''}>
        <option value=""></option>
        <option value="popup">popup target board</option>
        <option value="infoWindow">open infowindow</option>
        <option value="data-toggle">toggle(true/false) target component data </option>
        <option value="data-tristate">tristate(0/1/2) target component data </option>
        <option value="data-set">set value to target component data</option>
        <option value="data-toggle">toggle(true/false) target component data </option>
        <option value="data-tristate">tristate(0/1/2) target component data </option>
        <option value="data-set">set value to target component data</option>
        <option value="value-set">set value to target component value</option>
      </select>

      <label> <i18n-msg msgid="label.target">target</i18n-msg> </label>

      <input
        value-key="target"
        .value=${this.value.target || ''}
        list="target-list"
        .placeholder="${this._getPlaceHoder(this.value.action)}"
      />

      <datalist id="target-list">
        ${this._getTargetList(this.value.action).map(
          item => html`
            <option .value=${item}></option>
          `
        )}
      </datalist>

      ${this.value.action == 'data-set' || this.value.action == 'value-set'
        ? html`
            <label> <i18n-msg msgid="label.value">value</i18n-msg> </label>
            <input value-key="value" .value=${this.value.value || ''} />
          `
        : html``}

      <input type="checkbox" value-key="restore" .checked=${this.value.restore} />
      <label class="checkbox-label">
        <i18n-msg msgid="label.restore-on-leave">restore on leave</i18n-msg>
      </label>
    `
  }

  _getPlaceHoder(action) {
    switch (action) {
      case 'popup':
      case 'goto':
        return 'SCENE-100'
      case 'link-open':
      case 'link-move':
        return 'http://www.hatiolab.com/'
      default:
        return ''
    }
  }

  _getTargetList(action) {
    switch (action) {
      case 'data-toggle':
      case 'data-tristate':
      case 'data-set':
      case 'value-set':
        let ids = (this.scene && this.scene.ids.map(i => `#${i.key}`)) || []
        ids.unshift('(self)')
        return ids
      default:
        return []
    }
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

customElements.define('property-event-hover', PropertyEventHover)
