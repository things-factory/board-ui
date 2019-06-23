import { LitElement, html } from 'lit-element'

export default class ThingsSceneProperty extends LitElement {
  constructor() {
    super()

    this.name = ''
    this.value = ''
    this.type = ''
  }

  static get is() {
    return 'things-scene-property'
  }

  static get properties() {
    return {
      name: String,
      value: String,
      type: String
    }
  }
}

customElements.define(ThingsSceneProperty.is, ThingsSceneProperty)
