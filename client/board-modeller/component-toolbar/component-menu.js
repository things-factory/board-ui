/**
 * @license Copyright © HatioLab Inc. All rights reserved.
 */

import { PolymerElement, html } from '@polymer/polymer/polymer-element'

import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class'
import { PaperDialogBehavior } from '@polymer/paper-dialog-behavior/paper-dialog-behavior'

import { deepClone } from '@things-factory/shell'

import noImage from '../../../assets/images/components/no-image.png'

class ComponentMenu extends mixinBehaviors([PaperDialogBehavior], PolymerElement) {
  constructor() {
    super()

    this.groups = {}
  }

  static get is() {
    return 'component-menu'
  }

  static get properties() {
    return {
      groups: Object,

      scene: Object,
      group: {
        type: String
      },
      templates: {
        type: Array,
        computed: 'computeTemplates(group)'
      }
    }
  }

  static get template() {
    return html`
      <style>
        :host {
          background-color: #eceff1;
          margin: 0px;
          padding: 0px;

          width: 210px;
          height: 100%;

          overflow: hidden;

          border: 2px solid var(--secondary-dark-color);
          box-sizing: border-box;

          position: absolute;
          top: 0px;
        }

        h2 {
          background-color: var(--primary-dark-color);
          padding: 1px 5px;
          margin: 0;
          font-size: 11px;
          color: #fff;
          font-weight: 600;
          text-transform: capitalize;
          line-height: initial;
        }

        .scroll {
          margin: 0;
          padding: 0;
          height: 98%;
        }

        paper-listbox {
          display: block;
          margin-bottom: 1% !important;
          width: 100%;
          overflow-y: auto;
          background-color: var(--secondary-dark-color);
        }

        paper-item {
          min-height: 20px;
          padding: 0 5px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
          font-size: 11px;
          color: #ccc;
          text-align: left;
        }

        paper-listbox paper-item:focus {
          background-color: lightgray;
        }

        paper-item img {
          margin: 5px;
          width: 20px;
          height: 20px;
        }
      </style>

      <h2 onclick="event.stopPropagation()">[[group]] list</h2>

      <paper-listbox data-group$="[[group]]" class="scroll">
        <template is="dom-repeat" items="[[templates]]">
          <paper-item data-type$="[[item.type]]" on-click="onClickTemplate">
            <img src="[[templateIcon(item)]]" />[[item.type]]
          </paper-item>
        </template>
      </paper-listbox>
    `
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

    this.close()
  }

  computeTemplates(group) {
    var g = this.groups.find(g => g.name == group)
    return g.templates
  }

  templateIcon(template) {
    return template.icon || noImage
  }
}

customElements.define(ComponentMenu.is, ComponentMenu)
