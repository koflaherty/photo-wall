import React, {Component} from "react";
import PhotoWall from "../../components/photo-wall/photo-wall";
import {PHOTO_KEYWORDS} from "../../constants/constants";

class PhotosPage extends Component {
    constructor() {
        super();

        this.state = {
            photoWallError: false,
            windowWidth: 0,
            windowHeight: 0,
            searchKeyword: PHOTO_KEYWORDS[ Math.floor( Math.random() * PHOTO_KEYWORDS.length )],
        };

        this.handlePhotoWallError = this.handlePhotoWallError.bind(this);
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }

    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions() {
        this.setState({ windowWidth: window.innerWidth, windowHeight: window.innerHeight });
    }

    handlePhotoWallError(photoWallError) {
        this.setState({
            photoWallError
        });
    }

    render() {
        if (this.state.windowWidth === 0) {
            return null;
        }

        return (
            <div style={ { position: 'relative' } }>
                <div className="floating-content">
                    <h1 className="search-title" >{ this.state.searchKeyword }</h1>
                    {
                        this.state.photoWallError &&
                        <p className="error-message">There was an error loading images from Giphy</p>
                    }
                </div>
                <PhotoWall
                    height={this.state.windowHeight}
                    width={this.state.windowWidth}
                    searchKeyword={this.state.searchKeyword}
                    handleErrorChange={this.handlePhotoWallError}
                />
            </div>
        );
    }
}

export default PhotosPage;
