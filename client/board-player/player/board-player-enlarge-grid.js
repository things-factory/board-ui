import { LitElement, html, css } from 'lit-element'
import { FlattenedNodesObserver } from '@polymer/polymer/lib/utils/flattened-nodes-observer'

class BoardPlayerEnlargeGrid extends LitElement {
  static get properties() {
    return {}
  }

  static get styles() {
    return [
      css`
        :host {
          width: 100%;
          height: 100%;
          position: relative;

          display: grid;
          grid-gap: 5px;
          grid-auto-flow: dense;
        }

        ::slotted(*) {
          border: 1px solid #ccc;
        }
      `
    ]
  }

  render() {
    return html`
      <slot id="slot" select="[page]" @click="${e => this.onClick(e)}"></slot>
    `
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this._slotObserver.disconnect()
  }

  firstUpdated() {
    this._slotObserver = new FlattenedNodesObserver(this.shadowRoot.querySelector('#slot'), info => {
      var panels = this.querySelectorAll('[page]')
      var length = panels.length
      var column = length >= 10 ? Math.ceil(length / 2) : 6
      var row = length >= 10 ? column - 1 : 6

      this.style['grid-template-columns'] = `repeat(${column}, 1fr)`
      this.style['grid-template-rows'] = `repeat(${column}, 1fr)`

      if (this._styleElement) {
        this._styleElement.remove()
      }

      this._styleElement = document.createElement('style')
      this._styleElement.textContent = `
      ::slotted(.enlarge) {
        grid-column: span ${column - 1};
        grid-row: span ${row};
      }
      `
      this.shadowRoot.appendChild(this._styleElement)

      this.changeEnlarge()
    })
  }

  changeEnlarge(target) {
    var panels = this.querySelectorAll('[page]')
    target = target || panels[0]
    if (!target) return

    Array.from(panels).forEach(panel => {
      panel.style['order'] = 2
      panel.classList.remove('enlarge')
    })

    target.style['order'] = 1
    target.classList.add('enlarge')

    dispatchEvent(new Event('resize'))
  }

  onClick(e) {
    var current = this.querySelector('.enlarge')
    if (current !== e.target) {
      this.changeEnlarge(e.target)
    }
  }

  start() {}

  stop() {}

  next() {
    this.dispatchEvent(new CustomEvent('transform', { bubbles: true, composed: true }))
  }

  previous() {
    this.next()
  }
}

customElements.define('board-player-enlarge-grid', BoardPlayerEnlargeGrid)
