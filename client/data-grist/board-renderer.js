import { html } from 'lit-html'

export const BoardRenderer = (value, column, record) => {
  if (!value) {
    return ''
  }

  return html`
    ${value.name || ''}
  `
}
