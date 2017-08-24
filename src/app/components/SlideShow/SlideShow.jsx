import React from 'react';
import PropTypes from 'prop-types';

import './SlideShow.scss';

/**
 * The slide show component, It is used in gallery to show the images onclick but can also be
 * used on it's own as a regular slideshowy thingy
 * 
 * @author Owen Anderson
 */
export class SlideShow extends React.Component{

    /**
     * The default constructor for the SlideShow component
     */
    constructor(){
        super();
        this.className = 'rGEIdPsvTA';

        this.state = {
            currentImageIndex: 0,
            first: true
        };
    }

    /**
     * Render method for the slideshow component
     * 
     * @returns {JSX.Element} - The rendered content for the SlideShow component
     */
    render(){

        let classValue = this.className;
        if(this.props.fullscreen){
            classValue += " fullscreen";
        }

        let curIndex;
        if(this.state.first && !this.__isIndexOutOfRange(this.props.startIndex)){
            curIndex = this.props.startIndex;
        }else{
            curIndex = this.state.currentImageIndex;
        }

        let imageSrc = this.props.images[curIndex];

        return(
        <div className={classValue} onClick={this.nextImage.bind(this)}>
            <img src={imageSrc}/>
        </div>);
    }

    /**
     * Sets the slideshow to show the next image if there is one
     * @author Owen Anderson
     * 
     * @returns {void}
     */
    nextImage(){
        
        //If its the first time the current index has been changed dont use the state value
        //instead use the user set props value
        let currentIndex = this.state.currentImageIndex;
        if(this.state.first){
            this.currentImageIndex = this.props.startIndex;
        }

        //If the currentIndex var is outside the range stop and just in the case that it's the first state, 
        //set first to false
        if(this.__isIndexOutOfRange(currentIndex + 1)){
            this.setState({
                first: false
            });
            return;
        }

        //Update the state
        this.setState({
            currentImageIndex: currentIndex + 1,
            first: false
        });

        //Call the user provided next image func if provided
        if(this.props.nextImage != null){
            this.props.nextImage();
        }
    }

    /**
     * Sets the slideshow to show the previos image if there is one
     * @author Owen Anderson
     * 
     * @returns {void}
     */
    previousImage(){
        
        //If its the first time the current index has been changed dont use the state value
        //instead use the user set props value
        let currentIndex = this.state.currentImageIndex;
        if(this.state.first){
            this.currentImageIndex = this.props.startIndex;
        }

        //If the currentIndex var is outside the range stop the update
        if(this.__isIndexOutOfRange(currentIndex - 1)){
            this.setState({
                first: false
            });
            return;
        }

        //Update the state
        this.setState({
            currentImageIndex: currentIndex - 1,
            first: false
        });

        //Call the user provided next image func if provided
        if(this.props.nextImage != null){
            this.props.nextImage();
        }
    }

    /**
     * Checks if a given index is within the range of the image props list
     * @author Owen Anderson
     * 
     * @param {number} index - The index that we want to check if is inside the props image list
     * 
     * @returns {boolean} - Weather or not its in the range of the list
     */
    __isIndexOutOfRange(index){
        if(index == null || this.props.images.length <= index || 0 > index){
            return true;
        }else{
            return false;
        }
    }
}

SlideShow.propTypes = {
    fullscreen: PropTypes.bool,
    images: PropTypes.arrayOf(PropTypes.string),
    startIndex: PropTypes.number,
    nextImage: PropTypes.func,
    previousImage: PropTypes.func
};