import { LitElement, html, css } from 'lit-element'

import { connect } from 'pwa-helpers/connect-mixin.js'
import { store, PageView } from '@things-factory/shell'
import { ReferenceMap, create, error } from '@hatiolab/things-scene'

import '@things-shell/board-viewer'

class BoardViewerPage extends connect(store)(PageView) {
  static get properties() {
    return {
      _board: Object,
      _provider: Object,
      _boardId: String,
      _baseUrl: String
    }
  }

  static get styles() {
    return [
      css`
        :host {
          display: flex;
          flex-direction: column;
          width: 100vw; /* 전체화면보기를 위해서 필요함. */
          height: 100vh;
          overflow: hidden;
        }

        board-viewer {
          flex: 1;
          width: 100vw; /* 전체화면보기를 위해서 필요함. */
          height: 100vh;
          position: relative;
        }
      `
    ]
  }

  render() {
    return html`
      <page-toolbar></page-toolbar>

      <board-viewer .board=${this._board} .provider=${this._provider}></board-viewer>
    `
  }

  async _fetchBoard(boardId) {
    const res = await fetch(`${this._baseUrl}/scenes/${boardId}`, {
      credentials: 'include'
    })

    if (res.ok) {
      return await res.json()
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

  async updated(changed) {
    if (changed.has('active')) {
      var board = await this._fetchBoard(this._boardId)

      this._board = {
        ...board,
        model: JSON.parse(board.model)
      }
    }
  }

  stateChanged(state) {
    this._baseUrl = state.app.baseUrl
    this._boardId = state.app.resourceId
  }
}

customElements.define('board-viewer-page', BoardViewerPage)
