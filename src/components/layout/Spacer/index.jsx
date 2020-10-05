import React from 'react';
import './styles.scss';

const Spacer = (props) => {

    return (
        <div 
            className={`spacer` + (props.compact ? ' compact' : '')}
        >
        </div>
    );
};

export default Spacer