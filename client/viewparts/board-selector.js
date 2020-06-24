import { i18next, localize } from '@things-factory/i18n-base'
// CONFIRM-ME 여기서 @things-factory/setting-base 모듈이 사용되는가 ?
import '@things-factory/setting-base'
import { css, html, LitElement } from 'lit-element'

import gql from 'graphql-tag'
import { client, InfiniteScrollable } from '@things-factory/shell'
import { gqlBuilder } from '@things-factory/utils'
import { ScrollbarStyles } from '@things-factory/styles'
import './board-creation-card'

const FETCH_BOARD_LIST_GQL = listParam => {
  return gql`
  {
    boards(${gqlBuilder.buildArgs(listParam)}) {
      items {
        id
        name
        description
        thumbnail
      }
      total
    }
  }
`
}

const FETCH_GROUP_LIST_GQL = gql`
  {
    groups {
      items {
        id
        name
        description
      }
      total
    }
  }
`

const CREATE_BOARD_GQL = gql`
  mutation CreateBoard($board: NewBoard!) {
    createBoard(board: $board) {
      id
      name
      description
      model
      createdAt
      updatedAt
    }
  }
`

export class BoardSelector extends InfiniteScrollable(localize(i18next)(LitElement)) {
  static get styles() {
    return [
      ScrollbarStyles,
      css`
        :host {
          display: grid;
          grid-template-rows: auto auto 1fr;
          overflow: hidden;
          background-color: var(--popup-content-background-color);
        }

        #main {
          overflow: auto;
          padding: var(--popup-content-padding);
          display: grid;
          grid-template-columns: var(--card-list-template);
          grid-auto-rows: var(--card-list-rows-height);
          grid-gap: 20px;
        }

        #main .card {
          display: flex;
          flex-direction: column;
          align-items: center;
          overflow: hidden;
          border-radius: var(--card-list-border-radius);
          background-color: var(--card-list-background-color);
        }

        #main .card.create {
          overflow: visible;
        }

        #main .card:hover {
          cursor: pointer;
        }

        #main .card > .name {
          background-color: rgba(1, 126, 127, 0.8);
          margin-top: -35px;
          width: 100%;
          color: #fff;
          font-weight: bolder;
          font-size: 13px;
          text-indent: 7px;
        }

        #main .card > .description {
          background-color: rgba(0, 0, 0, 0.7);
          width: 100%;
          min-height: 15px;
          font-size: 0.6rem;
          color: #fff;
          text-indent: 7px;
        }
        #main .card img {
          max-height: 100%;
          min-height: 100%;
        }

        #filter {
          padding: var(--popup-content-padding);
          background-color: #fff;
          box-shadow: var(--box-shadow);
        }

        #filter * {
          font-size: 15px;
        }

        select {
          text-transform: capitalize;
          float: right;
        }
      `
    ]
  }

  static get properties() {
    return {
      groups: Array,
      boards: Array,
      group: String,
      _page: Number,
      _total: Number,
      creatable: Boolean
    }
  }

  constructor() {
    super()

    this.groups = []
    this.boards = []

    this._page = 1
    this._total = 0

    this._infiniteScrollOptions.limit = 20
  }

  render() {
    return html`
      <div id="filter">
        <select
          @change=${e => {
            this.group = e.currentTarget.value
            this.requestUpdate()
          }}
        >
          <option value="">${i18next.t('label.all')}</option>
          ${this.groups.map(group => html` <option value=${group.id}>${group.description}</option> `)}
        </select>
      </div>

      <div
        id="main"
        @scroll=${e => {
          this.onScroll(e)
        }}
      >
        ${this.creatable
          ? html`
              <board-creation-card
                class="card create"
                .groups=${this.groups}
                .defaultGroup=${this.group}
                @create-board=${e => this.onCreateBoard(e)}
              ></board-creation-card>
            `
          : html``}
        ${this.boards.map(
          board => html`
            <div class="card" @click=${e => this.onClickSelect(board)}>
              <img src=${board.thumbnail} />
              <div class="name">${board.name}</div>
              <div class="description">${board.description}</div>
            </div>
          `
        )}
      </div>
    `
  }

  get scrollTargetEl() {
    return this.renderRoot.querySelector('#main')
  }

  async scrollAction() {
    return this.appendBoards()
  }

  firstUpdated() {
    this.refreshGroups()
  }

  updated(changed) {
    if (changed.has('group')) {
      this.refreshBoards()
    }
  }

  onClickSelect(board) {
    this.dispatchEvent(
      new CustomEvent('board-selected', {
        composed: true,
        bubbles: true,
        detail: {
          board
        }
      })
    )
  }

  async onCreateBoard(e) {
    var { name, description, groupId } = e.detail

    await this.createBoard(name, description, groupId)
    this.refreshBoards()
  }

  async refreshGroups() {
    var groupListResponse = await client.query({
      query: FETCH_GROUP_LIST_GQL
    })

    if (!groupListResponse || !groupListResponse.data) return

    var groups = groupListResponse.data.groups.items
    this.groups = [...groups]

    this.group = groups.filter(group => group.id == this.group).length > 0 ? this.group : ''
  }

  async refreshBoards() {
    var boards = await this.getBoards()
    this.boards = [...boards]

    var creationCard = this.shadowRoot.querySelector('board-creation-card')
    if (creationCard) {
      creationCard.reset()
    }
  }

  async appendBoards() {
    var boards = await this.getBoards({ page: this._page + 1 })
    this.boards = [...this.boards, ...boards]
  }

  async getBoards({ page = 1, limit = this._infiniteScrollOptions.limit } = {}) {
    var filters = []
    var sortings = []
    var pagination = {
      limit,
      page
    }

    if (this.group)
      filters.push({
        name: 'group_id',
        operator: 'eq',
        value: this.group
      })

    var params = {
      filters,
      sortings,
      pagination
    }
    var boardListResponse = await client.query({
      query: FETCH_BOARD_LIST_GQL(params)
    })

    if (!boardListResponse || !boardListResponse.data) return []
    this._total = boardListResponse.data.boards.total
    this._page = page

    return boardListResponse.data.boards.items
  }

  async createBoard(name, description, groupId) {
    var model = JSON.stringify({
      width: 800,
      height: 600
    })

    const response = await client.mutate({
      mutation: CREATE_BOARD_GQL,
      variables: {
        board: {
          name,
          description,
          groupId,
          model
        }
      }
    })

    return response.data
  }
}

customElements.define('board-selector', BoardSelector)
