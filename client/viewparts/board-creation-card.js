import { LitElement, html, css } from 'lit-element'
import { i18next, localize } from '@things-factory/i18n-base'

export default class BoardCreationCard extends localize(i18next)(LitElement) {
  static get properties() {
    return {
      /* default group id */
      defaultGroup: String
    }
  }

  static get styles() {
    return [
      css`
        :host {
          position: relative;

          padding: 0;
          margin: 0;
          height: 100%;

          -webkit-transform-style: preserve-3d;
          transform-style: preserve-3d;
          -webkit-transition: all 0.5s ease-in-out;
          transition: all 0.5s ease-in-out;
        }

        :host(.flipped) {
          -webkit-transform: rotateX(180deg);
          transform: rotateX(180deg);
        }

        [front],
        [back] {
          position: absolute;

          width: 100%;
          height: 100%;
          margin: 0;
          padding: 0;

          background-color: #fff;
          box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12),
            0 3px 1px -2px rgba(0, 0, 0, 0.2);

          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
        }

        [back] {
          -webkit-transform: rotateX(180deg);
          transform: rotateX(180deg);
        }
      `
    ]
  }

  render() {
    var groups = this.groups || []

    return html`
      <div @click=${e => this.onClickFlip(e)} front></div>

      <div @click=${e => this.onClickFlip(e)} back>
        <form>
          <label>${i18next.t('label.name')}</label>
          <input type="text" />

          <label>${i18next.t('label.description')}</label>
          <input type="text" />

          <label>${i18next.t('label.group')}</label>
          <select .value=${this.defaultGroup}>
            ${groups.map(
              group => html`
                <option value=${group.id} ?selected=${this.defaultGroup == group.id}>${group.name}</option>
              `
            )}
          </select>

          <input type="submit" @click=${e => this.onClickSubmit(e)} value=${i18next.t('button.create')} />
        </form>
      </div>
    `
  }

  onClickFlip(e) {
    var target = e.target

    if (target.hasAttribute('front') || target.hasAttribute('back')) {
      this.classList.toggle('flipped')
    }

    e.stopPropagation()
  }

  onClickSubmit(name, description, group) {
    this.dispatchEvent(
      new CustomEvent('create-board', {
        composed: true,
        bubbles: true,
        detail: {
          name,
          description,
          group
        }
      })
    )
  }
}

customElements.define('board-creation-card', BoardCreationCard)
