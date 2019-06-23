import { css, html, LitElement } from 'lit-element'
import { connect } from 'pwa-helpers'

import '@material/mwc-icon'

import { store } from '@things-factory/shell'

class GroupCategoryTools extends connect(store)(LitElement) {
  static get properties() {
    return {
      page: String
    }
  }

  static get styles() {
    return [
      css`
        :host {
          display: flex;
          flex-direction: row;
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

        mwc-icon {
          padding: 10px 20px;
          color: var(--secondary-dark-color);
        }

        mwc-icon[active] {
          color: red;
        }
      `
    ]
  }

  render() {
    return html`
      <ul>
        <li>
          <a href="board-list">
            <mwc-icon ?active=${this.page == 'board-list'}>dvr</mwc-icon>
          </a>
        </li>
        <li>
          <a href="play-list">
            <mwc-icon ?active=${this.page == 'play-list'}>airplay</mwc-icon>
          </a>
        </li>
      </ul>
    `
  }

  stateChanged(state) {
    this.page = state.route.page
  }
}

window.customElements.define('group-category-tools', GroupCategoryTools)
