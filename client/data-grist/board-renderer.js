import { LitElement, html, css } from 'lit-element'

import gql from 'graphql-tag'
import { client, navigate } from '@things-factory/shell'

import '@material/mwc-icon'

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
  static get styles() {
    return css`
      :host {
        display: block;
        position: relative;
        margin: auto !important;

        max-width: var(--board-renderer-max-width);
        border: var(--board-renderer-border);
      }
      span {
        position: absolute;
        bottom: 0;
        width: 100%;
        text-indent: 5px;
        color: #fff;

        font: var(--board-renderer-name-font);
        background-color: var(--board-renderer-name-background-color);
      }
      img {
        width: 100%;
        max-height: 80px;
      }
      mwc-icon {
        position: absolute;
        top: 0;
        text-align: center;
        color: #fff;

        width: var(--board-renderer-icon-size);
        height: var(--board-renderer-icon-size);
        font: var(--board-renderer-font);
      }
      mwc-icon[edit] {
        right: 0;

        border-bottom-left-radius: var(--board-renderer-icon-border-radius);
        background-color: var(--board-renderer-icon-edit-background-color);
      }
      mwc-icon[view] {
        left: 0;

        border-bottom-right-radius: var(--board-renderer-icon-border-radius);
        background-color: var(--board-renderer-icon-view-background-color);
      }
    `
  }

  static get properties() {
    return {
      value: Object,
      boardViewerPage: String,
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
    var { id, name = '', thumbnail = 'image/gif' } = this._value || {}
    var boardViewerPage = this.boardViewerPage || 'board-viewer'

    return id
      ? html`
          <span>${name}</span>
          <img src=${thumbnail} alt="no thumbnail!" />
          <mwc-icon view @click=${e => id && navigate(`${boardViewerPage}/${id}`)}>search</mwc-icon>
          <mwc-icon edit @click=${e => navigate(`board-modeller/${id}`)}>edit</mwc-icon>
        `
      : html`
          choose board..
        `
  }
}

customElements.define('board-renderer', BoardRendererElement)

export const BoardRenderer = (value, column, record) => {
  var { boardViewerPage = '' } = column.record.options || {}

  return html`
    <board-renderer .value=${value} .boardViewerPage=${boardViewerPage}></board-renderer>
  `
}
