/**
 * @license Copyright © HatioLab Inc. All rights reserved.
 */

import { LitElement, html, css } from 'lit-element'

import './specific-properties-builder'

import { PropertySharedStyle } from '../property-shared-style'

class PropertySpecific extends LitElement {
  static get is() {
    return 'property-specific'
  }

  static get properties() {
    return {
      value: Object,
      scene: Object,
      selected: Array,
      props: Array,
      propertyEditor: Array
    }
  }

  static get styles() {
    return [
      PropertySharedStyle,
      css`
        label {
          display: block;
          margin: 10px;

          text-align: right;
          font-size: 1em;
          color: #e46c2e;
          text-transform: capitalize;
        }

        #pattern-set paper-button {
          background: url('/assets/images/icon-properties-ipattern.png') no-repeat;
          display: block;
          float: left;
          margin: 0 7px 10px 0 !important;
          width: 55px;
          height: 40px;
          min-width: inherit;
        }

        #pattern-set paper-button iron-icon {
          display: none;
        }

        #pattern-set paper-button[data-value='+u+s'] {
          background-position: 50% 3px;
        }

        #pattern-set paper-button[data-value='+u-s'] {
          background-position: 50% -97px;
        }

        #pattern-set paper-button[data-value='-u+s'] {
          background-position: 50% -197px;
        }

        #pattern-set paper-button[data-value='-u-s'] {
          background-position: 50% -297px;
        }

        #pattern-set paper-button[data-value='+s+u'] {
          background-position: 50% -397px;
        }

        #pattern-set paper-button[data-value='+s-u'] {
          background-position: 50% -497px;
        }

        #pattern-set paper-button[data-value='-s+u'] {
          background-position: 50% -597px;
        }

        #pattern-set paper-button[data-value='-s-u'] {
          background-position: 50% -697px;
        }

        #pattern-set paper-button[data-value='cw'] {
          background-position: 50% -797px;
        }

        #pattern-set paper-button[data-value='ccw'] {
          background-position: 50% -897px;
        }
      `
    ]
  }

  constructor() {
    super()

    this.value = {}
    this.selected = []
    this.props = []
    this.propertyEditor = []

    this.boundTableCellBorderSet = this._onTableCellBorderSet.bind(this)
    this.boundActionClick = this._onActionClick.bind(this)
    this.boundTableCellEvent = this._onTableCellEvent.bind(this)
  }

  connectedCallback() {
    super.connectedCallback()

    this.addEventListener('table-cell-border-set', this.boundTableCellBorderSet)
    this.addEventListener('action-editor-clicked', this.boundActionClick)
    this.addEventListener('table-delete-row', this.boundTableCellEvent)
    this.addEventListener('table-delete-column', this.boundTableCellEvent)
    this.addEventListener('table-insert-above', this.boundTableCellEvent)
    this.addEventListener('table-insert-below', this.boundTableCellEvent)
    this.addEventListener('table-insert-left', this.boundTableCellEvent)
    this.addEventListener('table-insert-right', this.boundTableCellEvent)
    this.addEventListener('table-merge-cells', this.boundTableCellEvent)
    this.addEventListener('table-split-cells', this.boundTableCellEvent)
    this.addEventListener('table-distribute-horizontal', this.boundTableCellEvent)
    this.addEventListener('table-distribute-vertical', this.boundTableCellEvent)
  }

  disconnectedCallback() {
    super.disconnectedCallback()

    this.removeEventListener('table-cell-border-set', this.boundTableCellBorderSet)
    this.removeEventListener('action-editor-clicked', this.boundActionClick)
    this.removeEventListener('table-delete-row', this.boundTableCellEvent)
    this.removeEventListener('table-delete-column', this.boundTableCellEvent)
    this.removeEventListener('table-insert-above', this.boundTableCellEvent)
    this.removeEventListener('table-insert-below', this.boundTableCellEvent)
    this.removeEventListener('table-insert-left', this.boundTableCellEvent)
    this.removeEventListener('table-insert-right', this.boundTableCellEvent)
    this.removeEventListener('table-merge-cells', this.boundTableCellEvent)
    this.removeEventListener('table-split-cells', this.boundTableCellEvent)
    this.removeEventListener('table-distribute-horizontal', this.boundTableCellEvent)
    this.removeEventListener('table-distribute-vertical', this.boundTableCellEvent)
  }

  /*
   * value자체가 변경되지 않고, 내부 속성만 변경되는 경우, 외부에서 rerender()를 호출해주어서,
   * specific-properties-builder가 다시 그려지도록 한다.
   */
  rerender() {
    this.shadowRoot.querySelector('specific-properties-builder')._setValues()
  }

  render() {
    return html`
      <label>${this.value.type}</label>

      <specific-properties-builder .value=${this.value} .props=${this.props} .propertyEditor=${this.propertyEditor}>
      </specific-properties-builder>
    `
  }

  _onRackTableCellIncrementSet(e, detail) {
    if (!this.value) return

    var selected = this.selected

    var { increasingDirection, skipNumbering, startSection, startUnit } = detail

    this.scene.undoableChange(function() {
      selected.forEach(cell => {
        if (increasingDirection == 'cw') cell.increaseLocationCW(skipNumbering, startSection, startUnit)
        else cell.increaseLocationCCW(skipNumbering, startSection, startUnit)
      })
    })
  }

  _onTableCellBorderSet(e) {
    if (!this.value) return

    var { type, borderWidth, borderStyle, borderColor } = e.detail

    var table = this.selected[0].parent
    if (!table || table.get('type') !== 'table') return

    var selected = this.selected

    this.scene.undoableChange(function() {
      table.setCellsStyle(
        selected,
        {
          strokeStyle: borderColor,
          lineDash: borderStyle,
          lineWidth: borderWidth
        },
        type
      )
    })
  }

  _onActionClick(e) {
    var action = e.detail

    typeof action === 'function' && action(this.selected[0])
  }

  _onTableCellEvent(e) {
    var table = this.selected[0].parent
    if (!table || !table.get('type').match(/table$/)) return

    var self = this

    this.scene.undoableChange(function() {
      switch (e.type) {
        case 'table-delete-row':
          table.deleteRows(self.selected)
          break
        case 'table-delete-column':
          table.deleteColumns(self.selected)
          break
        case 'table-insert-above':
          table.insertCellsAbove(self.selected)
          break
        case 'table-insert-below':
          table.insertCellsBelow(self.selected)
          break
        case 'table-insert-left':
          table.insertCellsLeft(self.selected)
          break
        case 'table-insert-right':
          table.insertCellsRight(self.selected)
          break
        case 'table-merge-cells':
          table.mergeCells(self.selected)
          break
        case 'table-split-cells':
          table.splitCells(self.selected)
          break
        case 'table-distribute-horizontal':
          table.distributeHorizontal(self.selected)
          break
        case 'table-distribute-vertical':
          table.distributeVertical(self.selected)
          break
      }
    })
  }
}

window.customElements.define(PropertySpecific.is, PropertySpecific)
