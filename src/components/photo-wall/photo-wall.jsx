import React, { Component } from 'react';
import giphy from "../../data/giphy/giphy";
import { PHOTO_KEYWORDS } from "../../constants/constants";
import Photo from '../photo/photo';
import InfiniteScroll from 'react-infinite-scroller';
import uniqueID from 'lodash/uniqueId';

class PhotoWall extends Component {
    constructor() {
        super();

        this.state = {
            photos: [],
            searchWord: PHOTO_KEYWORDS[ Math.floor( Math.random() * PHOTO_KEYWORDS.length )],
        };

        this.loadMoreGiphys = this.loadMoreGiphys.bind(this);
    }

    loadMoreGiphys(page) {
        console.log("Loading " + page * 100);
        giphy().search('gifs', {
            "q": this.state.searchWord,
            limit: 100,
            offset: page * 100,
        }).then((response) => {
            const photos = response.data.map((photo) => {
                const giphyImageData = photo.images['fixed_height_small'];
                return {
                    id: uniqueID('giphy'),
                    url: giphyImageData.url,
                    height: Number(giphyImageData.height),
                    width: Number(giphyImageData.width),
                };
            });

            console.log("LOADED " + page * 100);

            this.setState({ photos: this.state.photos.concat(photos) });
        })
        .catch((err) => {
            console.log("Error " + page * 100);
            console.log(err);
            this.setState({
                photos: this.state.photos.concat([])
            })
        });
    }

    render() {
        const photos = this.state.photos.map((photo) => {
           return  <Photo
                key={ photo.id }
                image={ photo.url }
                height={ photo.height }
                width={ photo.width }
            />
        });

        return (
            <InfiniteScroll
                hasMore={true}
                loadMore={this.loadMoreGiphys}
                loader={<div className="loader">Loading ...</div>}
                threshold={100}
                style={ { minHeight: '100vh'} }
            >
                <h1>{ this.state.searchWord }</h1>
                <div>
                    { photos }
                </div>
            </InfiniteScroll>
        )
    }
}

export default PhotoWall;