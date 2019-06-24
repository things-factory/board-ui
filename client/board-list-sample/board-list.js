import { LitElement, html, css } from 'lit-element'

import { connect } from 'pwa-helpers/connect-mixin.js'
import { store, createBoard } from '../../reducer/store'

import { ScrollbarStyles } from '@things-factory/shell'
import { i18next, localize } from '@things-factory/i18n-base'

import '../../components/things-sortable/things-sortable'

import '../../layouts/page-toolbar/page-toolbar'
import '../../components/things-search-input'

import BoardCard from './board-card'
import BoardImporter from './board-importer'

class BoardGroupList extends connect(store)(localize(i18next)(LitElement)) {
  constructor() {
    super()

    this.boardList = []
    this.group = {}
    this.keyword = ''
  }

  static get properties() {
    return {
      boardList: Array,
      group: Object,
      keyword: String
    }
  }

  static get styles() {
    return [
      ScrollbarStyles,
      css`
        :host {
          display: flex;
          flex-direction: column;

          overflow: hidden;
        }

        #list {
          flex: 1;

          display: flex;
          flex-direction: column;
        }

        things-sortable {
          flex: 1;

          padding: 16px;
          margin: 0;
          overflow-y: auto;

          display: grid;

          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          grid-auto-rows: minmax(220px, 240px);
          grid-gap: 16px;
        }
      `
    ]
  }

  get context() {
    return {
      title: 'Board Group List'
    }
  }

  stateChanged(state) {
    this.boardList = state.boardList
    this.group = state.boardGroupCurrent
  }

  updated(change) {
    change.has('group') && this.onChangeGroup(this.group)
  }

  firstUpdated() {
    BoardImporter.set(
      this.shadowRoot.getElementById('list'),
      () => this.group && this.group.type == 'group',
      (name, model) => {
        store.dispatch(
          createBoard({
            name,
            description: 'imported',
            model: model,
            width: model.width,
            height: model.height,
            thumbnail: 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==',
            group: this.group.id
          })
        )
      }
    )
  }

  render() {
    return html`
      <div id="list">
        <things-sortable .group=${this.group.id} ?disabled=${this.group.type !== 'playGroup'}>
          ${this.boardList.map(
            item => html`
              <board-card .board=${item} @dragstart="${e => this.onDragStart(e)}"> </board-card>
            `
          )}
        </things-sortable>
      </div>
    `
  }

  onChangeGroup(e) {
    var cards = this.shadowRoot.querySelectorAll('.flipped')

    Array.from(cards).forEach(card => {
      card.classList.toggle('flipped')
    })
  }

  onDragStart(e) {
    var card = e.target

    if (!(card instanceof BoardCard)) return

    e.dataTransfer.setDragImage(card, 0, -10)
    e.dataTransfer.setData('board', card.board.id)
  }
}

customElements.define('board-group-list', BoardGroupList)
