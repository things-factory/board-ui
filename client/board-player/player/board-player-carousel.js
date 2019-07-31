import { LitElement, html, css } from 'lit-element'
import { FlattenedNodesObserver } from '@polymer/polymer/lib/utils/flattened-nodes-observer'

import './board-player-grid'

class BoardPlayerCarousel extends LitElement {
  static get is() {
    return 'board-player-carousel'
  }

  static get properties() {
    return {
      axis: String,
      rows: Number,
      columns: Number
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
          margin: 0 auto 0px;
          -webkit-perspective: 1200px;
          -moz-perspective: 1200px;
          -o-perspective: 1200px;
          perspective: 1200px;
        }

        #carousel {
          width: 100%;
          height: 100%;
          margin: 0px auto 0px;

          position: absolute;
          -webkit-transform-style: preserve-3d;
          -moz-transform-style: preserve-3d;
          -o-transform-style: preserve-3d;
          transform-style: preserve-3d;
          -webkit-transition: -webkit-transform 1.5s;
          -moz-transition: -moz-transform 1.5s;
          -o-transition: -o-transform 1.5s;
          transition: transform 1.5s;
        }

        #carousel > * {
          position: absolute;
          width: 100%;
          height: 100%;
          font-weight: bold;
          -webkit-transition: opacity 1.5s, -webkit-transform 1.5s;
          -moz-transition: opacity 1.5s, -moz-transform 1.5s;
          -o-transition: opacity 1.5s, -o-transform 1.5s;
          transition: opacity 1.5s, transform 1.5s;

          -webkit-backface-visibility: hidden;
          -moz-backface-visibility: hidden;
          -o-backface-visibility: hidden;
          backface-visibility: hidden;
        }
      `
    ]
  }

  render() {
    return html`
      <slot id="slot" select="[page]"></slot>

      <div id="carousel"></div>
    `
  }

  disconnectedCallback() {
    super.disconnectedCallback()

    this._slotObserver.disconnect()

    if (this.boundResize) {
      window.removeEventListener('resize', this.boundResize)
      delete this.boundResize
    }
  }

  firstUpdated() {
    this.rotation = 0
    this._slotObserver = new FlattenedNodesObserver(this.shadowRoot.querySelector('#slot'), info => {
      this.build()
    })

    this.boundResize = this.build.bind(this)

    window.addEventListener('resize', this.boundResize)
  }

  get carousel() {
    return this.shadowRoot.querySelector('#carousel')
  }

  updated(change) {
    change.has('axis') && this._onAxisChanged(this.axis)
  }

  build() {
    var pages = Array.from(this.querySelectorAll('[page]'))
    var panel = Array.from(this.carousel.querySelectorAll('board-player-grid')).pop()

    var rows = this.rows || 1
    var columns = this.columns || 1

    var i = panel ? panel.querySelectorAll('[page]').length : 0
    var page = pages.shift()

    while (page) {
      if (!(i++ % (rows * columns))) {
        panel = document.createElement('board-player-grid')
        panel.rows = rows
        panel.columns = columns

        this.carousel.appendChild(panel)
      }
      panel.appendChild(page)

      page = pages.shift()
    }

    this.start()
  }

  start() {
    var panels = this.carousel.querySelectorAll('board-player-grid')

    this.isHorizontal = this.axis === 'y'

    this.panelCount = panels.length

    this.panelSize = this.carousel[this.isHorizontal ? 'offsetWidth' : 'offsetHeight'] || '640'
    this.rotateFn = this.isHorizontal ? 'rotateY' : 'rotateX'
    this.theta = 360 / (this.panelCount || 1)

    // do some trig to figure out how big the carousel is in 3D space
    this.radius = Math.round(this.panelSize / 2 / Math.tan(Math.PI / (this.panelCount < 2 ? 2 : this.panelCount)))

    for (let i = 0; i < this.panelCount; i++) {
      let panel = panels[i]
      let angle = this.theta * i
      panel.style.opacity = 1

      panel.style.backgroundColor = 'white'

      panel.style.transform = this.rotateFn + '(' + angle + 'deg) translateZ(' + this.radius + 'px)'
    }

    // adjust rotation so panels are always flat
    this.rotation = Math.round(this.rotation / this.theta) * this.theta
    this._transform()
  }

  stop() {
    this.carousel.innerHTML = ''
  }

  _onAxisChanged(after) {
    this.start()
  }

  _transform() {
    // push the carousel back in 3D space, and rotate it
    this.carousel.style.transform = 'translateZ(-' + this.radius + 'px) ' + this.rotateFn + '(' + this.rotation + 'deg)'
    this.dispatchEvent(new CustomEvent('transform', { bubbles: true, composed: true }))
  }

  previous() {
    this.rotation += this.theta
    this._transform()
  }

  next() {
    this.rotation -= this.theta
    this._transform()
  }
}

customElements.define(BoardPlayerCarousel.is, BoardPlayerCarousel)
