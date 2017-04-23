import React,{Component} from 'react';
import MapGL from 'react-map-gl';

import DeckGLOverlay from './components/deckgl-overlay';
import Legend from './components/legend';
import {config,map,trace,getData,parse,getOrbitPosAt} from './utils/utils';

//For reference: React component lifecycle
//https://facebook.github.io/react/docs/react-component.html

class App extends Component{
	constructor(props){
		super(props);
		this.state = {
			viewport: Object.assign({},DeckGLOverlay.defaultViewport,{width:500,height:500}),
			data:null, //arr of all satellites
			selected:[] //arr of selected satellites
		}
		this._updateAnimationFrame = this._updateAnimationFrame.bind(this);
	}

	componentDidMount(){
	    window.addEventListener('resize', this._resize.bind(this));
	    this._resize();
	    //Issue request, return promise
	    this.request = getData('./data/UCS_Satellite_Database_7-1-16.csv',parse);
	    this.request 
	    	.then(map(getOrbitPosAt(3600*24)))
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

		//Data loaded, enter animation loop
		window.requestAnimationFrame(this._updateAnimationFrame);
	}

	_updateAnimationFrame(delta){
		//On each animation frame, update positions given delta
		//set state and trigger re-render
		this.request
			.then(map(getOrbitPosAt(delta/10)))
			.then(data => {
				this.setState({
					data:data
				});
			});

		window.requestAnimationFrame(this._updateAnimationFrame);
	}

	_updateSelection(selection){
		this.setState({
			selected:selection
		});
	}

	render(){
		const {viewport,data,selected} = this.state;
		//const {latitude,longitude,zoom,width,height} = viewport;

		return (
			<div className='app'>
				<Legend 
					data = {data}
					selected = {selected}
					updateSelection = {this._updateSelection.bind(this)}
				/>
				<MapGL
					{...viewport}
					perspectiveEnabled={true}
					mapboxApiAccessToken={config.MAPBOX_TOKEN}
					mapStyle="mapbox://styles/siqizhu01/cj1ra4dty000f2slit21dg3cv"
					onChangeViewport={this._onChangeViewport.bind(this)}
				>
					<DeckGLOverlay
						viewport = {viewport}
						data = {data}
					>
					</DeckGLOverlay>
				</MapGL>
			</div>
		);
	}
}

export default App;
