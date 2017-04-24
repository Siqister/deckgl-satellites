import React,{Component} from 'react';
import DeckGL, {ScatterplotLayer, LineLayer} from 'deck.gl';
//import OrbitLayer from '../layers/orbit-layer';
import SatelliteLayer from '../layers/satellite-layer';
import {getOrbit} from '../utils/utils';

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
		const {viewport,data,selected,orbit} = this.props;

		if(!data) return null;

		//See layer lifecycle: https://uber.github.io/deck.gl/#/documentation/getting-started/using-layers?section=available-layers
		//https://uber.github.io/deck.gl/#/documentation/advanced-topics/layer-lifecycle?section=initialization
		const baseLayer = new SatelliteLayer({
			id:'base-layer',
			data,
			radiusScale:600,
			getPosition: d => [...d.lngLat,d.r*300],
			getColor: d => [255,255,255,255],
			getRadius: d => 200,
		    radiusMinPixels: 0.25
		});
		const orbitLayer = new LineLayer({
			id:'orbit-layer',
			data:orbit,
			strokeWidth:1,
			getSourcePosition: d => [...d.from.lngLat, d.from.r*300],
			getTargetPosition: d => [...d.to.lngLat, d.to.r*300],
			getColor: d => [255,255,255,5]
		});
		const highlightLayer = new SatelliteLayer({
			id:'highlight-layer',
			data:selected,
			radiusScale:600,
			getPosition: d => [...d.lngLat,d.r*300],
			getColor: d => [255,255,0,255],
			getRadius: d => 350,
		    radiusMinPixels: 0.25
		}); 
		const highlightOrbitLayer = new LineLayer({
			id:'highlight-orbit-layer',
			data:selected.map(getOrbit).reduce((result,segments)=>result.concat(segments),[]),
			strokeWidth:1,
			getSourcePosition: d => [...d.from.lngLat, d.from.r*300],
			getTargetPosition: d => [...d.to.lngLat, d.to.r*300],
			getColor: d => [255,255,255,50]
		});

		return (
			<DeckGL 
				{...viewport}
				layers = {[
					baseLayer,
					//orbitLayer, /* FIXME: slow!! */
					highlightLayer,
					highlightOrbitLayer
				]}
			/>
		);
	}
}

export default DeckGLOverlay;