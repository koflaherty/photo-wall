import React from 'react';

export default function(props) {
    return (
        <img src={props.image} style={ { backgroundColor: 'red', ...props.style } }/>
    )
}