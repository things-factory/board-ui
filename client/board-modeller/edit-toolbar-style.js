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
    min-width: 32px;
  }

  [tools] > span[padding] {
    flex: 1;
  }

  [tools] > .vline {
    display: block;
    flex: none;
    border-left: 1px solid rgba(255, 255, 255, 0.07);
    border-right: 1px solid rgba(0, 0, 0, 0.1);
    width: 0px;
    height: 18px;
    margin: 0 4px;
  }

  :host > label {
    margin-right: 5px;
    color: #fff;
    font-size: 20px;
  }

  span[button] {
    min-height: 40px;

    background: url(./assets/images/icon-htoolbar.png) no-repeat;
    background-position-x: 50%;
  }

  label,
  #fullscreen,
  #toggle-property {
    flex: none;
  }

  #align-left {
    background-position-y: 10px;
  }

  #align-center {
    background-position-y: -40px;
  }

  #align-right {
    background-position-y: -90px;
  }

  #align-top {
    background-position-y: -140px;
  }

  #align-middle {
    background-position-y: -190px;
  }

  #align-bottom {
    background-position-y: -240px;
  }

  #undo {
    background-position-y: -590px;
  }

  #redo {
    background-position-y: -640px;
  }

  #front {
    background-position-y: -290px;
  }

  #back {
    background-position-y: -340px;
  }

  #forward {
    background-position-y: -390px;
  }

  #backward {
    background-position-y: -440px;
  }

  #symmetry-x {
    background-position-y: -490px;
  }

  #symmetry-y {
    background-position-y: -540px;
  }

  #group {
    background-position-y: -490px;
  }

  #ungroup {
    background-position-y: -540px;
  }

  #fullscreen {
    background-position-y: -690px;
  }

  #toggle-property {
    background-position-y: -690px;
    float: right;
  }

  #zoomin {
    background-position-y: -740px;
  }

  #zoomout {
    background-position-y: -790px;
  }

  #fit-scene {
    background-position-y: -1490px;
  }

  #cut {
    background-position-y: -840px;
  }

  #copy {
    background-position-y: -890px;
  }

  #paste {
    background-position-y: -940px;
  }

  #delete {
    background-position-y: -990px;
  }

  #font-increase {
    background-position-y: -1040px;
  }

  #font-decrease {
    background-position-y: -1090px;
  }

  #style-copy {
    background-position-y: -1140px;
  }

  #context-menu {
    background-position-y: -690px;
  }

  #symmetry-x {
    background-position-y: -1190px;
  }

  #symmetry-y {
    background-position-y: -1240px;
  }

  #rotate-cw {
    background-position-y: -1290px;
  }

  #rotate-ccw {
    background-position-y: -1340px;
  }

  #distribute-horizontal {
    background-position-y: -1540px;
  }

  #distribute-vertical {
    background-position-y: -1591px;
  }

  #toggle-property {
    background-position-y: -1390px;
  }

  #preview {
    background-position-y: -1638px;
  }

  /* bigger buttons */
  #fullscreen {
    background: url(./assets/images/icon-fullscreen.png) 50% 10px no-repeat;
    width: 45px;
    height: 45px;
    border-left: 1px solid rgba(0, 0, 0, 0.1);
  }

  #toggle-property {
    background: url(./assets/images/icon-collapse.png) 80% 10px no-repeat;
    width: 45px;
    height: 45px;
    border-left: 1px solid rgba(0, 0, 0, 0.1);
  }

  #toggle-property[active] {
    background: url(./assets/images/icon-collapse-active.png) 80% 10px no-repeat;
  }
`
