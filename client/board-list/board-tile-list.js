import { css, html, LitElement } from 'lit-element'

import '@material/mwc-icon/mwc-icon'

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
          padding: 10px;

          position: relative;
        }

        img {
          display: block;

          margin: auto;
          max-width: 100%;
          max-height: 70%;
        }

        mwc-icon {
          position: absolute;
          right: 8px;
          top: 8px;

          color: var(--secondary-dark-color);
          font-size: 1em;
        }

        mwc-icon[selected] {
          color: white;
          text-shadow: 1px 1px 1px var(--secondary-dark-color);
        }

        li a {
          color: #fff;
          text-decoration: none;

          font-size: 1em;
          word-wrap: break-word;
          word-break: break-all;

          margin: 0px;
          display: block;
          width: 100%;
          height: 100%;
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
                <a href="board-viewer/${board.id}"> <img src=${board.thumbnail} />${board.name} </a>

                ${Math.random() > 0.5
                  ? html`
                      <mwc-icon>star_border</mwc-icon>
                    `
                  : html`
                      <mwc-icon selected>star</mwc-icon>
                    `}
              </li>
            `
        )}
      </ul>
    `
  }
}

window.customElements.define('board-tile-list', BoardTileList)
