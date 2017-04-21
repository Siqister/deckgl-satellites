import React,{Component} from 'react';
import DeckGL, {ScatterplotLayer} from 'deck.gl';

class DeckGLOverlay extends Component{

	static get defaultViewport(){
	    return {
	      longitude: -100,
	      latitude: 0,
	      zoom: .1,
	      maxZoom: 2,
	      pitch: 60,
	      bearing: 0
	    };
	}

	constructor(props){
		super(props);
	}

	_initialize(gl) {
		gl.enable(gl.DEPTH_TEST);
		gl.depthFunc(gl.LEQUAL);
	}

	render(){
		const {viewport,data} = this.props;
		//const {latitude,longitude,zoom,width,height,pitch,bearing} = viewport;

		//console.log(data);

		if(!data) return null;

		const layer = new ScatterplotLayer({
			id:'scatterplot-layer',
			data,
			radiusScale:20,
			getPosition: d => [...d.lngLat,0],
			getColor: d => [255,0,0,255],
			getRadius: d => 100,
		    radiusMinPixels: 0.25,
		    getRadius: d => 1
		});

		return (
			<DeckGL 
				{...viewport}
				layers = {[layer]}
				//onWebGLInitialized={this._initialize}
				debug={true}
			/>
		);
	}
}

export default DeckGLOverlay;