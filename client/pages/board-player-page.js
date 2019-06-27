import { html, css } from 'lit-element'

import { connect } from 'pwa-helpers/connect-mixin.js'
import { store, PageView } from '@things-factory/shell'
import { fetchPlayGroup } from '@things-factory/board-base'

import { provider } from '../board-provider'

import '../board-player/board-player'
import './things-scene-components.import'

class BoardPlayerPage extends connect(store)(PageView) {
  static get properties() {
    return {
      _playGroup: Object,
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
          width: 100%;
          height: 100%;

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
      this._playGroup = (await fetchPlayGroup(this._playGroupId)).playGroup
      this._boards = this._playGroup.boards
    }
  }

  stateChanged(state) {
    this._baseUrl = state.app.baseUrl
    this._playGroupId = state.route.resourceId
  }

  get context() {
    return {
      title: this._playGroup && this._playGroup.name
    }
  }

  render() {
    return html`
      <board-player .boards=${this._boards} .provider=${provider}></board-player>
    `
  }

  activated(active) {
    if (!active) {
      this.shadowRoot.querySelector('board-player').stop()
    }
  }
}

customElements.define('board-player-page', BoardPlayerPage)
