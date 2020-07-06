import React from 'react'
import AlertWrapper from './styles'

const Alert = (props) => {
    return (
      <>
        <AlertWrapper className={`${props.type} ${props.className}`}>
          <div>
            <div className="img"></div>
          </div>
          <div>
            <h5>{props.title}</h5>
            <span>{props.text}</span>
          </div>
        </AlertWrapper>
      </>
    );
};

export default Alert;