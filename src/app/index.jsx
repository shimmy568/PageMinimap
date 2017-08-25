import React from 'react';
import ReactDOM from 'react-dom';

import './index.scss';

//import { Gallery } from './components/Gallery/Gallery.jsx';
import { SlideShow } from './components/SlideShow/SlideShow.jsx';

let imageList = [
    './images/image0.png',
    './images/image1.png',
    './images/image2.png',
    './images/image3.png',
    './images/image4.png',
    './images/image5.png'
];

ReactDOM.render(
    <div id="container"><SlideShow images={imageList}></SlideShow></div>, document.getElementById('root'));