import { css, html, LitElement } from 'lit-element'

import '@material/mwc-icon'

export default class PlayGroupBar extends LitElement {
  static get styles() {
    return [
      css`
        :host {
          background-color: var(--secondary-dark-color);

          overflow-x: hidden;
        }

        ul {
          display: flex;
          list-style: none;
          margin: 5px 5px 0px 5px;
          padding: 5px 5px 0px 5px;
          white-space: nowrap;
        }

        li {
          display: inline-block;
          padding: 0 7px 5px 7px;

          border-bottom: solid 3px #242d30;
        }

        li[active] {
          border-color: red;
        }

        li a {
          text-decoration: none;
          color: rgba(255, 255, 255, 0.8);
        }

        li[active] a {
          color: rgba(255, 255, 255, 1);
          font-weight: bold;
        }

        li[padding] {
          flex: 1;
        }

        li[refresh] * {
          color: rgba(255, 255, 255, 0.5);
        }

        mwc-icon {
          vertical-align: middle;
        }
      `
    ]
  }

  static get properties() {
    return {
      groups: Array,
      groupId: String,
      targetPage: String
    }
  }

  render() {
    return html`
      <ul>
        ${(this.groups || []).map(
          group => html`
            <li ?active=${this.groupId === group.id}>
              <a href=${`${this.targetPage}/${group.id}`}>${group.name}</a>
            </li>
          `
        )}

        <li padding></li>

        <li refresh>
          <mwc-icon @click=${this._onClickRefresh.bind(this)}>refresh</mwc-icon>
        </li>
      </ul>
    `
  }

  _onWheelEvent(e) {
    var delta = Math.max(-1, Math.min(1, e.wheelDelta || -e.detail))
    this.scrollLeft -= delta * 40

    e.preventDefault()
  }

  _onClickRefresh(e) {
    this.dispatchEvent(new CustomEvent('refresh'))
  }

  firstUpdated() {
    this.addEventListener('mousewheel', this._onWheelEvent.bind(this), false)
  }
}

window.customElements.define('play-group-bar', PlayGroupBar)
