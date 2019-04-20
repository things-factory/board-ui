import { LitElement, html, css } from 'lit-element'

import { connect } from 'pwa-helpers/connect-mixin.js'
import { store, PageView } from '@things-factory/shell'
import { ReferenceMap, create, error } from '@hatiolab/things-scene'

import '@things-shell/board-player'

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

  constructor() {
    super()
  }

  async updated(changed) {
    if (changed.has('active')) {
      this._boards = (await this._fetchGroup(this._playGroupId)).items
    }
  }

  stateChanged(state) {
    this._baseUrl = state.app.baseUrl
    this._playGroupId = state.app.resourceId
  }

  render() {
    return html`
      <page-toolbar></page-toolbar>
      
      <board-player .boards=${this._boards} .provider=${this._provider}></board-player>
    `
  }

  async _fetchGroup(groupId) {
    const params = new URLSearchParams()
    params.append('sort', JSON.stringify([{ field: 'description', ascending: true }]))

    const res = await fetch(`${this._baseUrl}/scenes/list/${groupId}?${params}`, {
      credentials: 'include'
    })

    if (res.ok) {
      return await res.json()
    }
  }

  async _fetchBoard(boardId) {
    const res = await fetch(`${this._baseUrl}/scenes/${boardId}`, {
      credentials: 'include'
    })

    if (res.ok) {
      let data = await res.json()
      console.log('Board data responsed', data)
      return data
    }
  }

  connectedCallback() {
    super.connectedCallback()

    this._provider = new ReferenceMap(
      async (boardId, resolve, reject) => {
        try {
          const board = await this._fetchBoard(boardId)

          var model = JSON.parse(board.model)

          var scene

          try {
            scene = await this._provider.get(boardId)
            console.warn('Board fetched more than twice.', boardId)
          } catch (e) {
            scene = create({
              model,
              mode: 0,
              refProvider: this._provider
            })

            // s.app.baseUrl = undefined;
          }

          resolve(scene, {
            ...board,
            model
          })
        } catch (e) {
          error(e)
          reject(e)
        }
      },
      async (id, ref) => {
        ref.dispose()
      }
    )

    this.dispatchEvent(new CustomEvent('change', { bubbles: true, composed: true }))
  }
}

customElements.define('board-player-page', BoardPlayerPage)
