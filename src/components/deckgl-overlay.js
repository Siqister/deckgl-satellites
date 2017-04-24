import React,{Component} from 'react';
import DeckGL, {ScatterplotLayer, LineLayer} from 'deck.gl';
//import OrbitLayer from '../layers/orbit-layer';
import SatelliteLayer from '../layers/satellite-layer';
import {getOrbit} from '../utils/utils';

const Z_FACTOR = 300; //multiplier for altitude elevation of satellites

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

	_onHover(info){
		this.props.onHover(info.x, info.y, JSON.stringify(info.object));
	}

	render(){
		const {viewport,data,selected,orbit} = this.props;
		const onHover = this._onHover.bind(this);

		if(!data) return null;

		//See layer lifecycle: https://uber.github.io/deck.gl/#/documentation/getting-started/using-layers?section=available-layers
		//https://uber.github.io/deck.gl/#/documentation/advanced-topics/layer-lifecycle?section=initialization
		//FIXME: z attribute calculation is hardcoded
		const baseLayer = new SatelliteLayer({
			id:'base-layer',
			data,
			radiusScale:600,
			getPosition: d => [...d.lngLat,d.r*Z_FACTOR],
			getColor: d => [255,255,255,255],
			getRadius: d => 200,
		    radiusMinPixels: 0.25,
		    pickable:true,
		    onHover: onHover
		});
		const orbitLayer = new LineLayer({
			id:'orbit-layer',
			data:orbit,
			strokeWidth:1,
			getSourcePosition: d => [...d.from.lngLat, d.from.r*Z_FACTOR],
			getTargetPosition: d => [...d.to.lngLat, d.to.r*Z_FACTOR],
			getColor: d => [255,255,255,5]
		});
		const highlightLayer = new SatelliteLayer({
			id:'highlight-layer',
			data:selected,
			radiusScale:600,
			getPosition: d => [...d.lngLat,d.r*Z_FACTOR],
			getColor: d => [255,255,0,255],
			getRadius: d => 350,
		    radiusMinPixels: 0.25,
		    pickable:true,
		    onHover: onHover
		}); 
		const highlightOrbitLayer = new LineLayer({
			id:'highlight-orbit-layer',
			data:selected.map(getOrbit).reduce((result,segments)=>result.concat(segments),[]), //FIXME: should not reduce on every animation frame, memoize
			strokeWidth:1,
			getSourcePosition: d => [...d.from.lngLat, d.from.r*Z_FACTOR],
			getTargetPosition: d => [...d.to.lngLat, d.to.r*Z_FACTOR],
			getColor: d => [255,255,255,50]
		});

		return (
			<DeckGL 
				{...viewport}
				layers = {[
					baseLayer,
					//orbitLayer, /* FIXME: slow with >1M path segments, need to figure out more economical way of rendering these */
					highlightLayer,
					highlightOrbitLayer
				]}
			/>
		);
	}
}

export default DeckGLOverlay;