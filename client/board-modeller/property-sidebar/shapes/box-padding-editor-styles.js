import { css } from 'lit-element'

export const BoxPaddingEditorStyles = css`
  .box-padding {
    width: 100%;
  }

  .box-padding td {
    background: url(/assets/images/icon-properties-padding.png) 50% 0 no-repeat;
  }

  .box-padding tr:nth-child(1),
  .box-padding tr:nth-child(3) {
    height: 20px;
  }

  .box-padding tr td:nth-child(1),
  .box-padding tr td:nth-child(3) {
    width: 18px;
  }

  .box-padding .slide1 {
    background-position: 0 0;
  }

  .box-padding .slide2 {
    background-position: 50% -40px;
    background-color: rgba(69, 46, 41, 0.2);
  }

  .box-padding .slide3 {
    background-position: 100% -440px;
  }

  .box-padding .slide4 {
    background-position: 0 -360px;
    background-color: rgba(69, 46, 41, 0.2);
  }

  .box-padding .slide5 {
    background: none;
    text-align: center;
  }

  .box-padding .slide6 {
    background-position: 100% -160px;
    background-color: rgba(69, 46, 41, 0.2);
  }

  .box-padding .slide7 {
    background-position: 0 100%;
  }

  .box-padding .slide8 {
    background-position: 50% -320px;
    background-color: rgba(69, 46, 41, 0.2);
  }

  .box-padding .slide9 {
    background-position: 0 0px;
  }

  .box-padding input {
    background-color: transparent;
    width: 35px;
    margin: 0px;
    padding: 0px;
    clear: both;
    float: initial;
    border: 1px solid #fff;
    border-width: 0 0 1px 0;
    text-align: right;
    font-size: 14px;
  }

  .slide5 input:nth-child(1),
  .slide5 input:nth-child(4) {
    display: block;
    margin: auto;
  }

  .slide5 input:nth-child(2) {
    float: left;
  }

  .slide5 input:nth-child(3) {
    float: right;
    margin-top: -25px;
  }

  .slide5 input:nth-child(4) {
    margin-top: -5px;
  }
`
