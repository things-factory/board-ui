/**
 * @license Copyright © HatioLab Inc. All rights reserved.
 */

import { css } from 'lit-element'

export const PropertySharedStyle = css`
  fieldset {
    border: none;
    margin: 4px;
    padding: 9px 4px 9px 4px;
    border-bottom: var(--property-sidebar-fieldset-border);
    color: var(--property-sidebar-fieldset-legend-color);
    font: var(--property-sidebar-fieldset-label);
  }

  fieldset legend {
    padding: 5px 0 0 5px;
    color: var(--property-sidebar-fieldset-legend-color);
    font: var(--property-sidebar-fieldset-legend);
    text-transform: capitalize;
  }

  select {
    border-color: lightgray;
  }

  /* property grid */
  .property-grid {
    display: grid;
    grid-template-columns: repeat(10, 1fr);
    grid-gap: 5px;
    grid-auto-rows: minmax(24px, auto);
    align-items: center;
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
  .property-grid > things-editor-buttons-radio,
  .property-grid > things-editor-color,
  [custom-editor] {
    grid-column: span 7;
    align-self: stretch;
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
    align-items: center;
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
    align-self: stretch;
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
