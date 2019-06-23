import { html, css } from 'lit-element'
import { connect } from 'pwa-helpers/connect-mixin.js'
import '@material/mwc-fab'

import { store, PageView, ScrollbarStyles } from '@things-factory/shell'

import { fetchPlayGroupList, fetchPlayGroup } from '@things-factory/board-base'

import '../board-list/play-group-bar'
import '../board-list/board-tile-list'

class PlayListPage extends connect(store)(PageView) {
  static get styles() {
    return [
      ScrollbarStyles,
      css`
        :host {
          display: flex;
          flex-direction: column;
          position: relative;

          overflow: hidden;
        }

        board-tile-list {
          flex: 1;
          overflow-y: auto;
        }

        #play {
          position: absolute;
          bottom: 15px;
          right: 16px;
        }
      `
    ]
  }

  static get properties() {
    return {
      groupId: String,
      groups: Array,
      boards: Array
    }
  }

  get context() {
    return {
      title: 'Play List',
      'board-list': true
    }
  }

  render() {
    return html`
      <play-group-bar
        .groups=${this.groups}
        .groupId=${this.groupId}
        targetPage="play-list"
        @refresh=${this.refresh.bind(this)}
      ></play-group-bar>

      <board-tile-list .boards=${this.boards}></board-tile-list>

      <a id="play" href="board-player">
        <mwc-fab icon="play_arrow" title="play"> </mwc-fab>
      </a>
    `
  }

  firstUpdated() {
    this.refresh()
  }

  async refresh() {
    this.groups = (await fetchPlayGroupList()).playGroups.items

    await this.refreshBoards()
  }

  async refreshBoards() {
    if (!this.groupId) {
      // TODO route를 바꿔주는 방향으로 수정.
      this.groupId = this.groups && this.groups[0] && this.groups[0].id
    }

    this.boards = this.groupId ? (await fetchPlayGroup(this.groupId)).playGroup.boards : []
  }

  updated(change) {
    if (change.has('groupId')) {
      this.refreshBoards()
    }
  }

  stateChanged(state) {
    this.groupId = state.route.resourceId
  }
}

window.customElements.define('play-list-page', PlayListPage)
