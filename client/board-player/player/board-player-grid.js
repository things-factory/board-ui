import { LitElement, html, css } from 'lit-element'
import { FlattenedNodesObserver } from '@polymer/polymer/lib/utils/flattened-nodes-observer'

/**
 * 자식 컴포넌트들을 그리드형태로 화면에 배치하여 한꺼번에 디스플레이해주는 컴포넌트.
 * Example:
    <board-player-grid rows="3" columns="3" tabindex="0" focus>
      <div page>A</div>
      <div page>B</div>
      <div page>C</div>
      <div page>D</div>
    </board-player-grid>
 */

class BoardPlayerGrid extends LitElement {
  static get properties() {
    return {
      rows: Number,
      columns: Number
    }
  }

  static get styles() {
    return [
      css`
        :host {
          width: 100%;
          height: 100%;
          position: relative;

          display: grid;
          grid-gap: 0px;
          grid-auto-flow: dense;
        }
      `
    ]
  }

  render() {
    return html`
      <slot id="slot" select="[page]"></slot>
    `
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this._slotObserver && this._slotObserver.disconnect()
  }

  firstUpdated() {
    this._slotObserver = new FlattenedNodesObserver(this.shadowRoot.querySelector('#slot'), info => {
      var columns = this.columns || 1
      var rows = this.rows || 1

      this.style['grid-template-columns'] = `repeat(${columns}, 1fr)`
      this.style['grid-template-rows'] = `repeat(${rows}, 1fr)`
    })
  }

  start() {}

  stop() {}

  next() {}

  previous() {}
}

customElements.define('board-player-grid', BoardPlayerGrid)
