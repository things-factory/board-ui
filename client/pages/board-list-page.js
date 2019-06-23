import { html, css } from 'lit-element'
import { connect } from 'pwa-helpers/connect-mixin.js'
import '@material/mwc-fab'

import { store, PageView, ScrollbarStyles } from '@things-factory/shell'

import { fetchGroupList, fetchBoardList } from '@things-factory/board-base'

import '../board-list/group-bar'
import '../board-list/board-tile-list'

class BoardListPage extends connect(store)(PageView) {
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
      title: 'Board List',
      'board-list': true
    }
  }

  render() {
    return html`
      <group-bar
        .groups=${this.groups}
        .groupId=${this.groupId}
        targetPage="board-list"
        @refresh=${this.refresh.bind(this)}
      ></group-bar>

      <board-tile-list .boards=${this.boards}></board-tile-list>
    `
  }

  async refresh() {
    this.groups = (await fetchGroupList()).groups.items
    await this.refreshBoards()
  }

  async refreshBoards() {
    if (!this.groups) {
      await this.refresh()
      return
    }

    var listParam = {
      filters: this.groupId
        ? [
            {
              name: 'groupId',
              operator: 'eq',
              value: this.groupId
            }
          ]
        : [],
      sortings: [
        {
          name: 'name',
          desc: true
        }
      ],
      pagination: {
        skip: 0,
        take: 10
      }
    }

    this.boards = (await fetchBoardList(listParam)).boards.items
  }

  updated(change) {
    if (change.has('groupId')) {
      this.refreshBoards()
    }
  }

  stateChanged(state) {
    if (this.active) {
      this.groupId = state.route.resourceId
    }
  }
}

window.customElements.define('board-list-page', BoardListPage)
