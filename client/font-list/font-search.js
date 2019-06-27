import { LitElement, html, css } from './node_modules/lit-element'

class FontSearch extends LitElement {
  constructor() {
    super()

    this.data = []
  }

  static get properties() {
    return {
      data: Array
    }
  }

  static get styles() {
    return [
      css`
        :host {
          display: flex;
        }
      `
    ]
  }

  updated(changes) {}

  render() {
    return html``
  }
}

customElements.define('font-search', FontSearch)