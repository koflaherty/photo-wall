import React, { Component } from 'react';
import giphy from "../../data/giphy/giphy";

class PhotoWall extends Component {
    constructor() {
        super();
    }

    componentDidMount() {
        giphy().search('gifs', {"q": "cats"})
            .then((response) => {
                response.data.forEach((gifObject) => {
                    console.log(gifObject)
                })
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