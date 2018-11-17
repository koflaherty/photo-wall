import React, { Component } from 'react';
import giphy from "../../data/giphy/giphy";
import Photo from '../photo/photo';
import uniqueID from 'lodash/uniqueId';
import { InfiniteLoader, List } from 'react-virtualized';
import PropTypes from 'prop-types';

class PhotoWall extends Component {
    constructor() {
        super();

        this.state = {
            error: false,
            photos: [],
        };

        // Need to keep track the number of fetched photos because InfiniteLoader can call loadMoreRows more than
        // once before promise resolves and its internal rowIndex doesn't map directly to number of images since
        // there isn't a set number of images per row.
        this.numberFetchedPhotos = 0;

        this.loadMoreGiphys = this.loadMoreGiphys.bind(this);
        this.updateErrorState = this.updateErrorState.bind(this);
    }

    loadMoreGiphys() {
        const limit = 100;
        const offset = this.numberFetchedPhotos;
        this.numberFetchedPhotos += limit;

        return giphy().search('gifs', {
            "q": this.props.searchKeyword,
            limit,
            offset,
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

            this.updateErrorState(false); // reset any previous error since Giphy is now working again
        }).catch((error) => {
            console.warn(error.message);
            this.updateErrorState(true);
        });
    }

    updateErrorState(error) {
        if (error !== this.state.error) {
            if (this.props.handleErrorChange) {
                this.props.handleErrorChange(error);
            }
        }

        this.setState({
            error
        });
    }

    // Performance Improvement - only process this if photos or photo wall width has changed
    getPhotoRows() {
        const { width, imagePadding } = this.props;

        const individualImagePadding = imagePadding / 2;
        const photoRows = [];
        let nextRow = [];
        let currentRowWidth = 0;
        this.state.photos.forEach((photo) => {
            const photoWidth = individualImagePadding + photo.width;
            if (photoWidth + currentRowWidth  > width) {
                if (nextRow.length === 0) {
                    nextRow.push(photo);
                }

                photoRows.push(nextRow);
                nextRow = [];
                currentRowWidth = 0;
            }
            else {
                nextRow.push(photo);
                currentRowWidth += photoWidth;
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
        const { width, height, imagePadding } = this.props;

        const photoRows = this.getPhotoRows();
        const isRowLoaded = ({ index }) => {
            return !!photoRows[index];
        };

        // Since row count is one extra row, Infinite Loader will try to load more images when a
        // user scrolls to the bottom of the page.
        const rowCount = photoRows.length + 1;

        return (
            <InfiniteLoader
                isRowLoaded={isRowLoaded}
                loadMoreRows={this.loadMoreGiphys}
                rowCount={rowCount}
                threshold={5}
            >
                {({ onRowsRendered, registerChild }) => (
                    <List
                        className="photo-wall"
                        width={ width }
                        height={ height }
                        onRowsRendered={onRowsRendered}
                        ref={registerChild}
                        rowCount={rowCount}
                        rowHeight={ 100 + imagePadding }
                        rowRenderer={
                            (props) => {
                                let photos;
                                if (photoRows && photoRows[props.index]) {
                                    photos = photoRows && photoRows[props.index].map((photo) => {
                                        return <Photo
                                            key={ photo.id }
                                            image={ photo.url }
                                            style={ { width: photo.width, height: 100, margin: `0 ${this.props.imagePadding / 2}px` } }
                                        />;
                                    });
                                }

                                return (
                                    <div className="photo-wall__row" key={ props.key } style={ props.style }>
                                        { photos }
                                    </div>
                                );
                            }
                        }
                    />
                )}
            </InfiniteLoader>
        )
    }
}

PhotoWall.propTypes = {
    height: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    imagePadding: PropTypes.number,
    searchKeyword: PropTypes.string.isRequired,
    handleErrorChange: PropTypes.func,
};

PhotoWall.defaultProps = {
    imagePadding: 6,
};

export default PhotoWall;