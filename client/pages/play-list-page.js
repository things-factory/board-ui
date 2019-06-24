import { html, css } from 'lit-element'
import { connect } from 'pwa-helpers/connect-mixin.js'
import '@material/mwc-fab'

import { store, PageView, ScrollbarStyles, loadPage } from '@things-factory/shell'

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

      <a id="play" .href=${'board-player/' + this.groupId}>
        <mwc-fab icon="play_arrow" title="play"> </mwc-fab>
      </a>
    `
  }

  async refresh() {
    this.groups = (await fetchPlayGroupList()).playGroups.items

    this.groups && (await this.refreshBoards())
  }

  async refreshBoards() {
    if (!this.groups) {
      await this.refresh()
      return
    }

    console.log('groupId', this.groupId)
    if (!this.groupId) {
      let groupId = this.groups && this.groups[0] && this.groups[0].id
      console.log('groupId', this.groupId)
      if (groupId) {
        await store.dispatch(loadPage('play-list', groupId, {}))
      }
      return
    }

    this.boards = this.groupId ? (await fetchPlayGroup(this.groupId)).playGroup.boards : []
  }

  updated(change) {
    /*
     * play-list는 groupId 가 없는 경우에 대해 첫번째 그룹을 자동으로 가져오도록 처리하기 위해서,
     * groupId가 없는 경우에 대한 처리가 필요했다.
     */
    if (change.has('groupId') || !this.groupId) {
      this.refreshBoards()
    }
  }

  stateChanged(state) {
    if (this.active) {
      this.groupId = state.route.resourceId
    }
  }
}

window.customElements.define('play-list-page', PlayListPage)
