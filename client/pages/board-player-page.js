import { client, PageView, store } from '@things-factory/shell'
import gql from 'graphql-tag'
import { css, html } from 'lit-element'
import { connect } from 'pwa-helpers/connect-mixin.js'
import '../board-player/board-player'
import './things-scene-components.import'

const NOOP = () => {}

export class BoardPlayerPage extends connect(store)(PageView) {
  static get properties() {
    return {
      _playGroup: Object,
      _playGroupId: String,
      _boards: Array,
      _baseUrl: String,
      _showSpinner: Boolean
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
          position: relative;
        }

        board-player {
          flex: 1;
        }

        oops-spinner {
          display: none;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }

        oops-spinner[show] {
          display: block;
        }

        oops-note {
          display: block;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }
      `
    ]
  }

  async refresh() {
    if (!this._playGroupId) {
      return
    }

    try {
      this._showSpinner = true
      this.updateContext()

      this._playGroup = (
        await client.query({
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
        })
      ).data.playGroup

      if (!this._playGroup) {
        throw 'playgroup not found'
      }

      this._boards = this._playGroup.boards
    } catch (ex) {
      document.dispatchEvent(
        new CustomEvent('notify', {
          detail: {
            level: 'error',
            message: ex,
            ex
          }
        })
      )
    } finally {
      this._showSpinner = false
      this.updateContext()
    }
  }

  updated(changes) {
    if (changes.has('_playGroupId')) {
      this.shadowRoot.querySelector('board-player').stop()
      this.refresh()
    }
  }

  stateChanged(state) {
    this._baseUrl = state.app.baseUrl
  }

  get oopsNote() {
    return {
      icon: 'style',
      title: 'EMPTY PLAYGROUP',
      description: 'There are no board to be shown'
    }
  }

  get context() {
    return {
      title: this._playGroup
        ? this._playGroup.name
        : this._showSpinner
        ? 'Fetching playgroup...'
        : 'Playgroup Not Found'
    }
  }

  render() {
    var oops = !this._showSpinner && !this._playGroup && this.oopsNote

    return oops
      ? html`
          <oops-note
            icon=${oops.icon}
            title=${oops.title}
            description=${oops.description}
            @click=${oops.click || NOOP}
          ></oops-note>
        `
      : html`
          <board-player .boards=${this._boards}></board-player>
          <oops-spinner ?show=${this._showSpinner}></oops-spinner>
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
