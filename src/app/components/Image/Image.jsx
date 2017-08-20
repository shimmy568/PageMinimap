import React from 'react';
import PropTypes from 'prop-types';

import './Image.less';

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
    }

    /**
     * The render method for the Image component
     * 
     * @returns {void}
     */
    render(){
        let indexOfStart = this.props.baseUrl.indexOf('*');
        let imgSrc = this.props.baseUrl.substring(0, indexOfStart) + this.props.index + this.props.baseUrl.substring(indexOfStart + 1);

        return(<img className={this.className} ref={(img) => {
            this.imageBody = img;
        }} src={imgSrc} onLoad={() => {
            if(this.props.callback != null){
                this.props.callback();
            }
        }} onError={() => {
            if(this.props.callback != null){
                this.imageBody.remove();
            }
        }}/>);
    }
}

Image.propTypes = {
    baseUrl: PropTypes.string,
    index: PropTypes.number,
    callback: PropTypes.func
};