import { LitElement, html, css } from './node_modules/lit-element'

class FontList extends LitElement {
  constructor() {
    super()

    this.columns = []
    this.data = []
  }

  static get properties() {
    return {
      columns: Array,
      data: Array,
      limit: Number,
      page: Number
    }
  }

  static get styles() {
    return [
      css`
        :host {
          overflow: auto;
        }

        .item {
          padding: 5px 15px 5px 15px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        }

        .name {
          font-size: 1.2em;
          font-weight: bold;
        }

        .desc {
          font-size: 0.8em;
          color: gray;
        }

        .update-info {
          font-size: 0.8em;
          color: black;
        }
      `
    ]
  }

  updated(changes) {}

  render() {
    var data = (this.data && this.data.items) || []

    return html`
      ${data.map(
        ({ name, description, updatedAt, updaterId }) => html`
          <div class="item">
            <div class="name">${name}</div>
            <div class="desc">${description}</div>
            ${updatedAt
              ? html`
                  <div class="update-info">Updated At : ${updatedAt} / ${updaterId}</div>
                `
              : ``}
          </div>
        `
      )}
    `
  }
}

customElements.define('font-list', FontList)
