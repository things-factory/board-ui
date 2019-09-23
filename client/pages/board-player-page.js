import { client, PageView, store } from '@things-factory/shell'
import gql from 'graphql-tag'
import { css, html } from 'lit-element'
import { connect } from 'pwa-helpers/connect-mixin.js'
import '../board-player/board-player'
import { provider } from '../board-provider'
import './things-scene-components.import'

class BoardPlayerPage extends connect(store)(PageView) {
  static get properties() {
    return {
      _playGroup: Object,
      _playGroupId: String,
      _boards: Array,
      _provider: Object,
      _baseUrl: String,
      _license: Object
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

    this._playGroup = (await client.query({
      query: gql`
        query FetchPlayGroup($id: String!) {
          playGroup(id: $id) {
            id
            name
            description
            boards {
              id
              name
              description
              model
              thumbnail
              createdAt
              creator {
                id
                name
              }
              updatedAt
              updater {
                id
                name
              }
            }
          }
        }
      `,
      variables: {
        id: this._playGroupId
      }
    })).data.playGroup

    this._boards = this._playGroup.boards
    this.updateContext()
  }

  updated(changes) {
    if (changes.has('_playGroupId')) {
      this.shadowRoot.querySelector('board-player').stop()
      this.refresh()
    }

    if (changes.has('_license')) {
      if (scene && scene.license) scene.license(this._license.key)
    }
  }

  stateChanged(state) {
    this._baseUrl = state.app.baseUrl
    this._license = state.license
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

  pageUpdated(changes, lifecycle) {
    if (this.active) {
      this._playGroupId = lifecycle.resourceId

      this.refresh()
    } else {
      this._playGroupId = null
      this.shadowRoot.querySelector('board-player').stop()
    }
  }
}

customElements.define('board-player-page', BoardPlayerPage)
