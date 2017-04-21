import React,{Component} from 'react';
import MapGL from 'react-map-gl';

import DeckGLOverlay from './deckgl-overlay';
import {config,map,trace,getData,parse,getOrbitPosAt} from './utils/utils';


class App extends Component{
	constructor(props){
		super(props);
		this.state = {
			viewport: Object.assign({},DeckGLOverlay.defaultViewport,{width:500,height:500}),
			data:null
		}
	}

	componentDidMount(){
	    window.addEventListener('resize', this._resize.bind(this));
	    this._resize();
	    this.request = getData('./data/UCS_Satellite_Database_7-1-16.csv',parse)
	    	.then(map(getOrbitPosAt(3600*12)))
	    	.then(this._onDataLoaded.bind(this));
	}

	_resize(){
	    this._onChangeViewport({
	      width: window.innerWidth,
	      height: window.innerHeight
	    });
	}

	_onChangeViewport(newViewport){
		let viewport = Object.assign({}, this.state.viewport, newViewport);
		this.setState({
			viewport:viewport
		});
	}

	_onDataLoaded(data){
		this.setState({
			data:data
		});
	}

	componentWillUpdate(nextProps, nextState){
	}

	render(){
		const {viewport,data} = this.state;
		//const {latitude,longitude,zoom,width,height} = viewport;

		return (
			<MapGL
				{...viewport}
				perspectiveEnabled={true}
				mapboxApiAccessToken={config.MAPBOX_TOKEN}
				mapStyle="mapbox://styles/mapbox/satellite-v9"
				onChangeViewport={this._onChangeViewport.bind(this)}
			>
				<DeckGLOverlay
					viewport = {viewport}
					data = {data}
				>
				</DeckGLOverlay>
			</MapGL>
		);
	}
}

export default App;
