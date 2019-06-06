import { html, LitElement } from 'lit-element'
import { connect } from 'pwa-helpers/connect-mixin.js'
import { store, PageView } from '@things-factory/shell'

import logo from '../../assets/images/hatiolab-logo.png'

class BoardListPage extends connect(store)(PageView) {
  static get properties() {
    return {
      boardList: String
    }
  }
  render() {
    return html`
      <section>
        <h2>board-list</h2>
        <img src=${logo}></img>
      </section>
    `
  }

  stateChanged(state) {}
}

window.customElements.define('board-list-page', BoardListPage)
