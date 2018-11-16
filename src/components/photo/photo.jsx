import React from 'react';

export default function(props) {
    return (
        <img
            className="photo"
            src={props.image}
            style={ props.style }
        />
    )
}