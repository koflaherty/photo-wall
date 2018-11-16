import React, {Component} from "react";
import PhotoWall from "../../components/photo-wall/photo-wall";
import {PHOTO_KEYWORDS} from "../../constants/constants";

class PhotosPage extends Component {
    constructor() {
        super();

        this.state = {
            windowWidth: 0,
            windowHeight: 0,
            searchKeyword: PHOTO_KEYWORDS[ Math.floor( Math.random() * PHOTO_KEYWORDS.length )],
        };

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

    render() {
        if (this.state.windowWidth === 0) {
            return null;
        }

        return (
            <div style={ { position: 'relative' } }>
                <h1 className="search-title" >{ this.state.searchKeyword }</h1>
                <PhotoWall
                    height={this.state.windowHeight}
                    width={this.state.windowWidth}
                    searchKeyword={this.state.searchKeyword}
                />
            </div>
        );
    }
}

export default PhotosPage;
