import { LitElement, html, css } from 'lit-element'

import '@material/mwc-icon'

import { openPopup } from '@things-factory/layout-base'
import '../viewparts/board-selector'
import { i18next } from '@things-factory/i18n-base'
import './board-renderer'

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

      board-renderer {
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
    return html`
      <board-renderer .value=${this.value}></board-renderer>
      <mwc-icon>arrow_drop_down</mwc-icon>
    `
  }

  async firstUpdated() {
    this.value = this.record[this.column.name]

    await this.updateComplete

    this.shadowRoot.addEventListener('click', e => {
      e.stopPropagation()

      this.openSelector()
    })

    this.openSelector()
  }

  openSelector() {
    if (this.popup) {
      delete this.popup
    }

    /*
     * 기존 설정된 보드가 선택된 상태가 되게 하기 위해서는 selector에 value를 전달해줄 필요가 있음.
     * 주의. value는 object일 수도 있고, string일 수도 있다.
     * string인 경우에는 해당 보드의 id로 해석한다.
     */
    var value = this.value || {}

    var template = html`
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
                after: this.column.type == 'board' ? board : board.id || '',
                record: this.record,
                column: this.column,
                row: this.row
              }
            })
          )

          this.popup && this.popup.close()
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
