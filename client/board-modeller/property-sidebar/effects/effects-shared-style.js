/**
 * @license Copyright © HatioLab Inc. All rights reserved.
 */

import { css } from 'lit-element'

export const EffectsSharedStyle = css`
  :host {
    display: grid;
    grid-template-columns: repeat(10, 1fr);
    grid-gap: 5px;
    grid-auto-rows: minmax(24px, auto);

    align-items: center;
  }

  * {
    align-self: stretch;
  }

  label {
    grid-column: span 3;
    text-align: right;
    text-transform: capitalize;

    align-self: center;
  }

  input,
  select,
  things-editor-angle-input,
  things-editor-color,
  [custom-input] {
    grid-column: span 7;
  }

  select {
    border-color: lightgray;
  }

  input[type='checkbox'] {
    grid-column: 4 / 5;
    align-self: center;
  }

  label.checkbox-label {
    grid-column: span 6;
    text-align: left;
  }
`
