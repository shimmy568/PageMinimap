import React from 'react';
import ReactDOM from 'react-dom';

import './index.scss';

import { Gallery } from './components/Gallery/Gallery.jsx';
import { SlideShow } from './components/SlideShow/SlideShow.jsx';

let imageList = [
    './images/image0.png',
    './images/image1.png',
    'https://lh3.googleusercontent.com/eftq4Sg95rUqiJcx_JESlHbYFRvDLE8f7qdCWAp3u2OxGAukFXPsSarn-O8IKFdc0P7HPmoWKw=w640-h400-e365',
];

let gridData = {
    columnTemplate: [],
    rowTemplate: [],
    indexs: [
        [0, 0, 1, 1, 1],
        [0, 0, 1, 1, 1],
        [0, 0, 1, 1, 1],
        [0, 0, 2, 2, 2],
        [0, 0, 2, 2, 2]
    ]
};


// <Gallery thumbAspectRatio={1} imageSwitchCoolDownTime={1000} dir='./images/image*.png'/>
ReactDOM.render(
    <div id="container"><Gallery gridData={gridData} displayType='grid' images={'./images/imagegrid*.png'} focusImageOnClick={true} /></div>, document.getElementById('root'));

