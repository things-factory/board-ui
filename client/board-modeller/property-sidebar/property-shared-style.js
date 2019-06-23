/**
 * @license Copyright © HatioLab Inc. All rights reserved.
 */

import { css } from 'lit-element'

export const PropertySharedStyle = css`
  fieldset {
    border: none;
    margin: 4px;
    padding: 9px 4px 9px 4px;
    border-bottom: 1px solid #cfd8dc;
    color: var(--primary-text-color);
    font-size: 12px;
  }

  fieldset legend {
    padding: 5px 0 0 5px;
    font-size: 11px;
    color: #e46c2e;
    font-weight: bold;
    text-transform: capitalize;
  }

  select {
    height: 22px;
    border-color: lightgray;
  }

  /* property grid */
  .property-grid {
    display: grid;
    grid-template-columns: repeat(10, 1fr);
    grid-gap: 5px;
    grid-auto-rows: minmax(24px, auto);
  }

  .property-grid > label {
    grid-column: span 3;
    text-align: right;
    text-transform: capitalize;
  }

  .property-grid > input,
  .property-grid > table,
  .property-grid > select,
  .property-grid > things-editor-angle-input,
  .property-grid > things-editor-buttons-radio {
    grid-column: span 7;
  }

  .property-grid > .checkbox-row {
    grid-column: span 10;
  }

  .property-grid > .property-full-label {
    grid-column: span 3;
    text-align: right;
    text-transform: capitalize;
  }

  .property-grid > .property-half-label {
    grid-column: span 1;
  }

  .property-grid > .property-full-input {
    grid-column: span 7;
  }

  .property-grid > .property-half-input {
    grid-column: span 4;
  }

  /* checkbox-row */
  .checkbox-row {
    display: grid;
    grid-template-columns: repeat(10, 1fr);
    grid-gap: 5px;
    grid-auto-rows: minmax(24px, auto);
  }

  .checkbox-row > input {
    grid-column: 4 / 5;
  }

  .checkbox-row > label {
    grid-column: span 6;
    text-align: left;
  }

  /* image resources */
  .icon-only-label {
    grid-column: span 1;

    background: url(./assets/images/icon-properties-label.png) no-repeat;
    float: left;
    margin: 0;
  }

  .icon-only-label.color {
    background-position: 70% -498px;
  }
  .icon-only-label.font-size {
    background-position: 70% -594px;
  }
  .icon-only-label.leading {
    background-position: 70% -696px;
  }
  .icon-only-label.hscale {
    background-position: 70% -296px;
  }
  .icon-only-label.vscale {
    background-position: 70% -396px;
  }
  .icon-only-label.linewidth {
    background-position: 70% -894px;
  }
  .icon-only-label.lineHeight {
    background-position: 70% -995px;
  }
`
