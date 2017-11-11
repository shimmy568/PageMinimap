import React from 'react';
import PropTypes from 'prop-types';

import Next from './assets/Next.svg';
import Previous from './assets/Previous.svg';
import Close from './assets/Close.svg';

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
        this.imageSwitchTimeoutID; //How long before the user can switch images agian in ms
        this.lastProgressionTime = 0;
        this.progressionCooldown = 300; //Time before the user can go to the next image using the left and right click buttons

        this.state = {
            currentImageIndex: props.startIndex || 0,
            first: true,
            imageAspectRatio: -1, //Base value untill it gets set for the first time
            progressDisplayType: props.progressDisplayType || "fraction"
        };

    }

    /**
     * Render method for the slideshow component
     * 
     * @returns {JSX.Element} - The rendered content for the SlideShow component
     */
    render(){

        if(this.props.images == null){
            throw new Error('Images prop must not be null');
        }

        //Set default values
        this.cooldownDuration = this.props.imageSwitchCoolDownTime || 300;

        let classValue = this.className;
        if(this.props.fullscreen){
            classValue += ' fullscreen';
        }

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

        if(this.props.imageSwitchCoolDownTime != null && this.imageSwitchTimeoutID == null){
            this.imageSwitchTimeoutID = window.setTimeout(this.progressSlideshow.bind(this), this.props.imageSwitchCoolDownTime);
        }

        //Code to set the progress tracker type
        let progressTracker;
        switch(this.state.progressDisplayType) {
            case "fraction":{
                progressTracker = <div className='fractionTracker'>{' ' + (this.state.currentImageIndex + 1) + '/' + this.props.images.length + ' '}</div>;
                break;
            }
            default:{
                throw new Error("That is not a valid progress display type");
            }
        }

        let displayLeft = "block";
        if(this.state.currentImageIndex === 0){
            displayLeft = "None";
        }
        let displayRight = "block";
        if(this.state.currentImageIndex === this.props.images.length - 1){
            displayRight = "None";
        }

        return(
            <div ref={(input) => {this.slideShowContainer = input;}} className={classValue} tabIndex='99999' onKeyDown={this.keyDownEventHandler.bind(this)} onKeyUp={this.resetImageChangeCooldown.bind(this)}>
                <button style={{display: displayLeft}} className='left' onClick={this.previousImage.bind(this)}><Previous width={50} height={50}/></button>
                <button style={{display: displayRight}} className='right' onClick={this.nextImage.bind(this)}><Next width={50} height={50}/></button>
                <button className='close' onClick={this.props.onClose}><Close width={20} height={20}/></button>
                <div className='progressTracker'>{progressTracker}</div>
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
            let windowWidth = window.innerWidth || 0;
            let windowHeight = window.innerHeight || 0;

            //Test if making the div width equal to window width will work
            let imageWidth = windowWidth;
            let divHeight = (imageWidth / this.state.imageAspectRatio);
            if(divHeight <= windowHeight){
                this.slideShowContainer.style.width = windowWidth + 'px';
                this.slideShowContainer.style.height = divHeight + 'px';
            } else {
                //If it did not make the div height equal to window height
                let imageHeight = windowHeight;
                let divWidth = (imageHeight * this.state.imageAspectRatio);

                this.slideShowContainer.style.height = windowHeight + 'px';
                this.slideShowContainer.style.width = divWidth + 'px';
            }

            this.setUIElementSize();
        }
    }

    /**
     * Sets the size of the ui elements in the slideshow
     * @author Owen Anderson
     * 
     * @returns {void}
     */
    setUIElementSize(){
        let image = this.slideShowContainer.getElementsByTagName('IMG')[0];

        //Get the smaller of the two dimensions for the image
        let smallerDim;
        if(image.getBoundingClientRect().width <= image.getBoundingClientRect().height){
            smallerDim = image.getBoundingClientRect().width;
        }else{
            smallerDim = image.getBoundingClientRect().height;
        }

        //set the next and prev buttons dimensions
        let btns = this.slideShowContainer.getElementsByTagName('BUTTON');
        for(let i = 0; i < btns.length; i++){
            let dim = 0;
            if(btns[i].classList.contains('close')){
                dim = 0.05 * smallerDim;
            }else{
                dim = 0.1 * smallerDim;
            }
            if(dim > 50){
                dim = 50;
            }
            btns[i].firstChild.style.width = dim + 'px';
            btns[i].firstChild.style.height = dim + 'px';
        }

        //set the dimensions for the progress tracker
        switch(this.state.progressDisplayType){
            case 'fraction': {
                let el = this.slideShowContainer.getElementsByClassName('fractionTracker')[0];
                if(smallerDim * 0.0048 > 2.5){
                    el.style.fontSize = '2.5em';
                }else{
                    el.style.fontSize = (smallerDim * 0.0048) + 'em';            
                }
                break;
            }
        }
    }

    /**
     * Sets the slideshow to show the next image if there is one
     * @author Owen Anderson
     * 
     * @param {MouseEvent} e - The event passed in, used to check if this was a button thing
     * 
     * @returns {void}
     */
    nextImage(e){
        
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
        }else{
            if(!(e != null && new Date().getTime() - this.lastProgressionTime <= this.progressionCooldown)){
                //Update the state
                this.lastProgressionTime = new Date().getTime(); //save the time
                this.setState({
                    currentImageIndex: currentIndex + 1,
                    first: false
                });
            }                
        }
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
     * @param {MouseEvent} e - Used to check if the function was called from an mouse event
     * 
     * @returns {void}
     */
    previousImage(e){
        
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
        }else{
            if(!(e != null && new Date().getTime() - this.lastProgressionTime <= this.progressionCooldown)){
                //Update the state
                this.lastProgressionTime = new Date().getTime();
                this.setState({
                    currentImageIndex: currentIndex - 1,
                    first: false
                });
            }
        }


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

    /**
     * Used to progress the timeout for the slideshow used for auto progression
     * for the slides
     * @author Owen Anderson
     * 
     * @returns {void}
     */
    progressSlideshow(){
        if(this.props.images.length - 1 === this.state.currentImageIndex){
            this.setState({
                currentImageIndex: 0,
                first: false
            });
        }else{
            this.nextImage();
        }
        window.setTimeout(this.progressSlideshow.bind(this), this.props.imageSwitchCoolDownTime);
    }
}

SlideShow.propTypes = {
    fullscreen: PropTypes.bool,
    images: PropTypes.arrayOf(PropTypes.string),
    startIndex: PropTypes.number,
    nextImage: PropTypes.func,
    previousImage: PropTypes.func,
    imageSwitchCoolDownTime: PropTypes.number,
    progressDisplayType: PropTypes.string,
    onClose: PropTypes.func
};