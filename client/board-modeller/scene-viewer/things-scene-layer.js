import { LitElement, html } from 'lit-element'

import './things-scene-property'

export default class ThingsSceneLayer extends LitElement {
  static get is() {
    return 'things-scene-layer'
  }

  static get properties() {
    return {
      type: String,
      text: String
    }
  }

  render() {
    return html`
      <slot select="things-scene-property"></slot>
    `
  }

  getModel() {
    let model = {
      type: this.type
    }

    model = Array.from(this.querySelectorAll('things-scene-property')).reduce((model, property) => {
      let value = property.value

      if (property.name) {
        switch (property.type) {
          case 'number':
            value = Number(value)
            break
          case 'boolean':
            value = Boolean(value)
            break
          default:
        }

        model[property.name] = value
      }

      return model
    }, model)

    return model
  }
}

customElements.define(ThingsSceneLayer.is, ThingsSceneLayer)
