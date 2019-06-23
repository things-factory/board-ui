import { LitElement, html, css } from 'lit-element'
import { FlattenedNodesObserver } from '@polymer/polymer/lib/utils/flattened-nodes-observer'

import './board-player-grid'

class BoardPlayerFlipcardEdge extends LitElement {
  static get properties() {
    return {
      axis: String
    }
  }

  static get styles() {
    return [
      css`
        :host {
          display: block;
          width: 100%;
          height: 100%;
          position: relative;
          -webkit-perspective: 1600px;
          perspective: 1600px;
        }

        #card {
          width: 100%;
          height: 100%;
          position: absolute;
          -webkit-transform-style: preserve-3d;
          transform-style: preserve-3d;
          -webkit-transition: all 1.5s ease-in-out;
          transition: all 1.5s ease-in-out;
        }

        #card {
          -webkit-transform-origin: right center;
          transform-origin: right center;
        }

        :host([axis='x']) #card {
          -webkit-transform-origin: center bottom;
          transform-origin: center bottom;
        }

        #card > [front],
        #card > [back] {
          margin: 0;
          background: white;
          position: absolute;
          width: 100%;
          height: 100%;
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
        }

        #card > [back] {
          -webkit-transform: rotateY(180deg);
          transform: rotateY(180deg);
        }

        :host([flipped]) > div {
          -webkit-transform: translateX(-100%) rotateY(-180deg);
          transform: translateX(-100%) rotateY(-180deg);
        }

        :host([axis='x']) #card > [back] {
          -webkit-transform: rotateX(180deg);
          transform: rotateX(180deg);
        }

        :host([axis='x'][flipped]) div {
          -webkit-transform: translateY(-100%) rotateX(180deg);
          transform: translateY(-100%) rotateX(180deg);
        }
      `
    ]
  }

  render() {
    return html`
      <slot id="slot" select="[page]"></slot>

      <div id="card"></div>
    `
  }

  disconnectedCallback() {
    this._slotObserver.disconnect()
    super.disconnectedCallback()

    if (this.boundResize) {
      window.removeEventListener('resize', this.boundResize)
      delete this.boundResize
    }
  }

  get card() {
    return this.shadowRoot.querySelector('#card')
  }

  firstUpdated() {
    this._slotObserver = new FlattenedNodesObserver(this.shadowRoot.querySelector('#slot'), info => {
      this.build()
    })

    this.boundResize = this.build.bind(this)

    window.addEventListener('resize', this.boundResize)
  }

  updated(change) {
    change.has('axis') && this._onAxisChanged(this.axis)
  }

  _onAxisChanged(axis) {
    this.setAttribute('axis', axis)
  }

  build() {
    var pages = Array.from(this.querySelectorAll('[page]'))
    var panel = Array.from(this.card.querySelectorAll('board-player-grid')).pop()

    var page = pages.shift()

    if (!panel) {
      var rows = this.rows || 1
      var columns = this.columns || 1
      var gridSize = rows * columns

      var i = 0

      while (page) {
        /* panel은 2개만 만든다. */
        if (!(i++ % gridSize) && i <= 2 * gridSize) {
          panel = document.createElement('board-player-grid')
          panel.rows = rows
          panel.columns = columns
          i <= gridSize ? panel.setAttribute('front', '') : panel.setAttribute('back', '')

          this.card.appendChild(panel)
        }
        panel.appendChild(page)

        page = pages.shift()
      }
    }

    this.start()
  }

  start() {}

  stop() {
    this.card.innerHTML = ''
  }

  next() {
    if (this.hasAttribute('flipped')) {
      this.removeAttribute('flipped')
    } else {
      this.setAttribute('flipped', '')
    }

    this.dispatchEvent(new CustomEvent('transform', { bubbles: true, composed: true }))
  }

  previous() {
    this.next()
  }
}

customElements.define('board-player-flipcard-edge', BoardPlayerFlipcardEdge)
