import { html, css } from 'lit-element'

import { connect } from 'pwa-helpers/connect-mixin.js'
import { store, PageView } from '@things-factory/shell'
import { fetchBoardList } from '@things-factory/board-base'
import { provider } from '../board-provider'

import '@things-shell/board-player'

import('./things-scene-components.import')

class BoardPlayerPage extends connect(store)(PageView) {
  static get properties() {
    return {
      _playGroupId: String,
      _boards: Array,
      _provider: Object,
      _baseUrl: String
    }
  }

  static get styles() {
    return [
      css`
        :host {
          display: flex;
          flex-direction: column;
          width: 100vw;
          height: 100vh;

          overflow: hidden;
        }

        board-player {
          flex: 1;
        }
      `
    ]
  }

  async updated(changed) {
    if (changed.has('active')) {
      this._boards = (await fetchBoardList(this._playGroupId)).boards
    }
  }

  stateChanged(state) {
    this._baseUrl = state.app.baseUrl
    this._playGroupId = state.route.resourceId
  }

  get context() {
    return {
      title: this._playGroupId
    }
  }

  render() {
    return html`
      <board-player .boards=${this._boards} .provider=${provider}></board-player>
    `
  }
}

customElements.define('board-player-page', BoardPlayerPage)
