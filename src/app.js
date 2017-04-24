import React,{Component} from 'react';
import {render} from 'react-dom';
import MapGL from 'react-map-gl';

import DeckGLOverlay from './components/deckgl-overlay';
import Legend from './components/legend';
import Tooltip from './components/tooltip';
import {config, map, trace, getData, parse, getOrbitPosAt, getOrbit} from './utils/utils';

import './style.css';

//For reference: React component lifecycle
//https://facebook.github.io/react/docs/react-component.html

class App extends Component{
	constructor(props){
		super(props);
		this.state = {
			viewport: Object.assign({},DeckGLOverlay.defaultViewport,{width:500,height:500}),
			data:null, //array of all satellites
			selected:[], //array of satellites selected via brush
			orbit:null, //array of all satellite orbits
			tooltip:null
		}
		this._updateAnimationFrame = this._updateAnimationFrame.bind(this);
	}

	componentDidMount(){
	    window.addEventListener('resize', this._resize.bind(this));
	    this._resize();
	    
	    //Issue request, return promise
	    this.request = getData('./data/UCS_Satellite_Database_7-1-16.csv',parse);
	    this.request 
	    	.then(map(getOrbitPosAt(0)))
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
			data:data,
			orbit:data.map(getOrbit).reduce((result,segments)=>result.concat(segments),[])
		});

		//Data loaded, enter animation loop
		window.requestAnimationFrame(this._updateAnimationFrame);
	}

	_updateAnimationFrame(delta){
		//On each animation frame, update positions given delta
		//set state and trigger re-render
		this.request
			//.then(map(getOrbitPosAt(delta/10)))
			.then(data => {
				const {selected} = this.state;
				this.setState({
					data:data.map(getOrbitPosAt(delta/5)), //FIXME: hardcoded time constant
					selected:selected.map(getOrbitPosAt(delta/5))
				});
			});

		window.requestAnimationFrame(this._updateAnimationFrame);
	}

	_updateSelection(selection){
		//Triggered by child component <Legend>
		this.setState({
			selected:selection
		});
	}

	_onHover(x,y,obj){
		//Triggered by child component <DeckGLOverlay>
		if(obj){
			this.setState({
				tooltip:{x,y,obj}
			});
		}else{
			this.setState({
				tooltip:null
			});
		}
	}

	render(){
		const {viewport,data,selected,orbit,tooltip} = this.state;

		return (
			<div className='app'>
				<Legend 
					{...viewport}
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
						selected = {selected}
						orbit = {orbit}
						onHover = {this._onHover.bind(this)}
					>
					</DeckGLOverlay>
				</MapGL>
				<Tooltip d={tooltip}/>
			</div>
		);
	}
}

render(<App />, document.getElementById('root'));
