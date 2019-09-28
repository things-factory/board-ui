import { LitElement, html } from 'lit-element'

import gql from 'graphql-tag'
import { client } from '@things-factory/shell'

const FETCH_BOARD_GQL = id => {
  return gql`
  {
    board(id:"${id}") {
      id
      name
      description
      thumbnail
    }
  }
`
}

class BoardRendererElement extends LitElement {
  static get properties() {
    return {
      value: Object,
      _value: Object
    }
  }

  async updated(changes) {
    if (changes.has('value')) {
      if (typeof this.value == 'string' && this.value) {
        /* fetchBoard..., */
        try {
          var response = await client.query({
            query: FETCH_BOARD_GQL(this.value)
          })

          this._value = (response && response.data && response.data.board) || {}
        } catch (e) {
          console.error(e)
        }
      } else {
        this._value = this.value || {}
      }
    }
  }

  render() {
    var value = this._value || {}
    return html`
      ${value.name || ''}
    `
  }
}

customElements.define('board-renderer', BoardRendererElement)

export const BoardRenderer = (value, column, record) => {
  return html`
    <board-renderer .value=${value}></board-renderer>
  `
}
