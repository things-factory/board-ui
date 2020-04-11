import { LitElement, html, css } from 'lit-element'
import { i18next, localize } from '@things-factory/i18n-base'

import '@material/mwc-textfield'
import '@material/mwc-textarea'
import '@material/mwc-select'
import '@material/mwc-list/mwc-list-item'
import '@material/mwc-button'

export class BoardCreationPopup extends localize(i18next)(LitElement) {
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
          flex-direction: column;

          padding: 10px;
          background-color: white;
        }

        :host > * {
          margin: 10px;
        }
      `
    ]
  }

  render() {
    var groups = this.groups || []

    return html`
      <mwc-textfield label=${i18next.t('label.name')} name="name" name></mwc-textfield>
      <mwc-textarea label=${i18next.t('label.description')} name="description" description></mwc-textarea>
      <mwc-select label=${i18next.t('label.group')} group>
        ${groups.map(
          group => html`
            <mwc-list-item value=${group.id} ?selected=${this.defaultGroup == group.id}>${group.name}</mwc-list-item>
          `
        )}
      </mwc-select>

      <mwc-button raised label=${i18next.t('button.create')} @click=${e => this.onClickSubmit(e)}></mwc-button>
    `
  }

  onClickSubmit(e) {
    var [name, description, groupId] = ['name', 'description', 'group'].map(attr => {
      return this.renderRoot.querySelector(`[${attr}]`).value
    })

    if (!name || !groupId) {
      return
    }

    this.dispatchEvent(
      new CustomEvent('create-board', {
        detail: {
          name,
          description,
          groupId
        }
      })
    )
  }
}

customElements.define('board-creation-popup', BoardCreationPopup)
