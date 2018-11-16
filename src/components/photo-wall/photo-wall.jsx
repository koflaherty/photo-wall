import React, { Component } from 'react';
import giphy from "../../data/giphy/giphy";
import { PHOTO_KEYWORDS } from "../../constants/constants";
import Photo from '../photo/photo';
import uniqueID from 'lodash/uniqueId';
import { InfiniteLoader, List } from 'react-virtualized';

class PhotoWall extends Component {
    constructor() {
        super();

        this.state = {
            photos: [],
            searchWord: PHOTO_KEYWORDS[ Math.floor( Math.random() * PHOTO_KEYWORDS.length )],
        };

        this.loadMoreGiphys = this.loadMoreGiphys.bind(this);
        this.isRowLoaded = this.isRowLoaded.bind(this);
    }

    componentDidMount() {
        this.loadMoreGiphys( {
            startIndex: 0
        })
    }

    loadMoreGiphys({ startIndex }) {
        console.log("HIT " + startIndex);

        return giphy().search('gifs', {
            "q": this.state.searchWord,
            limit: 100,
            offset: startIndex,
        }).then((response) => {
            const photos = response.data.map((photo) => {
                const giphyImageData = photo.images['fixed_height_small'];
                return {
                    id: uniqueID('giphy'),
                    url: giphyImageData.url,
                    height: 100,
                    width: Number(giphyImageData.width),
                };
            });

            this.setState({
                photos: [ ...this.state.photos, ...photos]
            });
        });
    }

    isRowLoaded({ index }) {
        return !!this.state.photos[index];
    }

    render() {
        // Since row count is exactly 1 more row, Infinite Loader will try to load more images when a user
        // scrolls to the last image in the list.
        const rowCount = this.state.photos.length + 1;
        return (
            <div>
                <h1>{ this.state.searchWord }</h1>
                <InfiniteLoader
                    isRowLoaded={this.isRowLoaded}
                    loadMoreRows={this.loadMoreGiphys}
                    rowCount={rowCount}
                >
                    {({ onRowsRendered, registerChild }) => (
                        <List
                            width={ 300 }
                            height={ 400 }
                            onRowsRendered={onRowsRendered}
                            ref={registerChild}
                            rowCount={rowCount}
                            rowHeight={ 100 }
                            rowRenderer={
                                (props) => {
                                    const photoData = this.state.photos[props.index];

                                    return <Photo
                                        key={ props.key }
                                        image={ photoData && photoData.url }
                                        style={ { ...props.style, width: photoData && photoData.width } }
                                    />;
                                }
                            }
                        />
                    )}
                </InfiniteLoader>
            </div>
        )
    }
}

export default PhotoWall;