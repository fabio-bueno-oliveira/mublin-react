import styled from 'styled-components'
import img from '../../assets/img/logos/logo-mublin-circle-black.png'

const AlertWrapper = styled.div`
    border: 1px solid #CCC;
    box-sizing: border-box;
    border-radius: 4px;
    color: #282828;
    display: flex;
    padding: 16px;
    width: 100%;
    margin: 0 0 20px 0;

    &.error {
      background-color: rgba(215, 70, 77, 0.05);
      border-color: #D7464D;
    }
    &.error .img {
      background-image: url(${img});
    }

    &.success {
      background-color: rgba(14, 127, 97, 0.05);
      border-color: #0E7F61;
    }
    &.success .img {
      background-image: url(${img});
    }

    &.info {
      background-color: rgba(68, 164, 230, 0.05);
      border-color: #44A4E6;
    }
    &.info .img {
      background-image: url(${img});
    }

    &.alert {
      background-color: rgba(255, 204, 0, 0.05);
      border-color: #FFCC00;
    }
    &.alert .img {
      background-image: url(${img});
    }

    h5 {
      font-size:14px;
      font-weight: 900;
      opacity: 0.7;
      margin-bottom: 8px;
    }

    span {
      font-size: 12px;
      font-weight: 500;
      opacity: 0.7;
    }

    > div {
      display: flex;
      flex-direction: column;
    }

    .img {
      background-size: 24px auto;
      background-repeat: no-repeat;
      background-position: center;
      height: 100%!important;
      margin-right: 16px;
      width:24px;
      height: 24px;
  }
`

export default AlertWrapper;