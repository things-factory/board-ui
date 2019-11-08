import { LitElement, html, css } from 'lit-element'
import Sortable from 'sortablejs'

export default class SceneInspector extends LitElement {
  constructor() {
    super()
  }

  static get properties() {
    return {
      scene: Object
    }
  }

  static get styles() {
    return [
      css`
        :host {
          color: var(--scene-inspector-color);
        }

        .component {
          display: block;
          overflow: hidden;
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
          font-size: 14px;
        }

        .component[selected] {
          background-color: var(--scene-inspector-selected-background-color);
          border-top: var(--scene-inspector-selected-border);
          border-bottom: var(--scene-inspector-selected-border);
        }
        [selected] .type {
          font-weight: bold;
        }

        span,
        i {
          display: inline-block;
        }

        span.type {
          text-overflow: ellipses;
        }

        span.name {
          background-color: var(--scene-inspector-name-background-color);
          border-radius: var(--border-radius);
          padding: 0 4px;
          color: #fff;
          font-size: 0.8em;
        }

        .eye {
          margin: 0 0 0 5px;
          vertical-align: middle;
          opacity: 0.7;
          font-size: 1.1em;
          color: var(--scene-inspector-eye-icon-color);
        }

        .collapsed::before,
        .extended::before,
        .collapsespace::before {
          background: url(/assets/images/icon-shell-inspector.png) no-repeat;
          width: 16px;
          height: 18px;
          display: inline-block;
          content: '';
          opacity: 0.6;
        }

        .collapsed::before {
          background-position: 100% -195px;
        }

        .extended::before {
          background-position: 100% -295px;
        }

        .collapsespace::before {
          background-position: 100% -395px;
          opacity: 0.9;
          width: 16px;
        }
        .collapsed,
        .extended,
        .collapsespace {
          border-left: 1px dotted rgba(0, 0, 0, 0.1);
        }

        pre {
          display: inline;
        }
      `
    ]
  }

  render() {
    return html`
      ${!this.scene ? html`` : this.renderComponent(this.scene.root, 0)}
    `
  }

  firstUpdated() {
    dispatchEvent(new Event('resize'))
    this.shadowRoot.addEventListener('click', this.onclick.bind(this))
    this.shadowRoot.addEventListener('dblclick', this.ondblclick.bind(this))
  }

  updated(change) {
    if (change.has('scene')) {
      let oldScene = change.get('scene')

      if (oldScene) {
        oldScene.off('selected')
        oldScene.off('execute')
        oldScene.off('undo')
        oldScene.off('redo')

        delete this.extendedMap
      }

      if (this.scene && this.scene.root) {
        // root 는 기본상태가 extended 되도록 하기위해서임.
        this.extendedMap.set(this.scene.root, true)

        this.scene.on('selected', (after, before) => {
          let selected = after

          selected.forEach(component => {
            let parent = component.parent
            while (parent && !this.extendedMap.get(parent)) {
              this.extendedMap.set(parent, true)
              parent = parent.parent
            }
          })

          this.requestUpdate()
        })

        this.scene.on('execute', (after, before) => {
          this.requestUpdate()
        })

        this.scene.on('undo', (after, before) => {
          this.extendedMap.set(this.scene.root, true)
          this.requestUpdate()
        })

        this.scene.on('redo', (after, before) => {
          this.extendedMap.set(this.scene.root, true)
          this.requestUpdate()
        })
      }
    }

    this.updateComplete.then(() => {
      this.shadowRoot.querySelectorAll('[sortable]').forEach(sortable => {
        new Sortable(sortable, this.sortableConfig)
      })
    })
  }

  sortableConfig = {
    group: 'inspector',
    animation: 150,
    draggable: '.component',
    swapThreshold: 1,
    onSort: this.onSort.bind(this)
  }

  onSort(e) {
    if (!this.scene) return

    var component = e.item.component
    var to_container = e.to.component
    var to_index = e.newIndex - 1

    this.scene.move(component, to_container, to_index)

    this.show = false
    this.updateComplete.then(() => {
      this.show = true
    })
  }

  disconnectedCallback() {
    super.disconnectedCallback()

    delete this.scene
    delete this._extendedMap
  }

  onclick(e) {
    e.stopPropagation()

    var targetElement = e.target
    var classList = targetElement.classList
    var component

    while (!component && targetElement) {
      component = targetElement.component

      if (component) break

      targetElement = targetElement.parentNode

      if (!targetElement || targetElement === this.shadowRoot) break
    }

    if (component) {
      if (classList.contains('eye')) {
        this.toggleHidden(component)
      } else if (classList.contains('extended') || classList.contains('collapsed')) {
        this.toggleExtended(component)
      }

      this.selectComponent(component)
    } else {
      if (classList.contains('inspector')) {
        this.show = !this.show
        this.style.height = this.show ? '100%' : ''
      }
    }

    this.requestUpdate()
  }

  ondblclick(e) {
    e.stopPropagation()

    var targetElement = e.target
    var component

    while (!component && targetElement) {
      component = targetElement.component

      if (component) break

      targetElement = targetElement.parentNode

      if (!targetElement || targetElement === this.shadowRoot) break
    }

    if (component && component.isContainer()) {
      this.toggleExtended(component)
    }

    this.requestUpdate()
  }

  get extendedMap() {
    if (!this._extendedMap) {
      this._extendedMap = new WeakMap()
    }

    return this._extendedMap
  }

  getNodeHandleClass(component) {
    if (component.isContainer() && component.components.length > 0) {
      return !!this.extendedMap.get(component) ? 'extended' : 'collapsed'
    } else {
      return 'collapsespace'
    }
  }

  isExtended(component) {
    return !!this.extendedMap.get(component)
  }

  toggleExtended(component) {
    var extended = this.isExtended(component)

    if (extended) {
      this.extendedMap.delete(component)
    } else {
      this.extendedMap.set(component, !extended)
    }

    this.requestUpdate()
  }

  toggleHidden(component) {
    component.set('hidden', !component.hidden)

    this.requestUpdate()
  }

  selectComponent(component) {
    this.scene.selected = [component]

    this.requestUpdate()
  }

  renderComponent(component, depth) {
    if (!component) {
      return html``
    }

    var children = component.components || []
    var extended = this.isExtended(component) ? children : []

    return html`
      <div
        class="component"
        ?selected=${(this.scene.selected || []).indexOf(component) > -1}
        .component=${component}
        ?sortable=${component.isContainer()}
      >
        <span>
          ${depth > 0
            ? html`
                <mwc-icon class="eye">${component.get('hidden') ? 'visibility_off' : 'visibility'}</mwc-icon>
                <pre>${' '.repeat(depth)}</pre>
              `
            : html`
                <pre>${' '.repeat(depth + 2)}</pre>
              `}

          <span class=${this.getNodeHandleClass(component)}> </span>

          <span class="type">${depth == 0 ? 'ROOT' : component.get('type')}</span> ${component.get('id')
            ? html`
                <span class="name">#${component.get('id')}</span>
              `
            : html``}
        </span>

        ${extended.map(child => this.renderComponent(child, depth + 1))}
      </div>
    `
  }
}

customElements.define('scene-inspector', SceneInspector)
