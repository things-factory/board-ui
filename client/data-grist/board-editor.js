import { LitElement, html, css } from 'lit-element'

import '@material/mwc-icon'

import { openPopup } from '@things-factory/layout-base'
import '../viewparts/board-selector'

export class BoardEditor extends LitElement {
  static get properties() {
    return {
      value: Object,
      column: Object,
      record: Object,
      row: Number
    }
  }

  static get styles() {
    return css`
      :host {
        display: flex;
        flex-flow: row nowrap;
        align-items: center;

        padding: 7px 0px;
        box-sizing: border-box;

        width: 100%;
        height: 100%;

        border: 0;
        background-color: transparent;

        font: var(--grist-object-editor-font);
        color: var(--grist-object-editor-color);

        justify-content: inherit;
      }

      span {
        display: flex;
        flex: auto;

        justify-content: inherit;
      }

      mwc-icon {
        width: 20px;
        font-size: 1.5em;
        margin-left: auto;
      }
    `
  }

  render() {
    var value = this.value

    return html`
      ${!value
        ? html``
        : html`
            <span>${value.name || ''}</span>
          `}
      <mwc-icon>arrow_drop_down</mwc-icon>
    `
  }

  firstUpdated() {
    this.value = this.record[this.column.name]
    this.template = ((this.column.record || {}).options || {}).template

    this.addEventListener('click', e => {
      e.stopPropagation()

      this.openSelector()
    })

    this.openSelector()
  }

  openSelector() {
    if (this.popup) {
      delete this.popup
    }

    /* 기존 설정된 보드가 선택된 상태가 되게 하기 위해서는 selector에 value를 전달해줄 필요가 있음. */
    var value = this.value || {}

    var template =
      this.template ||
      html`
        <board-selector
          .creatable=${true}
          @board-selected=${async e => {
            var board = e.detail.board

            this.dispatchEvent(
              new CustomEvent('field-change', {
                bubbles: true,
                composed: true,
                detail: {
                  before: this.value,
                  after: board,
                  record: this.record,
                  column: this.column,
                  row: this.row
                }
              })
            )

            popup.close()
          }}
        ></board-selector>
      `

    this.popup = openPopup(template, {
      backdrop: true,
      size: 'large',
      title: i18next.t('title.select board')
    })
  }
}

customElements.define('board-editor', BoardEditor)
