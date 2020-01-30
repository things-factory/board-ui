/**
 * @license Copyright © HatioLab Inc. All rights reserved.
 */

import { LitElement, html, css } from 'lit-element'
import { client } from '@things-factory/shell'
import gql from 'graphql-tag'

class ThingsEditorScenario extends LitElement {
  static get is() {
    return 'things-editor-scenario'
  }

  static get properties() {
    return {
      value: String,
      property: Object,
      _scenarios: Array
    }
  }

  static get styles() {
    return [
      css`
        :host {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: flex-end;
        }

        input {
          width: 100%;
          height: 100%;
          box-sizing: border-box;
        }
      `
    ]
  }

  render() {
    return html`
      <input
        id="text"
        type="text"
        .value=${this.value || ''}
        @change=${e => this._onInputChanged(e)}
        .placeholder=${this.getAttribute('placeholder') || ''}
        list="scenarios"
      />
      <datalist id="scenarios">
        ${this._scenarios.map(
          scenario => html`
            <option value=${scenario}></option>
          `
        )}
      </datalist>
    `
  }

  connectedCallback() {
    super.connectedCallback()

    this._scenarios = []
  }

  _onInputChanged(e) {
    e.stopPropagation()
    this.value = e.target.value

    this.dispatchEvent(new CustomEvent('change', { bubbles: true, composed: true }))
  }

  firstUpdated() {
    this._scenarios = []
    this._searchScenarioList()
  }

  async _searchScenarioList() {
    var response = await client.query({
      query: gql`
        query {
          scenarios {
            items {
              name
              id
            }
          }
        }
      `
    })
    var optionList = response.data.scenarios.items
    var scenarios = ['All']
    for (var option of optionList) {
      scenarios.push(option.name)
    }
    this._scenarios = scenarios
  }
}

customElements.define(ThingsEditorScenario.is, ThingsEditorScenario)
