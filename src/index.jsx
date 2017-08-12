import React from "react";

import ReactDOM from "react-dom";

/**
 * A thing for testing a playing around
 */
class Image extends React.Component {
    /**
     * The render method for the Thing component
     * 
     * @returns {void}
     */
    render() {
        return (
            <img src={this.props.src}/>
        );
    }
}

ReactDOM.render(
    <Image src="http://i.imgur.com/YT00vai.jpg"></Image>,
    document.getElementById("root")
);