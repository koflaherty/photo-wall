import React, { Component } from 'react';
import giphy from "../../data/giphy/giphy";
import { PHOTO_KEYWORDS } from "../../constants/constants";

class PhotoWall extends Component {
    constructor() {
        super();
    }

    componentDidMount() {
        giphy().search('gifs', {
            "q": Math.floor( Math.random() * PHOTO_KEYWORDS.length )
        }).then((response) => {
            response.data.forEach((gifObject) => {
                console.log(gifObject)
            });
        })
        .catch((err) => {
            console.log("Need to handle error");
        })
    }

    render() {
        return <h1>Hello, {this.props.name}</h1>;
    }
}

export default PhotoWall;