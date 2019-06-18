import { css, html, LitElement } from 'lit-element'

import '@material/mwc-icon/mwc-icon'

export default class GroupBar extends LitElement {
  static get styles() {
    return [
      css`
        :host {
          background-color: var(--secondary-dark-color);

          overflow-x: hidden;
        }

        ul {
          display: block;
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

        mwc-icon {
          vertical-align: middle;
        }
      `
    ]
  }

  static get properties() {
    return {
      groups: Array,
      groupId: String
    }
  }

  render() {
    return html`
      <ul>
        <li ?active=${this.groupId !== 0 && !this.groupId}>
          <a href="/board-list"><mwc-icon>home</mwc-icon></a>
        </li>

        <li ?active=${this.groupId === 'favor'}>
          <a href="/board-list/favor"><mwc-icon>star</mwc-icon></a>
        </li>

        ${this.groups.map(
          group => html`
            <li ?active=${this.groupId === group.id}>
              <a href=${`/board-list/${group.id}`}>${group.name}</a>
            </li>
          `
        )}
      </ul>
    `
  }

  _onWheelEvent(e) {
    var delta = Math.max(-1, Math.min(1, e.wheelDelta || -e.detail))
    this.scrollLeft -= delta * 40

    e.preventDefault()
  }

  firstUpdated() {
    this.addEventListener('mousewheel', this._onWheelEvent.bind(this), false)
  }
}

window.customElements.define('group-bar', GroupBar)
