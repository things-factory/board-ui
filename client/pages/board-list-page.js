import { html, css } from 'lit-element'
import { connect } from 'pwa-helpers/connect-mixin.js'
import { store, PageView, ScrollbarStyles } from '@things-factory/shell'

import { fetchGroupList } from '@things-factory/board-base'

import '../components/group-bar'
import '../components/board-tile-list'

class BoardListPage extends connect(store)(PageView) {
  static get styles() {
    return [
      ScrollbarStyles,
      css`
        :host {
          display: flex;
          flex-direction: column;

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
      groups: Array
    }
  }

  get context() {
    return {
      title: 'Board List'
    }
  }

  render() {
    return html`
      <group-bar .groups=${this.groups} .groupId=${this.groupId}></group-bar>

      <board-tile-list .groupId="${this.groupId}"></board-tile-list>
    `
  }

  async firstUpdated() {
    this.groups = (await fetchGroupList()).groups.items
  }

  stateChanged(state) {
    this.groupId = state.route.resourceId
  }
}

window.customElements.define('board-list-page', BoardListPage)
