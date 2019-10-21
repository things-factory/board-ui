/**
 * @license Copyright © HatioLab Inc. All rights reserved.
 */

import { LitElement, html, css } from 'lit-element'

import '@things-factory/i18n-base'
import '../../editors/things-editor-buttons-radio'
import '../../editors/things-editor-angle-input'

import { PropertySharedStyle } from '../property-shared-style'
import { BoxPaddingEditorStyles } from './box-padding-editor-styles'

class PropertyShapes extends LitElement {
  static get is() {
    return 'property-shape'
  }

  static get properties() {
    return {
      value: Object,
      bounds: Object,
      selected: Array
    }
  }

  static get styles() {
    return [
      PropertySharedStyle,
      BoxPaddingEditorStyles,
      css`
        .icon-label label {
          background: url(./assets/images/icon-properties-label.png) 7px -900px no-repeat;
        }

        .icon-label label.width {
          background-position: 7px -96px;
        }

        .icon-label label.height {
          background-position: 7px 4px;
        }

        .icon-label label.rotate {
          background-position: 7px -198px;
        }

        .icon-label label.twidth {
          background-position: 7px -296px;
        }

        .icon-label label.theight {
          background-position: 7px -396px;
        }

        .icon-label label.zPos {
          background-position: 5px -1098px;
        }

        .icon-label label.depth {
          background-position: 5px -1198px;
        }

        .icon-label label.rotationX {
          background-position: 5px -1296px;
        }

        .icon-label label.rotationY {
          background-position: 5px -1396px;
        }

        .icon-label label.rotationZ {
          background-position: 5px -1496px;
        }

        things-editor-buttons-radio paper-button {
          background: url(./assets/images/icon-properties.png) no-repeat;
        }

        things-editor-buttons-radio paper-button[data-value='left'] {
          background-position: 50% 3px;
        }

        things-editor-buttons-radio paper-button[data-value='center'] {
          background-position: 50% -47px;
        }

        things-editor-buttons-radio paper-button[data-value='right'] {
          background-position: 50% -97px;
        }

        things-editor-buttons-radio paper-button[data-value='justify'] {
          background-position: 50% -147px;
        }

        things-editor-buttons-radio paper-button[data-value='top'] {
          background-position: 50% -197px;
        }

        things-editor-buttons-radio paper-button[data-value='middle'] {
          background-position: 50% -193px;
        }

        things-editor-buttons-radio paper-button[data-value='bottom'] {
          background-position: 50% -188px;
        }

        things-editor-buttons-radio paper-button[active] {
          border-color: #f2471c;
        }
      `
    ]
  }

  constructor() {
    super()

    this.value = {}
    this.bounds = {}
    this.selected = []
  }

  firstUpdated() {
    this.shadowRoot.addEventListener('change', this._onValueChange.bind(this))
  }

