/**
 * @license Copyright © HatioLab Inc. All rights reserved.
 */

import { html } from 'lit-element'
import '@things-factory/i18n-base'

import './things-editor-board-selector'

import { ThingsEditorProperty, ThingsEditorPropertyStyles } from '@things-factory/modeller-ui'

class PropertyEditorBoardSelector extends ThingsEditorProperty {
  static get styles() {
    return [ThingsEditorPropertyStyles]
  }

  editorTemplate(props) {
    return html`
      <things-editor-board-selector
        id="editor"
        .value=${props.value}
        .properties=${props.property}
      ></things-editor-board-selector>
    `
  }
}

customElements.define('property-editor-board-selector', PropertyEditorBoardSelector)
