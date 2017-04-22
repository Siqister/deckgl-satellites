import React,{Component} from 'react';
import {max,scaleLog} from 'd3';

import Brush from './brush';
import CanvasLegend from './canvas-legend';


const style = {
	width:'30%',
	minWidth:'300px',
	height:'100%',
	position:'absolute',
	backgroundColor:'black',
	zIndex:999
};

const margin = {t:50, r:50, b:50, l:50};

class Legend extends Component{
	constructor(props){
		super(props);
		this.state = {
			width:null, //to set the dimensions of children <svg> and <canvas>
			height:null,
			margin:margin
		}

		this._scale = null;
	}

	componentDidMount(){
		this.setState({
			width:this.refs.legend.clientWidth,
			height:this.refs.legend.clientHeight
		});
	}

	componentWillReceiveProps(nextProps){
		//When props.data is first fetched, mine data for max/min and set scale
		//This should happen only once
		if(!this.props.data && nextProps.data){
			const _max = max(nextProps.data, d=>d.apogee);
			const {width,height,margin} = this.state;

			this._scale = scaleLog()
				.domain([_max,1])
				.range([0, height-margin.t-margin.b]);
		}
	}

	render(){
		return (
			<div 
				className='legend'
				style={style}
				ref='legend'
			>
				<Brush 
					{...this.state}
					data={this.props.data}
					scale={this._scale}
				/>
				<CanvasLegend
					{...this.state}
					data={this.props.data}
					scale={this._scale}
				/>
			</div>
		)
	}
}

export default Legend;