  render() {
    return html`
      <fieldset>
        <div class="property-grid">
          ${this._isIdentifiable(this.selected)
            ? html`
                <label> <i18n-msg msgid="label.id">ID</i18n-msg> </label>
                <input value-key="id" .value=${this.value.id || ''} />
              `
            : html``}
          ${this._isClassIdentifiable(this.selected)
            ? html`
                <label> <i18n-msg msgid="label.class">Class</i18n-msg> </label>
                <input value-key="class" .value=${this.value.class || ''} />
              `
            : html``}
          ${this._hasTextProperty(this.selected)
            ? html`
                <label> <i18n-msg msgid="label.text">Text</i18n-msg> </label>
                <input value-key="text" .value=${this.value.text || ''} />
                <label> <i18n-msg msgid="label.text-format">Text Format</i18n-msg> </label>
                <input value-key="textFormat" .value=${this.value.textFormat || ''} list="format-list" />
                <datalist id="format-list">
                  <option value="#,###."> </option>
                  <option value="#,###.#"> </option>
                  <option value="#,###.0"> </option>
                  <option value="#,##0.#"> </option>
                  <option value="#,##0.0"> </option>
                  <option value="#,##0.0%"> </option>
                </datalist>
              `
            : html``}
          ${this._hasProperties(this.selected)
            ? html`
                <div class="checkbox-row">
                  <input value-key="hidden" type="checkbox" .checked=${this.value.hidden} />
                  <label> <i18n-msg msgid="label.item-hidden">Item Hidden</i18n-msg> </label>

                  <input value-key="locked" type="checkbox" .checked=${this.value.locked} />
                  <label> <i18n-msg msgid="label.locked">Locked</i18n-msg> </label>
                </div>
              `
            : html``}
        </div>
      </fieldset>

      ${this._isLine(this.selected)
        ? html`
            <fieldset class="icon-label unit ratio">
              <legend><i18n-msg msgid="label.size">size</i18n-msg></legend>

              <div class="property-grid">
                <label class="width"> <i18n-msg msgid="label.width">width</i18n-msg> </label>
                <input type="number" value-key="bounds.width" .value=${this.bounds.width} />
                <label class="height"> <i18n-msg msgid="label.height">height</i18n-msg> </label>
                <input type="number" value-key="bounds.height" .value=${this.bounds.height} />

                ${this.selected.length && this.selected[0].isRootModel()
                  ? html``
                  : html`
                      <label class="rotate"> <i18n-msg msgid="label.rotate">rotate</i18n-msg> </label>
                      <things-editor-angle-input value-key="rotation" .radian=${this.value.rotation}>
                      </things-editor-angle-input>
                    `}
              </div>
            </fieldset>
          `
        : html``}
      ${this._is3dish(this.selected)
        ? html`
            <fieldset class="icon-label unit ratio">
              <legend><i18n-msg msgid="label.3dish">3D</i18n-msg></legend>

              <div class="property-grid">
                <label class="zPos"> <i18n-msg msgid="label.z-pos">pos. Z</i18n-msg> </label>
                <input type="number" value-key="zPos" .value=${this.value.zPos} />
                <label class="depth"> <i18n-msg msgid="label.depth">depth</i18n-msg> </label>
                <input type="number" value-key="depth" .value=${this.value.depth} />

                <label class="rotationX"> <i18n-msg msgid="label.rotation-x">rot. X</i18n-msg> </label>
                <things-editor-angle-input value-key="rotationX" .radian=${this.value.rotationX}>
                </things-editor-angle-input>

                <label class="rotationY"> <i18n-msg msgid="label.rotation-y">rot. Y</i18n-msg> </label>
                <things-editor-angle-input value-key="rotationY" .radian=${this.value.rotationY}>
                </things-editor-angle-input>

                <label class="rotationZ"> <i18n-msg msgid="label.rotation-z">rot. Z</i18n-msg> </label>
                <things-editor-angle-input value-key="rotation" .radian=${this.value.rotation}>
                </things-editor-angle-input>
              </div>
            </fieldset>
          `
        : html``}
      ${this._hasTextProperty(this.selected)
        ? html`
            <fieldset>
              <legend><i18n-msg msgid="label.text-box">text box</i18n-msg></legend>

              <div class="property-grid">
                <label> <i18n-msg msgid="label.horizontal">horizontal</i18n-msg> </label>
                <things-editor-buttons-radio value-key="textAlign" .value=${this.value.textAlign}>
                  <paper-button data-value="left"></paper-button>
                  <paper-button data-value="center"></paper-button>
                  <paper-button data-value="right"></paper-button>
                  <paper-button data-value="justify"></paper-button>
                </things-editor-buttons-radio>

                <label> <i18n-msg msgid="label.vertical">vertical</i18n-msg> </label>
                <things-editor-buttons-radio value-key="textBaseline" .value=${this.value.textBaseline}>
                  <paper-button data-value="top"></paper-button>
                  <paper-button data-value="middle"></paper-button>
                  <paper-button data-value="bottom"></paper-button>
                </things-editor-buttons-radio>

                <div class="checkbox-row">
                  <input type="checkbox" value-key="textWrap" .checked=${this.value.textWrap} />
                  <label> <i18n-msg msgid="label.text-wrap">Text Wrap</i18n-msg> </label>
                </div>

                <label> <i18n-msg msgid="label.padding">padding</i18n-msg> </label>
                <table class="box-padding">
                  <tr>
                    <td class="slide1"></td>
                    <td class="slide2"></td>
                    <td class="slide3"></td>
                  </tr>
                  <tr>
                    <td class="slide4"></td>
                    <td class="slide5">
                      <input type="number" value-key="paddingTop" .value=${this.value.paddingTop} />
                      <input type="number" value-key="paddingLeft" .value=${this.value.paddingLeft} />
                      <input type="number" value-key="paddingRight" .value=${this.value.paddingRight} />
                      <input type="number" value-key="paddingBottom" .value=${this.value.paddingBottom} />
                    </td>
                    <td class="slide6"></td>
                  </tr>
                  <tr>
                    <td class="slide7"></td>
                    <td class="slide8"></td>
                    <td class="slide9"></td>
                  </tr>
                </table>
              </div>
            </fieldset>
          `
        : html``}
      ${this.selected.length && this.selected[0].isRootModel()
        ? html`
            <fieldset class="icon-label">
              <legend><i18n-msg msgid="label.viewer-option">Viewer Option</i18n-msg></legend>

              <div class="property-grid">
                <label><i18n-msg msgid="label.fit">Fit</i18n-msg></label>
                <select value-key="fitMode" .value=${this.value.fitMode || 'ratio'}>
                  <option value="none">none</option>
                  <option value="ratio" selected>ratio</option>
                  <option value="both">both</option>
                  <option value="width">width</option>
                  <option value="height">height</option>
                </select>
                </things-editor-angle-input>
              </div>
            </fieldset>
            <fieldset class="icon-label">
              <legend><i18n-msg msgid="label.label-print">Print Option</i18n-msg></legend>

              <div class="property-grid">
                <label class="rotate"><i18n-msg msgid="label.label-rotation">Label Rotation</i18n-msg></label>
                <select value-key="labelRotation" .value=${this.value.labelRotation || 'N'}>
                  <option value="N" selected>0°</option>
                  <option value="B">90°</option>
                  <option value="I">180°</option>
                  <option value="R">270°</option>
                </select>
                </things-editor-angle-input>
              </div>
            </fieldset>
          `
        : html``}
    `
  }

