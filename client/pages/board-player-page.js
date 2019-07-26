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

  async refresh() {
    if (!this._playGroupId) {
      return
    }

    this._playGroup = (await fetchPlayGroup(this._playGroupId)).playGroup
    this._boards = this._playGroup.boards
    this.updateContext()
  }

  updated(changes) {
    if (changes.has('_playGroupId')) {
      this.shadowRoot.querySelector('board-player').stop()
      this.refresh()
    }
  }

  stateChanged(state) {
    this._baseUrl = state.app.baseUrl
    this._playGroupId = state.route.resourceId
  }

  get context() {
    return {
      title: this._playGroup && this._playGroup.name,
      screencastable: true
    }
  }

  render() {
    return html`
      <board-player .boards=${this._boards} .provider=${provider}></board-player>
    `
  }

  activated(active) {
    if (!active) {
      this._playGroupId = null
      this.shadowRoot.querySelector('board-player').stop()
    }
  }
}

customElements.define('board-player-page', BoardPlayerPage)
