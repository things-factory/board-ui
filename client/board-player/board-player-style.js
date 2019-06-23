import { css } from 'lit-element'

export const style = css`
  :host {
    display: flex;
    position: relative;
    flex-direction: column;
    width: 100%;
    height: 100%;

    overflow: hidden;
  }

  :slotted(*) {
    border: none;
  }

  ::slotted > * {
    flex: 1;
  }

  board-wrapper {
    width: 100%;
    height: 100%;
    position: relative;
  }

  board-wrapper[front] {
    background: black;
  }

  board-wrapper[back] {
    background: black;
  }

  #control {
    position: absolute;
    left: 55%;
    bottom: 30px;
    transform: translateX(-55%);

    color: white;
    background-color: rgba(0, 0, 0, 0.7);
    border-radius: 12px;
    padding: 7px 10px 7px 35px;
    box-shadow: 0 0 5px #000;

    min-width: 310px;
  }

  #control[hidden] {
    display: none;
  }

  #control > div > * {
    cursor: pointer;
  }

  #joystick {
    position: absolute;
    left: -50px;
    bottom: -15px;
    border-radius: 50%;
    overflow: hidden;
    width: 80px;
    height: 80px;
    float: left;
    border: 2px solid tomato;
    background-color: #c34827;
    box-shadow: 0 0 5px #000;
  }

  #joystick mwc-icon {
    position: absolute;
    display: block;
    width: 20px;
    height: 20px;
    font-size: 25px;
    line-height: 0.7;
  }

  mwc-icon#up {
    left: 29px;
  }

  mwc-icon#left {
    top: 32px;
    left: -2px;
  }

  mwc-icon#play,
  mwc-icon#pause {
    left: 20px;
    top: 20px;
    width: 40px;
    height: 40px;
    border: 1px solid rgba(0, 0, 0, 0.15);
    border-radius: 50%;
    background-color: rgba(0, 0, 0, 0.15);
    font-size: 45px;
    line-height: 0.9;
  }

  mwc-icon#right {
    top: 31px;
    left: 60px;
  }

  mwc-icon#down {
    left: 29px;
    top: 63px;
  }

  mwc-icon#pause {
    text-indent: -2px;
  }

  #setting {
    float: left;
    font-size: 12px;
  }

  #setting mwc-icon {
    position: relative;
    top: 5px;
    margin-left: 10px;
    font-size: 22px;
    color: rgba(255, 174, 53, 0.8);
    cursor: default !important;
  }

  #setting input {
    width: 50px;
    font-size: 14px;
    background-color: transparent;
    border: none;
    border-bottom: 1px solid #fff;
    color: #fff;
    text-align: right;
  }

  #setting select {
    border: none;
    font-size: 14px;
  }

  #setting input:focus {
    outline: none;
  }

  #etc {
    float: left;
    position: relative;
    top: 3px;
    margin-left: 15px;
  }

  #etc mwc-icon {
    font-size: 30px;
  }

  #control [hidden] {
    display: none;
  }
`
