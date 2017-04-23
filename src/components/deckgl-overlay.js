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

	render(){
		const {viewport,data} = this.props;

		if(!data) return null;

		//See layer lifecycle: https://uber.github.io/deck.gl/#/documentation/getting-started/using-layers?section=available-layers
		//https://uber.github.io/deck.gl/#/documentation/advanced-topics/layer-lifecycle?section=initialization
		const layer = new ScatterplotLayer({
			id:'scatterplot-layer',
			data,
			radiusScale:300,
			getPosition: d => [...d.lngLat,d.r*100],
			getColor: d => [255,255,0,255],
			getRadius: d => 150,
		    radiusMinPixels: 0.25
		});

		return (
			<DeckGL 
				{...viewport}
				layers = {[layer]}
			/>
		);
	}
}

export default DeckGLOverlay;