import React, { Component } from 'react';
import giphy from "../../data/giphy/giphy";
import { PHOTO_KEYWORDS } from "../../constants/constants";
import Photo from '../photo/photo';
import uniqueID from 'lodash/uniqueId';
import { InfiniteLoader, List } from 'react-virtualized';
import PropTypes from 'prop-types';

class PhotoWall extends Component {
    constructor() {
        super();

        this.state = {
            photos: [],
            searchWord: PHOTO_KEYWORDS[ Math.floor( Math.random() * PHOTO_KEYWORDS.length )],
        };

        this.loadMoreGiphys = this.loadMoreGiphys.bind(this);
    }

    componentDidMount() {
        this.loadMoreGiphys( {
            startIndex: 0
        })
    }

    loadMoreGiphys({ startIndex }) {
        console.log("LOAD MORE")
        return giphy().search('gifs', {
            "q": this.state.searchWord,
            limit: 100,
            offset: startIndex,
        }).then((response) => {
            console.log("LOADed MORE")
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

    getPhotoRows() {
        const photoRows = [];
        let nextRow = [];
        let currentRowWidth = 0;

        console.log("PHOTO COUNT " + this.state.photos.length);
        this.state.photos.forEach((photo) => {
            if (photo.width + currentRowWidth > this.props.width) {
                if (nextRow.length === 0) {
                    nextRow.push(photo);
                }

                photoRows.push(nextRow);
                nextRow = [];
                currentRowWidth = 0;
            }
            else {
                nextRow.push(photo);
                currentRowWidth += photo.width;
            }
        });

        if (nextRow.length > 0) {
            photoRows.push(nextRow);
            nextRow = [];
            currentRowWidth = 0;
        }

        return photoRows;
    }

    render() {
        const { width, height } = this.props;

        const photoRows = this.getPhotoRows();
        const isRowLoaded = ({ index }) => {
            return !!photoRows[index];
        };

        // Since row count is one extra row, Infinite Loader will try to load more images when a
        // user scrolls to the bottom of the page.
        const rowCount = photoRows.length + 20;
        console.log("rowCount" + rowCount);
        return (
            <div>
                <h1>{ this.state.searchWord }</h1>
                <InfiniteLoader
                    isRowLoaded={isRowLoaded}
                    loadMoreRows={this.loadMoreGiphys}
                    rowCount={rowCount}
                >
                    {({ onRowsRendered, registerChild }) => (
                        <List
                            width={ width }
                            height={ height }
                            onRowsRendered={onRowsRendered}
                            ref={registerChild}
                            rowCount={rowCount}
                            rowHeight={ 100 }
                            rowRenderer={
                                (props) => {
                                    let photos;
                                    if (photoRows && photoRows[props.index]) {
                                        photos = photoRows && photoRows[props.index].map((photo) => {
                                            return <Photo
                                                key={ photo.id }
                                                image={ photo.url }
                                            />;
                                        });
                                    }

                                    return (
                                        <div key={ props.key } style={ props.style }>
                                            { photos }
                                        </div>
                                    );
                                }
                            }
                        />
                    )}
                </InfiniteLoader>
            </div>
        )
    }
}

PhotoWall.propTypes = {
    height: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
};

export default PhotoWall;