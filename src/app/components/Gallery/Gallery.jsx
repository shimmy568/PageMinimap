import React from 'react';
import PropTypes from 'prop-types';

import './Gallery.less';
import { Image } from './../Image/Image.jsx';

/**
 * A thing for testing a playing around
 */
export class Gallery extends React.Component {

    /**
     * Default constuctor for the gallery class
     */
    constructor(){
        super();
        this.className = 'E8CSls1TAR';
        this.state = {
            loadedImages: 0,
            focusedImage: null
        };
    }

    /**
     * The render method for the Gallery component
     *
     * @returns {void}
     */
    render() {
        let children = [];

        for(let i = 0; i < this.state.loadedImages; i++){
            children.push(<Image key={'image' + i} baseUrl={this.props.dir} index={i}></Image>);
        }

        

        children.push(<Image key={'image' + this.state.loadedImages} baseUrl={this.props.dir} index={this.state.loadedImages} callback={this.imageCallback.bind(this)}></Image>);

        return (<div className={this.className}>{children}</div>);
    }

    /**
     * Calls when the image has been loaded properly and the next one needs to be loaded
     * @author Owen Anderson
     * 
     * @returns {void}
     */
    imageCallback(){
        this.setState({
            loadedImages: this.state.loadedImages + 1
        });
    }
}


Gallery.propTypes = {
    dir: PropTypes.string
};