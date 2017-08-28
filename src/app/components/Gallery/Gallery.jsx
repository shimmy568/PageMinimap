import React from 'react';
import PropTypes from 'prop-types';

import './Gallery.scss';
import { Image } from './../Image/Image.jsx';
import { SlideShow } from './../SlideShow/SlideShow.jsx';

/**
 * An image gallery
 */
export class Gallery extends React.Component {

    /**
     * Default constuctor for the gallery class
     * 
     * @param {any} props - The props for the gallery
     */
    constructor(props){
        super();
        this.className = 'E8CSls1TAR';
        this.state = {
            loadedImages: 0,
            focusedImage: -1,
            loaded: props.imageList != null
        };
    }

    /**
     * The render method for the Gallery component
     *
     * @returns {JSX.Element} - The rendered content for the component
     */
    render() {
        
        let children = [];
        let loadedImageSrcList = [];        
        if(this.props.dir != null){
            for(let i = 0; i < this.state.loadedImages; i++){
                let src = this.generateSrc(this.props.dir, i);
                children.push(<Image
                    key={'image' + i}
                    focusImage={this.focusImage.bind(this)}
                    baseUrl={this.props.dir}
                    index={i}/>
                );
                loadedImageSrcList.push(src);
            }
            children.push(<Image 
                key={'image' + this.state.loadedImages}
                focusImage={this.focusImage.bind(this)}
                baseUrl={this.props.dir} index={this.state.loadedImages}
                onLoadCallback={this.imageCallback.bind(this)}/>
            );    
        } else if(this.props.imageList != null){
            loadedImageSrcList = this.props.imageList;
            for(let i = 0; i < loadedImageSrcList.length; i++){
                children.push(<Image
                    key={'image' + i}
                    focusImage={this.focusImage.bind(this)}
                    src={loadedImageSrcList[i]}
                    index={i}/>
                );
            }
        } else{
            throw new Error("Either dir or imageList must be set");
        }

        let focusedImage;
        if(this.state.focusedImage !== -1 && this.state.loaded){
            focusedImage = (
                <div className='aplhaLayer' onClick={this.removeFocus.bind(this)}>
                    <SlideShow fullscreen={true} images={loadedImageSrcList} startIndex={this.state.focusedImage}/>
                </div>
            );
        }

        return (<div className={this.className}>{focusedImage}{children}</div>);
    }

    /**
     * Calls when the image has been loaded properly and the next one needs to be loaded
     * @author Owen Anderson
     * 
     * @param {boolean} result - Wether or not the imaged loaded or not
     * 
     * @returns {void}
     */
    imageCallback(result){
        if(result){
            this.setState({
                loadedImages: this.state.loadedImages + 1
            });
        }else{
            this.setState({
                loaded: true
            });
        }
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

    /**
     * Generates the src for an image in the gallery
     * @author Owen Anderson
     * 
     * @param {string} base - The base url that will have the * in it replaced with the index
     * @param {number} index - The number that will replace the * in the base
     * 
     * @returns {string} - The image src
     */
    generateSrc(base, index){
        let starIndex = base.indexOf('*');

        //If there is no star throw error
        if(starIndex === -1){
            throw new Error('There was no * in the dir URL');
        }

        return base.substring(0, starIndex) + index + base.substring(starIndex + 1);
    }

    /**
     * Closes the focus mode, triggered when the user clicks outside the slideshow
     * @author Owen Anderson
     * 
     * @param {MouseEvent} e - The mouse event object passed in
     * 
     * @returns {void}
     */
    removeFocus(e){
        if(e.target.classList.contains("aplhaLayer")){
            this.setState({
                focusedImage: -1
            });
        }
    }
}


Gallery.propTypes = {
    dir: PropTypes.string,
    imageList: PropTypes.arrayOf(PropTypes.string)
};