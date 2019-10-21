/**
 * @license Copyright © HatioLab Inc. All rights reserved.
 */

import '@polymer/iron-icon'
import '@polymer/iron-icons'
import '@polymer/paper-icon-button'
import { LitElement } from 'lit-element'

export class AbstractProperty extends LitElement {
  firstUpdated() {
    this.renderRoot.addEventListener('change', this._onValueChange.bind(this))
  }

  _onValueChange(e) {
    var element = e.target
    var key = element.getAttribute('value-key')

    if (!key) {
      return
    }

    var value = this._getValueFromEventTarget(element)

    this._onAfterValueChange(key, value)
  }

  _getValueFromEventTarget(element) {
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
            value = Number(element.valueAsNumber)
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

    return value
  }

  _onAfterValueChange(key, value) {
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
