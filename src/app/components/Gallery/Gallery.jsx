import React from 'react';
import PropTypes from 'prop-types';

import './Gallery.scss';
import { Image } from './../Image/Image.jsx';

/**
 * An image gallery
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
            focusedImage: -1
        };
    }

    /**
     * The render method for the Gallery component
     *
     * @returns {JSX.Element} - The rendered content for the component
     */
    render() {
        let children = [];

        for(let i = 0; i < this.state.loadedImages; i++){
            children.push(<Image key={'image' + i} focusImage={this.focusImage.bind(this)} baseUrl={this.props.dir} index={i}></Image>);
        }

        let focusedImage;
        if(this.state.focusedImage !== -1){
            focusedImage = (<div>{this.state.focusedImage}</div>);
        }

        children.push(<Image key={'image' + this.state.loadedImages} focusImage={this.focusImage.bind(this)} baseUrl={this.props.dir} index={this.state.loadedImages} callback={this.imageCallback.bind(this)}></Image>);

        return (<div className={this.className}>{focusedImage}{children}</div>);
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

    /**
     * Makes a given image the focused one, this means that it's big and up front and shit
     * @author Owen Anderson
     * 
     * @param {number} imageIndex - The index of the image in the gallery
     * 
     * @returns {void}
     */
    focusImage(imageIndex){
        this.setState({
            focusedImage: imageIndex
        });
    }
}


Gallery.propTypes = {
    dir: PropTypes.string
};