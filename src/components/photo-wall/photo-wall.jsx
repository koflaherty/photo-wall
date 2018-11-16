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

        this.page = 0;
        this.currentlyLoading = false;
        this.wantsToLoadMore = false;

        this.loadMoreGiphys = this.loadMoreGiphys.bind(this);
    }

    loadMoreGiphys() {
        // Prevent Loading Multiple Requests
        if (this.currentlyLoading) {
            this.wantsToLoadMore = true;
            return;
        }

        console.log("Attempt: " + this.page * 100);

        this.currentlyLoading = true;
        giphy().search('gifs', {
            "q": this.state.searchWord,
            limit: 100,
            offset: this.page * 100,
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

            console.log("LOADED " + this.page * 100);
            this.page += 1;

            this.setState({ photos: this.state.photos.concat(photos) });
        })
        .catch((err) => {
            this.currentlyLoading = false;

            this.setState({ photos: this.state.photos.concat([]) }); // hack to update infinite loader
            console.log("Error " + this.page * 100);
            console.log(err);
        }).finally(() => {
            console.log("FINALLY");
            this.currentlyLoading = false;

            if (this.wantsToLoadMore) {
                this.wantsToLoadMore = false;
                this.loadMoreGiphys();
            }
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
            <div>
                <h1>{ this.state.searchWord }</h1>
                <InfiniteScroll
                    hasMore={true}
                    loadMore={this.loadMoreGiphys}
                    loader={<div className="loader">Loading ...</div>}
                    threshold={100}
                    style={ { minHeight: '100vh'} }
                >
                    { photos }
                </InfiniteScroll>
            </div>
        )
    }
}

export default PhotoWall;