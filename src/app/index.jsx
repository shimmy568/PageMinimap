import React from 'react';
import ReactDOM from 'react-dom';

import { Gallery } from './components/Gallery/Gallery.jsx';

ReactDOM.render(
    <Gallery dir='images/image*.png'></Gallery>, document.getElementById('root'));