import React from 'react';
import './styles.scss';

const Spacer = (props) => {

    return (
        <div 
            className={`spacer` + (props.compact ? ' compact' : '') + (props.supercompact ? ' supercompact' : '') + ' ' + props.className}
        >
        </div>
    );
};

export default Spacer