import React from 'react';

export default function(props) {
    return (
        <img src={props.image} style={ { backgroundColor: 'red', height: `${props.height}px`, width: `${props.width}px` } }/>
    )
}