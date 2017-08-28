import React from 'react';
import PropTypes from 'prop-types';

import './Image.scss';

/**
 * The component that represents an image in a gallery
 */
export class Image extends React.Component {

    /**
     * The default constructor for the Image component
     */
    constructor(){
        super();
        this.className = 'mYx5yS5nJo';
        this.state = {
            focused: false
        };
    }

    /**
     * The render method for the Image component
     * 
     * @returns {JSX.Element} - The rendered content for the Image component
     */
    render(){
        
        let imgSrc;
        if(this.props.src != null){
            imgSrc = this.props.src;
        }else if(this.props.baseUrl != null){
            let indexOfStart = this.props.baseUrl.indexOf('*');
            imgSrc = this.props.baseUrl.substring(0, indexOfStart) + this.props.index + this.props.baseUrl.substring(indexOfStart + 1);
        }

        let classAttr = this.className;
        if(this.state.focused){
            classAttr += ' focused';
        }

        return(<div className={classAttr} ref={(img) => {
            this.imageBody = img;
        }}><img src={imgSrc} onLoad={() => {
            if(this.props.onLoadCallback != null){
                this.props.onLoadCallback(true);
            }
        }} onError={() => {
            if(this.props.onLoadCallback != null){
                this.props.onLoadCallback(false);                
                this.imageBody.remove();
            }
        }} onClick={this.imageOnClickEvent.bind(this)}/></div>);
    }

    /**
     * The event that handles the event for when the user clicks on the button
     * 
     * @returns {void}
     */
    imageOnClickEvent(){
        this.props.focusImage(this.props.index);
    }
}

Image.propTypes = {
    baseUrl: PropTypes.string,
    src: PropTypes.string,
    index: PropTypes.number,
    onLoadCallback: PropTypes.func,
    focusImage: PropTypes.func
};