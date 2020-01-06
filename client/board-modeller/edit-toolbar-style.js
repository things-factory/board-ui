/**
 * @license Copyright © HatioLab Inc. All rights reserved.
 */

import { css } from 'lit-element'

export const style = css`
  :host {
    background-color: var(--edit-toolbar-background-color, #394e64);

    overflow-x: hidden;
  }

  [tools] {
    display: flex;
    align-items: center;
    overflow: none;
    padding: 0px 10px;
  }

  [tools] > * {
    padding: 0px;
  }

  [tools] > span[button] {
    min-width: 30px;
  }

  [tools] > span[padding] {
    flex: 1;
  }

  [tools] > .vline {
    display: block;
    flex: none;
    border-left: 1px solid rgba(255, 255, 255, 0.2);
    border-right: 1px solid rgba(0, 0, 0, 0.15);
    width: 0px;
    height: 18px;
    margin: 0 3px;
  }

  span[button] {
    min-height: 35px;

    background: url('/assets/images/icon-htoolbar.png') no-repeat;
    background-position-x: 50%;
    opacity: 0.8;
  }
  span[button]:hover {
    opacity: 1;
    background-color: rgba(0, 0, 0, 0.1);
    cursor: pointer;
  }

  #fullscreen,
  #toggle-property {
    flex: none;
  }

  #align-left {
    background-position-y: 8px;
  }

  #align-center {
    background-position-y: -42px;
  }

  #align-right {
    background-position-y: -92px;
  }

  #align-top {
    background-position-y: -142px;
  }

  #align-middle {
    background-position-y: -192px;
  }

  #align-bottom {
    background-position-y: -242px;
  }

  #undo {
    background-position-y: -592px;
  }

  #redo {
    background-position-y: -642px;
  }

  #front {
    background-position-y: -292px;
  }

  #back {
    background-position-y: -342px;
  }

  #forward {
    background-position-y: -392px;
  }

  #backward {
    background-position-y: -442px;
  }

  #symmetry-x {
    background-position-y: -492px;
  }

  #symmetry-y {
    background-position-y: -542px;
  }

  #group {
    background-position-y: -492px;
  }

  #ungroup {
    background-position-y: -542px;
  }

  #fullscreen {
    background-position-y: -692px;
  }

  #toggle-property {
    background-position-y: -692px;
    float: right;
  }

  #zoomin {
    background-position-y: -742px;
  }

  #zoomout {
    background-position-y: -792px;
  }

  #fit-scene {
    background-position-y: -1492px;
  }

  #cut {
    background-position-y: -842px;
  }

  #copy {
    background-position-y: -892px;
  }

  #paste {
    background-position-y: -942px;
  }

  #delete {
    background-position-y: -992px;
  }

  #font-increase {
    background-position-y: -1042px;
  }

  #font-decrease {
    background-position-y: -1092px;
  }

  #style-copy {
    background-position-y: -1142px;
  }

  #context-menu {
    background-position-y: -692px;
  }

  #symmetry-x {
    background-position-y: -1192px;
  }

  #symmetry-y {
    background-position-y: -1242px;
  }

  #rotate-cw {
    background-position-y: -1292px;
  }

  #rotate-ccw {
    background-position-y: -1342px;
  }

  #distribute-horizontal {
    background-position-y: -1542px;
  }

  #distribute-vertical {
    background-position-y: -1593px;
  }

  #toggle-property {
    background-position-y: -1392px;
  }

  #preview {
    background-position-y: -1640px;
  }

  /* bigger buttons */
  #fullscreen {
    background: url('/assets/images/icon-fullscreen.png') 50% 10px no-repeat;
    width: var(--edit-toolbar-bigger-icon-size);
    height: var(--edit-toolbar-bigger-icon-size);
    border-left: var(--edit-toolbar-bigger-icon-line);
  }

  #toggle-property {
    background: url('/assets/images/icon-collapse.png') 80% 10px no-repeat;
    width: var(--edit-toolbar-bigger-icon-size);
    height: var(--edit-toolbar-bigger-icon-size);
    border-left: var(--edit-toolbar-bigger-icon-line);
  }

  #toggle-property[active] {
    background: url(/assets/images/icon-collapse-active.png) 80% 10px no-repeat;
  }
`
