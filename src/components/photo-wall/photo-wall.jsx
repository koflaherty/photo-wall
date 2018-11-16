import React, { Component } from 'react';
import giphy from "../../data/giphy/giphy";
import { PHOTO_KEYWORDS } from "../../constants/constants";
import Photo from '../photo/photo';

class PhotoWall extends Component {
    constructor() {
        super();

        this.state = {
            photos: [],
            searchWord: PHOTO_KEYWORDS[Math.floor( Math.random() * PHOTO_KEYWORDS.length )],
        };

        this.updatePhotos = this.updatePhotos.bind(this);
        this.calcMinImageHeight = this.calcMinImageHeight.bind(this);
    }

    componentDidMount() {
        giphy().search('gifs', {
            "q": this.state.searchWord,
        }).then((response) => {
            const photos = response.data.map((photo) => {
                const giphyImageData = photo.images['fixed_height_small'];
                return {
                    id: photo.id,
                    url: giphyImageData.url,
                    height: Number(giphyImageData.height),
                    width: Number(giphyImageData.width),
                };
            });

            this.setState({ photos });
        })
        .catch((err) => {
            console.log("Need to handle error");
        })
    }

    updatePhotos() {

    }

    calcMinImageHeight() {

    }

    render() {
        const photos = this.state.photos.map((photo) =>
            <Photo
                key={ photo.id }
                image={ photo.url }
                height={ photo.height }
                width={ photo.width }
            />
        );

        return (
            <div>
                <h1>{ this.state.searchWord }</h1>
                <div>
                    { photos }
                </div>
            </div>
        )
    }
}

export default PhotoWall;