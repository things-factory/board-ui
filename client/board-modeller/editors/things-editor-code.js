/**
 * @license Copyright © HatioLab Inc. All rights reserved.
 */

import { LitElement, html, css } from 'lit-element'

import CodeMirrorStyle from 'codemirror/lib/codemirror.css'
import FullScreenStyle from 'codemirror/addon/display/fullscreen.css'
import NightThemeStyle from 'codemirror/theme/night.css'

import CodeMirror from 'codemirror'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/addon/display/fullscreen'

const styles = html`
  <style>
    ${CodeMirrorStyle} ${FullScreenStyle} ${NightThemeStyle}
  </style>
`

/* ref : https://github.com/codemirror/CodeMirror/issues/2469 */
CodeMirror.defineOption('autoRefresh', false, function(cm, val) {
  if (cm.state.autoRefresh) {
    stopListening(cm, cm.state.autoRefresh)
    cm.state.autoRefresh = null
  }
  if (val && cm.display.wrapper.offsetHeight == 0)
    startListening(cm, (cm.state.autoRefresh = { delay: val.delay || 250 }))
})

function startListening(cm, state) {
  function check() {
    if (cm.display.wrapper.offsetHeight) {
      stopListening(cm, state)
      if (cm.display.lastWrapHeight != cm.display.wrapper.clientHeight) cm.refresh()
    } else {
      state.timeout = setTimeout(check, state.delay)
    }
  }
  state.timeout = setTimeout(check, state.delay)
  state.hurry = function() {
    clearTimeout(state.timeout)
    state.timeout = setTimeout(check, 50)
  }
  CodeMirror.on(window, 'mouseup', state.hurry)
  CodeMirror.on(window, 'keyup', state.hurry)
}

function stopListening(_cm, state) {
  clearTimeout(state.timeout)
  CodeMirror.off(window, 'mouseup', state.hurry)
  CodeMirror.off(window, 'keyup', state.hurry)
}

/**
WEB Component for code-mirror code editor.

Example:

  <things-editor-code value=${text}>
  </things-editor-code>
*/
export default class ThingsEditorCode extends LitElement {
  static get is() {
    return 'things-editor-code'
  }

  static get properties() {
    return {
      /**
       * `value`는 에디터에서 작성중인 contents이다.
       */
      value: String
    }
  }

  static get styles() {
    return [
      css`
        :host {
          display: block;
          position: relative;
        }

        textarea {
          display: block;
          height: 100%;
          width: 100%;
          resize: none;
          font-size: 16px;
          line-height: 20px;
          border: 0px;
          padding: 0px;
        }
      `
    ]
  }
  updated(change) {
    this._outside_changing = true
    if (change.has('value') && this.editor && !this._self_changing) {
      this.editor.setValue(this.value === undefined ? '' : String(this.value))
      this.editor.refresh()
    }
    this._outside_changing = false
  }

  render() {
    return html`
      ${styles}

      <textarea></textarea>
    `
  }

  get editor() {
    if (!this._editor) {
      let textarea = this.shadowRoot.querySelector('textarea')
      if (textarea) {
        this._editor = CodeMirror.fromTextArea(textarea, {
          value: this.value,
          mode: 'javascript',
          tabSize: 2,
          lineNumbers: false,
          showCursorWhenSelecting: true,
          theme: 'night',
          extraKeys: {
            F11: function(cm) {
              cm.setOption('fullScreen', !cm.getOption('fullScreen'))
            },
            Esc: function(cm) {
              cm.setOption('fullScreen', !cm.getOption('fullScreen'))
            }
          },
          autoRefresh: {
            delay: 500
          }
        })

        this._editor.on('blur', e => {
          if (!this._changed) return

          this.value = e.getValue()
          this.dispatchEvent(new CustomEvent('change', { bubbles: true, composed: true }))
        })

        this._editor.on('change', async e => {
          this._self_changing = true

          this._changed = true

          await this.renderComplete
          this._self_changing = false
        })
      }
    }

    return this._editor
  }
}

customElements.define(ThingsEditorCode.is, ThingsEditorCode)