  _onValueChange(e) {
    var element = e.target
    var key = element.getAttribute('value-key')

    if (!key) {
      return
    }

    var value

    switch (element.tagName) {
      case 'THINGS-EDITOR-ANGLE-INPUT':
        value = Number(element.radian) || 0
        break

      case 'INPUT':
        switch (element.type) {
          case 'checkbox':
            value = element.checked
            break
          case 'number':
            value = Number(element.value) || 0
            break
          case 'text':
            value = String(element.value)
        }
        break

      case 'PAPER-BUTTON':
        value = element.active
        break

      case 'PAPER-LISTBOX':
        value = element.selected
        break

      default:
        value = element.value
        break
    }

    if (key.indexOf('bounds.') == 0) {
      this.dispatchEvent(
        new CustomEvent('bounds-change', {
          bubbles: true,
          composed: true,
          detail: {
            [key.substr(7)]: value
          }
        })
      )
    } else {
      this.dispatchEvent(
        new CustomEvent('property-change', {
          bubbles: true,
          composed: true,
          detail: {
            [key]: value
          }
        })
      )
    }
  }

  _hasTextProperty(selected) {
    for (let i = 0; i < selected.length; i++) {
      if (!selected[i].hasTextProperty) return false
    }

    return true
  }

  _hasProperties(selected) {
    if (!selected || selected.length == 0 || (selected[0] && selected[0].isLayer && selected[0].isLayer())) return false

    return true
  }

  _isIdentifiable(selected) {
    if (!selected || selected.length == 0 || selected.length > 1 || (selected[0].isLayer && selected[0].isLayer()))
      return false

    return true
  }

  _isClassIdentifiable(selected) {
    if (!selected || (selected[0] && selected[0].isLayer && selected[0].isLayer())) return false

    return true
  }

  _isLine(selected) {
    if (!selected || (selected[0] && selected[0].isLine && selected[0].isLine())) return false

    return true
  }

  _is3dish(selected) {
    if (!selected || !(selected[0] && selected[0].is3dish && selected[0].is3dish())) return false

    return true
  }
}

customElements.define(PropertyShapes.is, PropertyShapes)
