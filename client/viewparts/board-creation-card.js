import { LitElement, html, css } from 'lit-element'
import { i18next, localize } from '@things-factory/i18n-base'
import { openPopup } from '@things-factory/layout-base'

import '@material/mwc-icon'

import './board-creation-popup'

export class BoardCreationCard extends localize(i18next)(LitElement) {
  static get properties() {
    return {
      /* default group id */
      defaultGroup: String,
      groups: Array
    }
  }

  static get styles() {
    return [
      css`
        :host {
          display: flex;
          border: var(--card-list-create-border);
          border-radius: var(--card-list-create-border-radius);

          background-color: #fff;

          align-content: center;
          justify-content: center;
        }

        div {
          text-align: center;
          font-size: 0.8em;
          color: var(--card-list-create-color);
          text-transform: capitalize;
        }

        mwc-icon {
          display: block;
          font-size: 3.5em;
          color: var(--card-list-create-icon-color);
        }
      `
    ]
  }

  render() {
    return html`<div @click=${e => this.onClick()}><mwc-icon>add_circle_outline</mwc-icon>create board</div> `
  }

  onClick(e) {
    if (this.popup) {
      delete this.popup
    }

    /*
     * 기존 설정된 이미지가 선택된 상태가 되게 하기 위해서는 selector에 value를 전달해줄 필요가 있음.
     * 주의. value는 object일 수도 있고, string일 수도 있다.
     * string인 경우에는 해당 보드의 id로 해석한다.
     */
    var template = html`
      <board-creation-popup
        .defaultGroup=${this.defaultGroup}
        .groups=${this.groups}
        @create-board=${async e => {
          var { name, description, groupId } = e.detail

          this.dispatchEvent(
            new CustomEvent('create-board', {
              detail: {
                name,
                description,
                groupId
              }
            })
          )

          this.popup && this.popup.close()
        }}
      ></board-creation-popup>
    `

    this.popup = openPopup(template, {
      backdrop: true,
      size: 'large',
      title: i18next.t('title.create-board')
    })
  }

  reset() {}
}

customElements.define('board-creation-card', BoardCreationCard)
