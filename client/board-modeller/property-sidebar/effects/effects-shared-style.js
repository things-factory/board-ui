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
  }

  label {
    grid-column: span 3;
    text-align: right;
    text-transform: capitalize;
  }

  input,
  select,
  things-editor-angle-input,
  things-editor-color {
    grid-column: span 7;
  }

  select {
    height: 22px;
    border-color: lightgray;
  }

  input[type='checkbox'] {
    grid-column: 4 / 5;
  }

  label.checkbox-label {
    grid-column: span 6;
    text-align: left;
  }
`
