import { html, css } from 'lit-element'
import { connect } from 'pwa-helpers/connect-mixin.js'
import '@material/mwc-fab'

import PullToRefresh from 'pulltorefreshjs'

import { store, loadPage, PageView, ScrollbarStyles, PullToRefreshStyles } from '@things-factory/shell'
import { fetchFontList, fetchPlayGroup, leavePlayGroup } from '@things-factory/font-base'

import '@things-factory/system-ui'
import '@things-factory/component-ui/component/popup/pop-up'
import '@things-factory/component-ui/component/form/form-master'
import '@things-factory/component-ui/component/infinite-scroll/infinite-scroll'

import '../board-list/font-list'

import { MENU_TOOLS_CONTEXT } from '../layout/menu-tools'

class FontListPage extends connect(store)(PageView) {
  static get styles() {
    return [
      ScrollbarStyles,
      PullToRefreshStyles,
      css`
        :host {
          display: flex;
          flex-direction: column;

          overflow: hidden;
        }

        data-grid,
        data-list {
          flex: 1;
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
      title: this.menuTitle,
      exportable: {
        name: this.menuTitle,
        data: this._exportableData.bind(this)
      },
      importable: {
        handler: this.importHandler.bind(this)
      },
      printable: {
        accept: ['paper', 'preview'],
        content: () => {
          return this
        }
      },
      actions: (this.buttons || []).map(button => {
        return {
          title: button.text,
          action: button.action
        }
      }),
      board_topmenu: true
    }
  }

  importHandler(records) {
    this.importedData = { items: records }
    this.shadowRoot.querySelector('pop-up').open()
  }

  _exportableData() {
    var items = this.data && this.data.items
    var columns = this._columns || []

    if (!items || !(items instanceof Array) || items.length == 0) {
      items = [{}]
    }

    return items.map(item => {
      return columns.reduce((record, column) => {
        record[column.term || column.name] = item[column.name]
        return record
      }, {})
    })
  }

  render() {
    return html`
      <pop-up .title="${this.menuTitle}">
        <data-grid
          .columns=${this._columns}
          .data=${this.importedData}
          .limit=${this.limit}
          .page=${this.page}
          @page-changed=${e => {
            this.page = e.detail
          }}
          @limit-changed=${e => {
            this.limit = e.detail
          }}
          @sort-changed=${e => {
            this.sortingFields = e.detail
          }}
          @column-length-changed=${e => {
            this._columns[e.detail.idx] = e.detail.column
            this._columns = [...this._columns]
          }}
        >
        </data-grid>
      </pop-up>

      <header>
        <form-master
          id="search-form"
          .fields="${this.searchFields}"
          initFocus="description"
          @submit="${this._searchData}"
          @load="${this._onFormLoad}"
        ></form-master>
      </header>

      ${this.layout == 'WIDE'
        ? html`
            <data-grid
              .columns=${this._columns}
              .data=${this.data}
              .limit=${this.limit}
              .page=${this.page}
              @page-changed=${e => {
                this.page = e.detail
              }}
              @limit-changed=${e => {
                this.limit = e.detail
              }}
              @sort-changed=${e => {
                this.sortingFields = e.detail
              }}
              @column-length-changed=${e => {
                this._columns[e.detail.idx] = e.detail.column
                this._columns = [...this._columns]
              }}
            >
            </data-grid>
          `
        : html`
            <infinite-scroll .pageProp="${this.pageProp}">
              <data-list
                .columns=${this._columns}
                .data=${this.data}
                .limit=${this.limit}
                .page=${this.page}
                @page-changed=${e => {
                  this.page = e.detail
                }}
                @limit-changed=${e => {
                  this.limit = e.detail
                }}
              >
              </data-list>
            </infinite-scroll>
          `}
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

    if (!this.groupId) {
      let groupId = this.groups && this.groups[0] && this.groups[0].id
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

  async activated(active) {
    if (active) {
      !this.groups && this.refreshBoards()
    }

    if (active) {
      await this.updateComplete
      /*
       * 첫번째 active 시에는 element가 생성되어있지 않으므로,
       * 꼭 updateComplete를 기다린 후에 mainElement설정을 해야한다.
       */
      this._ptr = PullToRefresh.init({
        mainElement: this.shadowRoot.querySelector('font-list'),
        distIgnore: 30,
        // instructionsPullToRefresh: 'uuu' /* Pull down to refresh */,
        // instructionsRefreshing: 'xxx' /* Refreshing */,
        // instructionsReleaseToRefresh: 'yyy' /* Release to refresh */,
        onRefresh: () => {
          this.refreshBoards()
        }
      })
    } else {
      this._ptr && this._ptr.destroy()
      delete this._ptr
    }
  }

  async onDeleteBoard(boardId) {
    try {
      await leavePlayGroup(boardId, this.groupId)

      document.dispatchEvent(
        new CustomEvent('notify', {
          detail: {
            level: 'info',
            message: 'deleted from this group'
          }
        })
      )
    } catch (ex) {
      document.dispatchEvent(
        new CustomEvent('notify', {
          detail: {
            level: 'error',
            message: ex,
            ex: ex
          }
        })
      )
    }

    this.refreshBoards()
  }
}

window.customElements.define('play-list-page', FontListPage)
