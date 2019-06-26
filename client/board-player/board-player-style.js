import { css } from 'lit-element'

export const style = css`
  :host {
    display: flex;
    position: relative;
    flex-direction: column;
    width: 100%;
    height: 100%;
    overflow: hidden;
    justify-content: center;
    align-items: center;
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
    bottom: 1vh;
    width: 100vw;
    max-width: 435px;
    display: grid;
    grid-template-columns: 42px 42px 1fr;
    color: white;
    justify-content: center;
    align-items: center;
    grid-auto-flow: dense;
    padding: 5px;
    box-sizing: border-box;
    grid-template-rows: 12px 60px 12px;
  }

  #control[hidden] {
    display: none;
  }

  #control > div > * {
    cursor: pointer;
  }

  #joystick {
    position: relative;
    box-sizing: border-box;
    border: 2px solid tomato;
    background-color: #c34827;
    box-shadow: 0 0 5px #000;
    width: 100%;
    height: 100%;
    grid-column: 1 / span 2;
    border-radius: 50%;
    z-index: 2;
    grid-row: 1 / span 3;
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

  #setting-container {
    grid-column: 2 / span 2;
    grid-row: 2;
    gap: 0 10px;
    border-radius: 12px;
    background: rgba(0, 0, 0, 0.7);
    height: 100%;
    box-shadow: rgb(0, 0, 0) 0px 0px 5px;
    display: grid;
    grid-template-columns: 1fr 60px;
    align-items: center;
    padding-left: 60px;
    padding-right: 5px;
  }

  #setting {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 0 10px;
  }

  #setting mwc-icon {
    font-size: 22px;
    color: rgba(255, 174, 53, 0.8);
  }

  #setting input {
    width: 50px;
    margin-right: 5px;
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

  #schedule-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  #grid-setting-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  #etc {
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: center;
    justify-items: center;
  }

  #etc mwc-icon {
    font-size: 30px;
  }

  #control [hidden] {
    display: none;
  }

  @media screen and (max-width: 400px) {
    #setting {
      grid-template-columns: 1fr;
      grid-template-rows: 1fr 1fr;
    }
  }
`
