import { css, html, LitElement } from 'lit-element'

import '@material/mwc-icon'

export default class BoardTileList extends LitElement {
  static get styles() {
    return [
      css`
        :host {
          display: block;
          box-sizing: border-box;
        }

        ul {
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-auto-rows: 110px;
          list-style: none;
          padding: 0;
          margin: 0;
        }

        ul > li {
          margin: var(--menu-list-item-margin);
          padding: 12px;

          position: relative;
        }

        img {
          display: block;

          margin: auto;
          max-width: 100%;
          max-height: 100%;
        }

        mwc-icon[star] {
          position: absolute;
          right: 8px;
          top: 8px;

          color: var(--secondary-dark-color);
          font-size: 1em;
        }

        mwc-icon[star][selected] {
          color: white;
          text-shadow: 1px 1px 1px var(--secondary-dark-color);
        }

        li a {
          display: block;
          text-decoration: none;

          font-size: 1em;
          word-wrap: break-word;
          word-break: break-all;

          margin: 0px;
        }

        [name] {
          color: #fff;
          text-transform: uppercase;
        }

        [description] {
          color: var(--secondary-dark-color);
        }

        [thumbnail] {
          width: 100%;
          height: 80%;
        }

        [edit],
        [delete] {
          display: none;
          position: absolute;
          bottom: 10px;
        }

        [edit] {
          right: 10px;
        }

        [delete] {
          right: 30px;
        }

        [edit] mwc-icon,
        [delete] mwc-icon {
          color: var(--secondary-dark-color);
          font-size: 1.3em;
          vertical-align: middle;
        }

        li:hover [edit],
        li:hover [delete] {
          display: block;
        }

        li:nth-child(7n + 1) {
          background-color: #4397de;
        }

        li:nth-child(7n + 2) {
          background-color: #33b8d0;
        }

        li:nth-child(7n + 3) {
          background-color: #4ab75f;
        }

        li:nth-child(7n + 4) {
          background-color: #93796f;
        }

        li:nth-child(7n + 5) {
          background-color: #f1ac42;
        }

        li:nth-child(7n + 6) {
          background-color: #ea6361;
        }

        li:nth-child(7n + 7) {
          background-color: #7386c3;
        }

        @media (min-width: 600px) {
          ul {
            grid-template-columns: 1fr 1fr 1fr;
            grid-auto-rows: 120px;
          }
        }
        @media (min-width: 1200px) {
          ul {
            grid-template-columns: 1fr 1fr 1fr 1fr;
            grid-auto-rows: 130px;
          }
        }
        @media (min-width: 1800px) {
          ul {
            grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
            grid-auto-rows: 140px;
          }
        }
        @media (min-width: 2400px) {
          ul {
            grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
            grid-auto-rows: 150px;
          }
        }
      `
    ]
  }

  static get properties() {
    return {
      boards: Array
    }
  }

  render() {
    var boards = this.boards || []

    return html`
      <ul>
        ${boards.map(
          board =>
            html`
              <li style="grid-row: span 2">
                <a href="board-viewer/${board.id}" thumbnail> <img src=${board.thumbnail} /> </a>

                <div name>${board.name}</div>
                <div description>${board.description}</div>

                ${Math.random() > 0.5
                  ? html`
                      <mwc-icon star>star_border</mwc-icon>
                    `
                  : html`
                      <mwc-icon star selected>star</mwc-icon>
                    `}

                <a
                  href="#"
                  @click=${e => {
                    this.deleteBoard(board.id)
                    e.preventDefault()
                  }}
                  delete
                >
                  <mwc-icon>delete</mwc-icon>
                </a>

                <a .href=${'board-modeller/' + board.id} edit>
                  <mwc-icon>edit</mwc-icon>
                </a>
              </li>
            `
        )}
      </ul>
    `
  }

  deleteBoard(boardId) {
    this.dispatchEvent(
      new CustomEvent('delete-board', {
        detail: boardId
      })
    )
  }
}

window.customElements.define('board-tile-list', BoardTileList)
