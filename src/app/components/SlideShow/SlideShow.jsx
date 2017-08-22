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
    }

    /**
     * Render method for the slideshow component
     * 
     * @returns {JSX.Element} - The rendered content for the SlideShow component
     */
    render(){

        return(<div className={this.className}>SlideShow component</div>);
    }
}