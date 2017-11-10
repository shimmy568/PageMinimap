import React from 'react';
import PropTypes from 'prop-types';

import './Gallery.scss';
import { Image } from './../Image/Image.jsx';
import { SlideShow } from './../SlideShow/SlideShow.jsx';
// eslint-disable-next-line no-unused-vars
import { GridData } from './../../objects/GridData.js';

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
            loaded: (typeof props.images === "object" && typeof props.images.length === "number"),
            displayType: props.displayType || 'default'
        };
        this.first = true;
    }

    /**
     * The render method for the Gallery component
     *
     * @returns {JSX.Element} - The rendered content for the component
     */
    render() {

        //The setting for that allows the user to disable the ability to focus images
        let focusImageFunc;
        if(this.props.focusImageOnClick === true || this.props.focusImageOnClick == null){
            focusImageFunc = this.focusImage.bind(this);
        }else{
            focusImageFunc = null;
        }

        //Set the class name for the parent for the diffrent display types
        let className = this.className;
        let gridCss = {
            container: null,
            images: []
        };
        if(this.state.displayType === 'grid'){
            className += ' grid';
            let gridData = new GridData(
                this.props.gridData.columnTemplate,
                this.props.gridData.rowTemplate,
                this.props.gridData.indexs
            );

            let n = 0;
            if(typeof this.props.images === "string"){
                n = this.state.loadedImages;
            }else if(typeof this.props.images === "object" && typeof this.props.images.length === "number"){
                n = this.props.images.length;
            }else{
                throw new Error("images argument must be a list of urls or a string for the path");
            }
            gridCss = this.__processGridDataImages(n, gridData);
        }

        //Loads the images using either image list or dir
        let children = [];
        let loadedImageSrcList = [];        
        if(typeof this.props.images === "string"){
            for(let i = 0; i < this.state.loadedImages; i++){
                let src = this.generateSrc(this.props.images, i);
                children.push(<Image
                    key={'image' + i}
                    style={gridCss.images[i]}
                    aspectRatio={this.props.thumbAspectRatio}
                    onClick={focusImageFunc}
                    baseUrl={this.props.images}
                    index={i}/>
                );
                loadedImageSrcList.push(src);
            }
            children.push(<Image 
                key={'image' + this.state.loadedImages}
                aspectRatio={this.props.thumbAspectRatio}
                onClick={focusImageFunc}
                style={gridCss.images[this.state.loadedImages]}
                baseUrl={this.props.images} index={this.state.loadedImages}
                onLoadCallback={this.imageCallback.bind(this)}/>
            );    
        } else if(typeof this.props.images === "object" && typeof this.props.images.length === "number"){ 
            loadedImageSrcList = this.props.images;
            for(let i = 0; i < loadedImageSrcList.length; i++){
                children.push(<Image
                    key={'image' + i}
                    style={gridCss.images[i]}
                    aspectRatio={this.props.thumbAspectRatio}
                    onClick={focusImageFunc}
                    src={loadedImageSrcList[i]}
                    index={i}/>
                );
            }
        } else{
            throw new Error("Either dir or imageList must be set");
        }

        //Create the slideshow for the focused element, will not show it unless
        //all images are loaded.
        let focusedImage;
        if(this.state.focusedImage !== -1 && this.state.loaded){
            focusedImage = (
                <div className='aplhaLayer' onClick={this.removeFocus.bind(this)}>
                    <SlideShow fullscreen={true} images={loadedImageSrcList} startIndex={this.state.focusedImage}/>
                </div>
            );
        }

        return (<div style={gridCss.container} className={className}>{focusedImage}{children}</div>);
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
        this.triggerResizeEvent();
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
     * Triggers the resize event, used to make sure the
     * images keep aspect ratio when loaded using dir
     * @author Owen Anderson
     * 
     * @returns {void}
     */
    triggerResizeEvent(){
        let event = document.createEvent('UIEvent');
        event.initEvent('resize', true, false);
        window.dispatchEvent(event);
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

    /**
     * Adds all the css style to the images based off the data provided in gridData, 
     * this function just edits them via the pointers
     * @author Owen Anderson
     * @throws When the gridData param is not rectangular
     * 
     * @param {number} n - The number of images in the grid
     * @param {GridData} gridData - The grid data object that was passed in
     * 
     * @returns {object} - The css to be applied to the container and the images
     */
    __processGridDataImages(n, gridData){
        let returnStuff = {
            gridTemplateColumns: "",
            gridTemplateRows: ""
        };
        
        for(let i = 0; i < gridData.colSizes.length; i++){
            returnStuff.gridTemplateColumns += gridData.colSizes[i] + " ";
        }

        for(let i = 0; i < gridData.rowSizes.length; i++){
            returnStuff.gridTemplateRows += gridData.rowSizes[i] + " ";
        }

        let imageCss = [];
        for(let i = 0; i < n; i++){
            let data = gridData.getImageData(i);
            imageCss.push({
                gridColumnStart: data.colStart,
                gridColumnEnd: data.colEnd,
                gridRowStart: data.rowStart,
                gridRowEnd: data.rowEnd
            });
        }

        return {
            container: returnStuff,
            images: imageCss
        };
    }
}


Gallery.propTypes = {
    images: PropTypes.oneOf([PropTypes.arrayOf(PropTypes.string), PropTypes.string]),
    thumbAspectRatio: PropTypes.number,
    focusImageOnClick: PropTypes.bool,
    displayType: PropTypes.string,
    gridData: PropTypes.shape({
        columnTemplate: PropTypes.arrayOf(PropTypes.oneOf([PropTypes.number, PropTypes.string])),
        rowTemplate: PropTypes.arrayOf(PropTypes.oneOf([PropTypes.number, PropTypes.string])),
        indexs: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number))
    })
};