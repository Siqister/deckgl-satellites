import React, {Component} from 'react';
import {render} from 'react-dom';

import App from './app';
import './style.css';

/*const data = getData('./data/UCS_Satellite_Database_7-1-16.csv',parse);
data
	.then(trace('Import'))
	.then(map(getOrbitPosAt(3600*12)))
	.then(trace('Compute latLng'));
*/

render(<App />, document.getElementById('root'));
