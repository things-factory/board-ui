import { LitElement, html } from 'lit-element'

import './things-scene-property'

export default class ThingsSceneHandler extends LitElement {
  static get is() {
    return 'things-scene-handler'
  }

  static get properties() {
    return {
      type: String,
      model: {
        type: Object,
        notify: true
      }
    }
  }

  render() {
    return html`
      <slot select="things-scene-property"></slot>
    `
  }

  connectedCallback() {
    super.connectedCallback()

    let model = {
      type: this.type
    }

    model = Array.from(this.querySelectorAll('things-scene-property')).reduce((model, property) => {
      const name = property.getAttribute('name')
      const value = property.getAttribute('value')

      if (name) {
        model[name] = value
      }

      return model
    }, model)

    model.__host__ = this

    this.model = model
  }
}

customElements.define(ThingsSceneHandler.is, ThingsSceneHandler)
