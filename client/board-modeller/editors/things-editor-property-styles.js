import { css } from 'lit-element'

export const ThingsEditorPropertyStyles = css`
  :host {
    margin: 5px;

    display: grid;
    grid-template-columns: repeat(10, 1fr);
    grid-gap: 5px;
  }

  :host > * {
    box-sizing: border-box;

    grid-column: span 7;
    order: 2;
  }

  :host > label {
    grid-column: span 3;
    order: 1;

    text-align: right;

    color: var(--primary-text-color);
    font-size: 0.8em;
    line-height: 2;
    text-transform: capitalize;
  }

  input[type='checkbox'] ~ label {
    grid-column: span 6;
    order: 2;

    text-align: left;
  }

  select {
    height: 22px;
    border-color: lightgray;
  }
  
  legend {
    grid-column: 1 / -1;

    display: inline-block;

    text-align: left;
    text-transform: capitalize;
  }

  [fullwidth] {
    grid-column: 1 / -1;
  }

  input[type='checkbox'] {
    grid-column: span 4;
    order: 1;

    justify-self: end;
    align-self: center;
  }
`
