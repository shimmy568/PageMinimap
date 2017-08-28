import React from 'react';
import PropTypes from 'prop-types';

import Next from './assets/Next.svg';
import Previous from './assets/Previous.svg';

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
     * 
     * @param {any} props - The properties for the slideshow
     */
    constructor(props){
        super();
        this.className = 'rGEIdPsvTA';

        this.startingTime = 0;
        this.cooldownDuration = 300; //How long before the user can switch images agian in ms

        this.state = {
            currentImageIndex: props.startIndex,
            first: true,
            imageAspectRatio: -1 //Base value untill it gets set for the first time
        };

        //vars used for getting the aspect ratio of the div with an image in it
        this.extraWidthPadding = (11 * 2); //10px for padding on left and right and border width
        this.extraHeightPadding = 42 + (11 * 2); //42 is the height of the buttons above
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
            classValue += ' fullscreen';
        }

        /* let curIndex;
        if(this.state.first && !this.isIndexOutOfRange(this.props.startIndex)){
            curIndex = this.props.startIndex;
        }else{
            curIndex = this.state.currentImageIndex;
        } */

        let imageSrc = this.props.images[this.state.currentImageIndex];

        let fullscreenOnLoadEvent;
        if(this.props.fullscreen){
            //If its the first time for aspect ratio set
            if(this.slideShowContainer != null && this.state.imageAspectRatio !== -1){
                this.updateImageSize();
            }
            fullscreenOnLoadEvent = this.updateAspectRatio.bind(this);
            window.addEventListener('resize', this.updateImageSize.bind(this));
        }

        return(
            <div ref={(input) => {this.slideShowContainer = input;}} className={classValue} tabIndex='99999' onKeyDown={this.keyDownEventHandler.bind(this)} onKeyUp={this.resetImageChangeCooldown.bind(this)}>
                <div className='buttonContainer'>
                    <button onClick={this.previousImage.bind(this)}><Previous width={24} height={24}/></button>
                    <div className='numberReadout'>{this.state.currentImageIndex + 1}/{this.props.images.length}</div>
                    <button onClick={this.nextImage.bind(this)}><Next width={24} height={24}/></button>
                </div>
                <img src={imageSrc} onLoad={fullscreenOnLoadEvent} onClick={this.nextImage.bind(this)}/>
            </div>
        );
    }

    /**
     * Updates the aspect ratio for fullscreen
     * @author Owen Anderson
     * 
     * @returns {void}
     */
    updateAspectRatio(){
        let loadedImage = this.slideShowContainer.getElementsByTagName('IMG')[0];


        let divWidth = loadedImage.getBoundingClientRect().width;
        let divHeight = loadedImage.getBoundingClientRect().height;
        this.setState({
            imageAspectRatio: divWidth / divHeight
        });
    }

    /**
     * Updates the image size based on the new window size
     * @author Owen Anderson
     * 
     * @returns {void}
     */
    updateImageSize(){

        //Slideshow is gone :c remove event listener
        if(this.slideShowContainer == null){
            window.removeEventListener("resize", this.updateImageSize.bind(this));
            return;
        }

        //If the image has loaded in it's aspect ratio
        if(this.state.imageAspectRatio !== -1){
            let windowWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
            let windowHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    
            //Test if making the div width equal to window width will work
            let imageWidth = windowWidth - this.extraWidthPadding;
            let divHeight = (imageWidth / this.state.imageAspectRatio) + this.extraHeightPadding;
            if(divHeight <= windowHeight){
                this.slideShowContainer.style.width = windowWidth + 'px';
                this.slideShowContainer.style.height = divHeight + 'px';
            } else {
                //If it did not make the div height equal to window height
                let imageHeight = windowHeight - this.extraHeightPadding;
                let divWidth = (imageHeight * this.state.imageAspectRatio) + this.extraWidthPadding;

                this.slideShowContainer.style.height = windowHeight + 'px';
                this.slideShowContainer.style.width = divWidth + 'px';
            }
        }
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
        if(this.isIndexOutOfRange(currentIndex + 1)){
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
        if(this.isIndexOutOfRange(currentIndex - 1)){
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
    isIndexOutOfRange(index){
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