import { LitElement, html, css } from 'lit-element'
import { connect } from 'pwa-helpers/connect-mixin.js'

import '@material/mwc-icon/mwc-icon'

import {
  store,
  setRoute,
  updateBoard,
  deleteBoard,
  leavePlayGroup,
  fetchBoardList,
  showContextmenu
} from '@things-factory/board-base'

import { i18next, localize } from '@things-shell/client-i18n'

export default class BoardCard extends connect(store)(localize(i18next)(LitElement)) {
  static get is() {
    return 'board-card'
  }

  static get properties() {
    return {
      board: Object,
      // statePath: 'boardGroupCurrent'
      group: Object,
      // statePath: 'user.locale'
      locale: String,

      contextmenuList: {
        type: Array
      }
    }
  }

  static get styles() {
    return [
      css`
        #card {
          position: relative;

          padding: 0;
          margin: 0;
          height: 100%;

          -webkit-transform-style: preserve-3d;
          transform-style: preserve-3d;
          -webkit-transition: all 0.5s ease-in-out;
          transition: all 0.5s ease-in-out;
        }

        :host(.flipped) > #card {
          -webkit-transform: rotateX(180deg);
          transform: rotateX(180deg);
        }

        #card > [front],
        #card > [back] {
          position: absolute;

          width: 100%;
          height: 100%;
          margin: 0;
          padding: 0;
          background: white;

          border-radius: 5px;
          background-color: #fff;
          box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12),
            0 3px 1px -2px rgba(0, 0, 0, 0.2);

          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
        }

        #card > [back] {
          -webkit-transform: rotateX(180deg);
          transform: rotateX(180deg);
        }

        #info {
          padding: 10px;
        }

        h1 {
          display: inline;
          color: #212121;
          font-weight: normal;
          font-size: 0.9em;
        }

        h5 {
          margin: 0;
          font-size: 0.8em;
          font-weight: normal;
          color: #757575;
        }

        p {
          margin: 0;
          display: inline;
          font-size: 0.7em;
          color: #757575;
        }

        img {
          display: block;
          height: 88%;
          max-width: 100%;
          margin: auto;
        }

        div.name {
          position: absolute;
          width: 100%;
          bottom: 0;
          padding: 0 10px 0 10px;
          background: lightgray;
          box-sizing: border-box;
        }

        mwc-icon {
          position: absolute;
          color: gray;
          bottom: 3px;
          right: 3px;
          width: 16px;
          height: 16px;
          padding: 5px;
          border-radius: 50%;
        }

        mwc-icon[flip] {
          --mdc-icon-size: 1em;
        }

        mwc-icon[delete] {
          color: red;
          right: 30px;

          --mdc-icon-size: 1em;
        }

        mwc-icon[create] {
          background: lightgray;
          color: black;
          padding: 5px;
          width: 24px;
          height: 24px;
          top: 4px;

          --mdc-icon-size: 1.5em;
        }

        mwc-icon:hover {
          background-color: darkgray;
          color: white;
        }
      `
    ]
  }

  constructor() {
    super()

    this.board = {}
  }

  stateChanged(state) {
    this.group = state.boardGroupCurrent
    this.locale = state.auth.locale
  }

  render() {
    return html`
      <div id="card">
        <div @click="${e => this.onClickViewer(e)}" front>
          <img src=${this.thumbnail(this.board)} />
          <div class="name">
            <h1>${this.board.name}</h1>
            <p>${this.board.description}</p>
            <mwc-icon @click="${e => this.onClickFlip(e)}" flip>redo</mwc-icon>
          </div>
        </div>

        <div back>
          <div id="info">
            <h5>${i18next.t('label.created-at')} ${this.toDateString(this.board.createdAt, this.locale)}</h5>
            <h5>${i18next.t('label.updated-at')} ${this.toDateString(this.board.updatedAt, this.locale)}</h5>

            <paper-input
              label="${i18next.t('label.name')}"
              value=${this.board.name}
              @change="${e => this.onChangeName(e)}"
            ></paper-input>
            <paper-input
              label="${i18next.t('label.description')}"
              value=${this.board.description}
              @change="${e => this.onChangeDescription(e)}"
            ></paper-input>

            <label>${i18next.t('label.fit')}</label>
            <select @change=${e => this.onChangeFit(e)} .value=${this.board.fit || 'ratio'}>
              <option value="ratio">ratio</option>
              <option value="both">both</option>
              <option value="none">none</option>
            </select>
          </div>

          <mwc-icon @click="${e => this.onClickEdit(e)}" create>create</mwc-icon>

          <div class="name">
            <h1>${this.board.name}</h1>
            <p>${this.board.description}</p>
            <mwc-icon @click="${e => this.onClickDelete(e)}" delete>delete</mwc-icon>
            <mwc-icon @click="${e => this.onClickFlip(e)}" flip>undo</mwc-icon>
          </div>
        </div>
      </div>
    `
  }

  connectedCallback() {
    super.connectedCallback()

    this.contextmenuList = [
      {
        name: 'copy',
        action: () => {
          console.log('copy!', this)
        }
      },
      {
        name: 'edit',
        action: e => {
          this.onClickEdit(e)
        }
      }
    ]

    this.addEventListener('contextmenu', e => {
      e.preventDefault()

      store.dispatch(showContextmenu(e.clientX, e.clientY, this.contextmenuList))

      // var shell = document.querySelector('app-shell')
      // var showContextmenu = _ => {
      //   shell.contextmenu.show(e.clientX, e.clientY, this.contextmenuList)
      // }

      // showContextmenu()
    })
  }

  stateChanged(state) {
    this.group = state.boardGroupCurrent
    this.locale = state.auth.locale
  }

  onClickFlip(e) {
    if (this.classList.contains('flipped') && e.target.icon == 'icons:redo') {
      this.onClickEdit(e)
    } else {
      this.classList.toggle('flipped')
    }
    e.stopPropagation()
  }

  onClickDelete(e) {
    if (this.group.type === 'group') {
      store
        .dispatch(deleteBoard(this.board, this.group))
        .then(dispatch => {
          return dispatch(fetchBoardList('group', this.group.id))
        })
        .then(dispatch => {
          dispatch(setRoute('group', this.group.id))
        })
    } else {
      store.dispatch(leavePlayGroup(this.board.id, this.group))
    }
    e.stopPropagation()
  }

  onChangeName(e) {
    var input = e.target
    this.board.name = input.value

    store.dispatch(
      updateBoard({
        id: this.board.id,
        name: input.value
      })
    )
    e.stopPropagation()
    this.requestUpdate()
  }

  onChangeDescription(e) {
    var input = e.target
    this.board.description = input.value

    store.dispatch(
      updateBoard({
        id: this.board.id,
        description: input.value
      })
    )
    e.stopPropagation()
    this.requestUpdate()
  }

  onChangeFit(e) {
    var select = e.target
    this.board.fit = select.value

    store.dispatch(
      updateBoard({
        id: this.board.id,
        fit: select.value
      })
    )
    e.stopPropagation()
    this.requestUpdate()
  }

  onClickEdit(e) {
    store.dispatch(setRoute('modeller', this.board.id))
    e.stopPropagation()
  }

  onClickViewer(e) {
    store.dispatch(setRoute('viewer', this.board.id))
    e.stopPropagation()
  }

  thumbnail(board) {
    return board.thumbnail || 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='
  }

  toDateString(t, locale) {
    return t ? new Date(Number(t)).toLocaleString(locale) : ''
  }
}

customElements.define(BoardCard.is, BoardCard)
