import React from 'react';
import PropTypes from 'prop-types';

import Next from "./assets/Next.svg";
import Previous from "./assets/Previous.svg";

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

        this.startingTime = 0;
        this.cooldownDuration = 300; //How long before the user can switch images agian in ms

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

        //Set default values
        this.cooldownDuration = this.props.imageSwitchCoolDownTime || 300;

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
        <div className={classValue} tabIndex="99999" onKeyDown={this.keyDownEventHandler.bind(this)} onKeyUp={this.resetImageChangeCooldown.bind(this)}>
            <button/>
            <img src={imageSrc} onClick={this.nextImage.bind(this)}/>
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
     * The event that checks for left and right mouse presses and goes to the next and previous images accordingly
     * @author Owen Anderson
     * 
     * @param {KeyboardEvent} e - The event object passed in from the event
     * 
     * @returns {void}
     */
    keyDownEventHandler(e){
        if(this.isImageSwitchCooldownDone()){
            if(e.keyCode === 39){ //right arrow key
                this.setCooldownTime();
                this.nextImage();
            } else if(e.keyCode === 37) { //left arrow key
                this.setCooldownTime();
                this.previousImage();
            }
        }
    }

    /**
     * Checks if the cooldown for switching images is over yet
     * @author Owen Anderson
     * 
     * @returns {boolean} - True if it is False if not
     */
    isImageSwitchCooldownDone(){
        return new Date().getTime() - this.startingTime > this.cooldownDuration;
    }

    /**
     * Sets the cooldown for going to the next image and previous image, this prevents
     * the images from being swapped multiple times on accident
     * @author Owen Anderson
     * 
     * @returns {void}
     */
    setCooldownTime(){
        this.startingTime = new Date().getTime();
    }

    /**
     * Resets the image change cooldown to be off, it does this by setting startingTime to zero so any
     * time will be far enough away to be considered off cooldown
     * @author Owen Anderson
     * 
     * @returns {void}
     */
    resetImageChangeCooldown(){
        this.startingTime = 0;
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
    previousImage: PropTypes.func,
    imageSwitchCoolDownTime: PropTypes.number
};