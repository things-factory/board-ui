/**
 * @license Copyright © HatioLab Inc. All rights reserved.
 */

import { LitElement, html, css } from 'lit-element'

import { deepClone } from '@things-factory/utils'
import { ScrollbarStyles } from '@things-factory/styles'

import noImage from '../../../assets/images/components/no-image.png'

class ComponentMenu extends LitElement {
  static get styles() {
    return [
      ScrollbarStyles,
      css`
        :host {
          display: block;

          background-color: var(--component-menu-background-color);
          margin: 0px;
          padding: 0px;

          width: 180px;
          height: 100%;

          overflow: hidden;

          border: 2px solid var(--component-menu-border-color);
          box-sizing: border-box;

          position: absolute;
          top: 0px;

          z-index: 1;
        }

        h2 {
          background-color: var(--component-menu-border-color);
          padding: 1px 5px;
          margin: 0;
          font: var(--component-menu-title);
          color: #fff;
          text-transform: capitalize;
        }

        [templates] {
          display: block;
          margin: 0;
          padding: 0;
          overflow-y: auto;

          width: 100%;
          height: 100%;
          background-color: var(--component-menu-background-color);
        }

        [template] {
          display: flex;
          align-items: center;
          min-height: var(--component-menu-item-icon-size);
          padding: 0 5px 0 0;
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
          font-size: 11px;
          color: var(--component-menu-item-color);
        }

        [template]:hover,
        [template]:focus {
          color: var(--component-menu-item-hover-color);
          font-weight: bold;
          cursor: pointer;
        }

        [template] img {
          margin: 5px;
          width: var(--component-menu-item-icon-size);
          height: var(--component-menu-item-icon-size);
        }
      `
    ]
  }

  static get properties() {
    return {
      groups: Object,
      scene: Object,
      group: String,
      templates: Array
    }
  }

  render() {
    return this.group
      ? html`
          <h2 onclick=${e => e.stopPropagation()}>${this.group} list</h2>

          <div templates>
            ${(this.templates || []).map(
              template => html`
                <div @click=${this.onClickTemplate} data-type=${template.type} template>
                  <img src=${this.templateIcon(template)} />${template.type}
                </div>
              `
            )}
          </div>
        `
      : html``
  }

  updated(changes) {
    if (changes.has('group')) {
      if (!this.group) {
        this.style.display = 'none'
        this.templates = []
      } else {
        this.style.display = 'block'
        this.templates = this.groups.find(g => g.name === this.group).templates
      }
    }
  }

  onClickTemplate(e) {
    var item = e.target

    while (!(item !== this) || !item || !item.hasAttribute || !item.hasAttribute('data-type')) {
      item = item.parentElement
    }

    var type = item.getAttribute('data-type')

    if (!type) {
      return
    }

    var group = this.groups.find(g => g.name == this.group)

    if (this.scene && group) {
      var template = group.templates.find(template => template.type == type)
      template && this.scene.add(deepClone(template.model), { cx: 200, cy: 200 })
    }

    this.group = null
  }

  templateIcon(template) {
    return template.icon || noImage
  }
}

customElements.define('component-menu', ComponentMenu)
