import { LitElement, html, css } from 'lit-element'

import '@material/mwc-fab/mwc-fab'
import '@material/mwc-icon/mwc-icon'
import SwipeListener from 'swipe-listener'

import './board-wrapper'

import './player/board-player-carousel'

import { togglefullscreen, exitfullscreen } from '@things-factory/shell'

import { style } from './board-player-style'

export class BoardPlayer extends LitElement {
  constructor() {
    super()

    this.boards = []

    this.playtime = 30
    this.columns = 1
    this.rows = 1
    this.started = false
    this.fullscreened = false
  }

  static get properties() {
    return {
      boards: Array,

      playtime: Number,
      columns: Number,
      rows: Number,
      started: Boolean,
      playing: Boolean,
      fullscreened: Boolean
    }
  }

  static get styles() {
    return [style]
  }

  render() {
    return html`
      <slot @mousemove=${e => this.onMousemove(e)} @transform=${e => this.onTransform(e)} tabindex="-1">
        ${
          this.started
            ? html`
                <board-player-carousel axis="y" .rows=${this.rows} .columns=${this.columns} player>
                  ${this.boards.map(
                    item => html`
                      <board-wrapper page .sceneId=${item.id}> </board-wrapper>
                    `
                  )}
                </board-player-carousel>
              `
            : html``
        }
      </slot>

      <div id="control" @mouseover=${e => this.onMouseoverControl(e)} hidden>
        <div id="joystick">
          <mwc-icon id="up" @click=${e => this.onTapUp(e)}>keyboard_arrow_up</mwc-icon>
          <mwc-icon id="left" @click=${e => this.onTapLeft(e)}>keyboard_arrow_left</mwc-icon>
          <mwc-icon id="play" @click=${e => this.onTapPlay(e)} ?hidden=${this.playing}>play_arrow</mwc-icon>
          <mwc-icon id="pause" @click=${e => this.onTapPause(e)} ?hidden=${!this.playing}>pause</mwc-icon>
          <mwc-icon id="right" @click=${e => this.onTapRight(e)}>keyboard_arrow_right</mwc-icon>
          <mwc-icon id="down" @click=${e => this.onTapDown(e)}>keyboard_arrow_down</mwc-icon>
        </div>  

        <div id="setting-container">
          <div id="setting">
            <div id="schedule-container">
              <mwc-icon id="schedule">schedule</mwc-icon>
              <input .value=${this.playtime} @change=${e => (this.playtime = e.target.value)}></input>
                sec.
            </div>
            <div id="grid-setting-container">
              <mwc-icon id="view_module">view_module</mwc-icon>            
              <select .value=${this.rows} @change=${e => (this.rows = e.target.value)}>
                ${[1, 2, 3, 4, 5].map(
                  row => html`
                    <option>${row}</option>
                  `
                )}
              </select>
              x
              <select .value=${this.columns} @change=${e => (this.columns = e.target.value)}>
                ${[1, 2, 3, 4, 5].map(
                  column => html`
                    <option>${column}</option>
                  `
                )}
              </select>
            </div>
          </div>

          <div id="etc">
            <mwc-icon id="fullscreen" @click=${e => this.onTapFullscreen(e)} ?hidden=${this.fullscreened}
            >fullscreen</mwc-icon>
            <mwc-icon id="fullscreen-exit" @click=${e => this.onTapFullscreen(e)} ?hidden=${!this.fullscreened}
            >fullscreen_exit</mwc-icon>
            <mwc-icon id="close" @click=${e => this.onTapClose(e)}>close</mwc-icon>
          </div>     
        </div>   
      </div>
    `
  }

  firstUpdated() {
    SwipeListener(this)

    this.addEventListener('swipe', e => {
      var directions = e.detail.directions

      if (directions.left) {
        this.onTapRight()
      } else if (directions.right) {
        this.onTapLeft()
      } else if (directions.top) {
        this.onTapDown()
      } else if (directions.bottom) {
        this.onTapUp()
      }
    })
  }

  updated(changes) {
    if (changes.has('boards') || changes.has('columns') || changes.has('rows')) {
      this.boards && this.boards.length > 0 ? this.restart() : this.stop()
    } else if (changes.has('playtime') && this.playing) {
      this._resetTransformTimer()
    }
  }

  get control() {
    return this.shadowRoot.getElementById('control')
  }

  get fullscreen() {
    return this.shadowRoot.getElementById('fullscreen')
  }

  async _resetFadeTimer(stop) {
    if (!this._control_animation) {
      this._control_animation = this.control.animate(
        [
          {
            opacity: 1,
            easing: 'ease-in'
          },
          { opacity: 0 }
        ],
        { delay: 1000, duration: 2000 }
      )
    }

    this.control.hidden = false

    this._control_animation.cancel()
    if (stop) return

    try {
      this._control_animation.play()
      await this._control_animation.finished
      this.control.hidden = true
    } catch (e) {
      /* cancelled */
    }
  }

  _resetTransformTimer() {
    clearTimeout(this._transfer_timer)

    this.playing = true

    if (this.currentPlayer) {
      this._transfer_timer = setTimeout(() => {
        if (this._transfer_timer) this.currentPlayer.next()
      }, this.playtime * 1000)
    }
  }

  onMousemove() {
    this._resetFadeTimer()
  }

  onMouseoverControl() {
    this._resetFadeTimer(true)
  }

  onTapFullscreen() {
    togglefullscreen(
      this,
      () => {
        this.fullscreened = true
        this.focus()
      },
      () => {
        this.fullscreened = false
        this.focus()
      }
    )
  }

  onTransform() {
    requestAnimationFrame(() => this.started && this.playing && this._resetTransformTimer())
  }

  onTapPlay(e) {
    this._resetTransformTimer()
  }

  onTapPause(e) {
    clearTimeout(this._transfer_timer)
    this.playing = false
  }

  onTapLeft(e) {
    this.currentPlayer.axis = 'y'
    this.currentPlayer.previous()
  }

  onTapRight(e) {
    this.currentPlayer.axis = 'y'
    this.currentPlayer.next()
  }

  onTapUp(e) {
    this.currentPlayer.axis = 'x'
    this.currentPlayer.next()
  }

  onTapDown(e) {
    this.currentPlayer.axis = 'x'
    this.currentPlayer.previous()
  }

  onTapClose(e) {
    if (this.fullscreened) {
      exitfullscreen()
    }

    window.history.back()
  }

  async restart() {
    await this.stop()
    await this.start()
  }

  async start() {
    if (!this.boards || this.boards.length == 0) return

    this.started = true
    this.playing = true

    await this.renderComplete
    this.currentPlayer = this.shadowRoot.querySelector(':not([style*="display: none"])[player]')

    this._resetTransformTimer()
    this._resetFadeTimer()

    this.focus()
  }

  async stop() {
    clearTimeout(this._transfer_timer)

    this.currentPlayer && this.currentPlayer.stop()

    await this.renderComplete
    this.started = false
  }
}

customElements.define('board-player', BoardPlayer)
