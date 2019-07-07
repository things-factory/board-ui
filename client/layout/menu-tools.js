import { css, html, LitElement } from 'lit-element'
import { connect } from 'pwa-helpers'

import '@material/mwc-icon'

import { store } from '@things-factory/shell'

export class MenuTools extends connect(store)(LitElement) {
  static get properties() {
    return {
      page: String,
      width: String,
      context: Object
    }
  }

  static get styles() {
    return [
      css`
        :host {
          display: flex;
          flex-direction: row;
          background-color: var(--secondary-dark-color);
          height: 100%;
        }

        ul {
          display: flex;
          flex-direction: row;

          margin: auto;
          padding: 0;
          list-style: none;
          height: 100%;
          overflow: none;
        }

        :host([wide]) ul {
          flex-direction: column;
        }

        :host([wide]) li {
          padding: 6px 0;
        }

        a {
          padding: 0px;
          text-align: center;
          text-decoration: none;
          color: white;
        }

        a[active] {
          color: tomato;
        }

        mwc-icon {
          padding: 5px 20px 0px 20px;
          vertical-align: bottom;
        }

        div {
          font-size: 0.7em;
        }
      `
    ]
  }

  render() {
    return this.context && this.context['board_topmenu']
      ? html`
          <ul>
            <li>
              <a href="board-list" ?active=${this.page == 'board-list'}>
                <mwc-icon>dvr</mwc-icon>
                <div>board</div>
              </a>
            </li>
            <li>
              <a href="play-list" ?active=${this.page == 'play-list'}>
                <mwc-icon>airplay</mwc-icon>
                <div>player</div>
              </a>
            </li>
            <li>
              <a href="font-list" ?active=${this.page == 'font-list'}>
                <mwc-icon>font_download</mwc-icon>
                <div>font</div>
              </a>
            </li>
            <li>
              <a href="publisher-list" ?active=${this.page == 'publisher-list'}>
                <mwc-icon>cloud_download</mwc-icon>
                <div>publisher</div>
              </a>
            </li>
            <li>
              <a href="file-list" ?active=${this.page == 'file-list'}>
                <mwc-icon>attachment</mwc-icon>
                <div>attachment</div>
              </a>
            </li>
          </ul>
        `
      : html``
  }

  updated(change) {
    /* media query가 엘리먼트 생성 시에 동작하지 않는 문제를 처리함 */
    if (change.has('width')) {
      this.width == 'WIDE' ? this.setAttribute('wide', true) : this.removeAttribute('wide')
    }
  }

  stateChanged(state) {
    this.page = state.route.page
    this.width = state.layout.width
    this.context = state.route.context
  }
}

window.customElements.define('menu-tools', MenuTools)
